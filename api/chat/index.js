/**
 * api/chat/index.js
 * Vercel / serverless-style handler (updated fallback curated options).
 *
 * Behavior:
 * - POST with body { stage, mode, messages, payload? }
 *   - mode: 'options' => return model-generated options or curated fallback list
 *   - mode: 'expand'  => expand a chosen option into a full reply
 *   - mode: 'full'    => full free-text generation
 *
 * Note: for production use a cross-instance cache (Redis/Vercel KV).
 */

import { readFileSync } from "fs";
import path from "path";
import MicroCors from "micro-cors";
import OpenAI from "openai";

const cors = MicroCors();
const PROMPT_TXT = readFileSync(path.resolve(process.cwd(), "prompts", "prompt.txt"), "utf8");
const OPENAI_KEY = process.env.OPENAI_API_KEY;
if (!OPENAI_KEY) {
  console.warn("Warning: OPENAI_API_KEY missing — server will fail on LLM calls.");
}
const client = new OpenAI({ apiKey: OPENAI_KEY });

// Simple in-memory cache with TTL
const cache = new Map();
function cacheSet(key, value, ttlMs = 1000 * 60 * 60) { // default 1 hour
  const expires = Date.now() + ttlMs;
  cache.set(key, { value, expires });
}
function cacheGet(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    cache.delete(key);
    return null;
  }
  return entry.value;
}

// Utilities
function nowIso() { return new Date().toISOString(); }
function hashContext(stage, messages) {
  try { return `${stage}:${JSON.stringify(messages || []).slice(0, 1000)}`; }
  catch { return `${stage}:default`; }
}
function parseModelJson(text) {
  try {
    const firstBrace = text.indexOf("{");
    if (firstBrace >= 0) {
      const jsonText = text.slice(firstBrace);
      return JSON.parse(jsonText);
    } else {
      return { reply: text };
    }
  } catch (e) {
    return { reply: text };
  }
}

// Curated fallback options (exact labels you specified)
const curatedFallbacks = {
  Discovery: [
    { id: "d-1", label: "Help me discover my values", payload: "discover:values" },
    { id: "d-2", label: "Explore motivations that drive me", payload: "discover:motivations" },
    { id: "d-3", label: "Uncover my strengths and weaknesses", payload: "discover:advantages_disadvantages" },
    { id: "d-4", label: "Help me figure out 1-3 goals this month", payload: "discover:goal_seeds" },
    { id: "d-5", label: "Identify potential obstacles or fears to my goals", payload: "discover:obstacles" },
    { id: "d-6", label: "Identify what strengths or resources I already have", payload: "discover:strengths" },
    { id: "d-7", label: "Explore the new story I want to create for myself", payload: "discover:updated_story" },
    { id: "d-8", label: "Provide my starting point snapshot", payload: "discover:starting_snapshot" }
  ],
  Planning: [
    { id: "p-1", label: "Discover 1-3 goals I want to prioritize this month", payload: "planning:prioritize_goals" },
    { id: "p-2", label: "Help me refine my goal: Clear goal statement, emotional anchor, desired outcome", payload: "planning:refine_goal" },
    { id: "p-3", label: "Provide one microstep, one momentum step, and one supporting habit", payload: "planning:micro_steps" },
    { id: "p-4", label: "Help me uncover which obstacles apply to this goal", payload: "planning:obstacle_map" },
    { id: "p-5", label: "Develop a 7-day action plan: 3 actions, 1 habit, 1 obstacle strategy, 1 reflection question", payload: "planning:7day" },
    { id: "p-6", label: "Develop a 30-day action plan: momentum steps, habit progression, checkpoint reflections", payload: "planning:30day" },
    { id: "p-7", label: "Develop a 90-day action plan: monthly milestones, risk prep, systems for discipline", payload: "planning:90day" }
  ],
  Alignment: [
    { id: "a-1", label: "Help me identify my clutter: mental, emotional, physical, schedule", payload: "alignment:clutter" },
    { id: "a-2", label: "Identify which clutter I am ready to reduce, remove, or delegate", payload: "alignment:release_plan" },
    { id: "a-3", label: "Design how I will revise my goals when needed", payload: "alignment:revision_strategy" },
    { id: "a-4", label: "Identify what is helping me grow", payload: "alignment:growth_map" },
    { id: "a-5", label: "Give me a 90-day growth theme", payload: "alignment:90day_theme" },
    { id: "a-6", label: "Help me build a resilience toolkit", payload: "alignment:resilience" },
    { id: "a-7", label: "Give me nurture rituals based on energy, values, personality", payload: "alignment:nurture_rituals" },
    { id: "a-8", label: "Create an iteration strategy map for me", payload: "alignment:iteration_map" }
  ]
};

function buildOptionsPrompt(stage, messages) {
  const userContext = (messages || []).slice(-6).map(m => `${m.role}: ${m.content}`).join("\n");
  return `${PROMPT_TXT}

INSTRUCTION:
Produce 3 short clickable reply options (labels only), 6–20 words each, action-oriented and context-aware for the stage "${stage}".
Return JSON ONLY in this exact shape:

{"options":[{"id":"opt-1","label":"...","payload":"..."}, {"id":"opt-2","label":"...","payload":"..."}, {"id":"opt-3","label":"...","payload":"..."}], "generated_at":"${nowIso()}"}

Context:
${userContext}
END.`;
}

function buildExpandPrompt(stage, messages, optionLabel, optionPayload) {
  const userContext = (messages || []).slice(-8).map(m => `${m.role}: ${m.content}`).join("\n");
  return `${PROMPT_TXT}

INSTRUCTION:
Expand the user-facing option into a helpful, human-friendly reply for the stage "${stage}".
Option: ${optionLabel}
Payload: ${optionPayload}

Context:
${userContext}

Output JSON:
{"reply":"<full-text>","followUps":["..."], "generated_at":"<iso>"}
END.`.replace("<iso>", nowIso());
}

// Handler
async function handlePost(req, res) {
  try {
    const body = req.body || (await new Promise(r => {
      let data = "";
      req.on("data", chunk => data += chunk);
      req.on("end", () => r(JSON.parse(data || "{}")));
    }));
    const { stage = "Discovery", mode = "options", messages = [], payload = null } = body;

    if (!["options","expand","full"].includes(mode)) {
      return res.status(400).json({ error: "Invalid mode. Use 'options','expand', or 'full'." });
    }
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages must be an array" });

    const ctxHash = hashContext(stage, messages);

    // OPTIONS
    if (mode === "options") {
      const key = `opts:${ctxHash}`;
      const cached = cacheGet(key);
      if (cached) return res.json({ stage, options: cached.options, generated_at: cached.generated_at, cached: true });

      // Try LLM-generated short options (low temp)
      try {
        const optionsPrompt = buildOptionsPrompt(stage, messages);
        const llmResp = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: PROMPT_TXT },
            { role: "user", content: optionsPrompt }
          ],
          max_tokens: 180,
          temperature: 0.2
        });
        const rawText = llmResp.choices?.[0]?.message?.content ?? "";
        let parsed = parseModelJson(rawText);
        if (!parsed.options || !Array.isArray(parsed.options) || parsed.options.length === 0) {
          // fall back to curated
          parsed = { options: (curatedFallbacks[stage] || curatedFallbacks["Discovery"]) };
        }
        const out = { stage, options: parsed.options, generated_at: nowIso() };
        cacheSet(key, out, 1000 * 60 * 60);
        return res.json(out);
      } catch (err) {
        // LLM failed — return curated fallback
        const out = { stage, options: (curatedFallbacks[stage] || curatedFallbacks["Discovery"]), generated_at: nowIso(), fallback: true };
        cacheSet(key, out, 1000 * 60 * 60);
        return res.json(out);
      }
    }

    // EXPAND — expand a chosen option (higher-cost)
    if (mode === "expand") {
      if (!payload) return res.status(400).json({ error: "Missing payload for expand mode." });
      const [action, param] = String(payload).split(":",2);

      // If expanding a specific cached option id -> try to locate label
      if (action === "expand" && param) {
        const key = `opts:${ctxHash}`;
        const cached = cacheGet(key);
        let optionLabel = param, optionPayload = payload;
        if (cached && cached.options) {
          const found = cached.options.find(o => o.id === param || o.payload === payload);
          if (found) { optionLabel = found.label; optionPayload = found.payload; }
        }
        const expandPrompt = buildExpandPrompt(stage, messages, optionLabel, optionPayload);
        const llmResp = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: PROMPT_TXT },
            { role: "user", content: expandPrompt }
          ],
          max_tokens: 450,
          temperature: 0.6
        });
        const rawText = llmResp.choices?.[0]?.message?.content ?? "";
        const parsed = parseModelJson(rawText);
        const out = { stage, reply: parsed.reply ?? rawText, followUps: parsed.followUps ?? [], generated_at: nowIso() };
        cacheSet(`exp:${ctxHash}:${payload}`, out, 1000 * 60 * 60 * 6);
        return res.json(out);
      }

      // If payload is "custom:..." (this server endpoint still supports expanding custom text if client sends it)
      if (action === "custom") {
        const userText = String(payload).slice(7) || "";
        const expandPrompt = `${PROMPT_TXT}\n\nINSTRUCTION: Expand and respond helpfully to the user's custom input for stage ${stage}.\nUser text:\n${userText}\n\nReturn JSON: { "reply": "...", "followUps": ["..."], "generated_at": "${nowIso()}" }\n`;
        const llmResp = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: PROMPT_TXT },
            { role: "user", content: expandPrompt }
          ],
          temperature: 0.7,
          max_tokens: 500
        });
        const rawText = llmResp.choices?.[0]?.message?.content ?? "";
        const parsed = parseModelJson(rawText);
        return res.json({ stage, reply: parsed.reply ?? rawText, followUps: parsed.followUps ?? [], generated_at: nowIso() });
      }

      return res.status(400).json({ error: "Unsupported expand payload." });
    }

    // FULL free-text generation (exports, big summaries)
    if (mode === "full") {
      const llmResp = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: PROMPT_TXT },
          ...messages
        ],
        max_tokens: 800,
        temperature: 0.7
      });
      const rawText = llmResp.choices?.[0]?.message?.content ?? "";
      return res.json({ stage, reply: rawText, generated_at: nowIso() });
    }

    return res.status(400).json({ error: "Unhandled request." });
  } catch (err) {
    console.error("Chat handler error:", err);
    return res.status(500).json({ error: "Server error", message: String(err?.message ?? err) });
  }
}

export default cors((req, res) => {
  if (req.method === "POST") return handlePost(req, res);
  res.setHeader("Allow", "POST");
  res.status(405).end("Method Not Allowed");
});
