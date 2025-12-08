/**
 * api/chat/index.js
 * Vercel / serverless-style handler.
 *
 * Behavior:
 * - POST with body { stage, mode, messages, payload? }
 *   - mode: 'options' => return 3 short clickable options (low-cost)
 *   - mode: 'expand'  => expand a chosen option into a full reply (higher-cost)
 *   - mode: 'full'    => full free-text generation (higher-cost)
 *
 * Caching:
 * - In-memory Map cache with TTL (works for warm serverless instances; consider Redis for prod).
 *
 * Environment:
 * - OPENAI_API_KEY must be set in Vercel env vars.
 *
 * Security:
 * - Validate inputs and sanitize.
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
function nowIso() {
  return new Date().toISOString();
}
function safeJson(data) {
  try { return JSON.parse(JSON.stringify(data)); } catch { return data; }
}
function hashContext(stage, messages) {
  // Lightweight deterministic hash to key options cache. Use JSON.stringify + length as simple fingerprint.
  try {
    return `${stage}:${JSON.stringify(messages || []).slice(0, 1000)}`; // simple; replace with crypto hash for prod
  } catch {
    return `${stage}:default`;
  }
}

// Build an options-generation prompt instructing the model to return JSON array of options
function buildOptionsPrompt(stage, messages) {
  const userContext = (messages || []).slice(-6).map(m => `${m.role}: ${m.content}`).join("\n");
  return `${PROMPT_TXT}

INSTRUCTION:
You will produce 3 short clickable reply options (labels only) for the user,
each 6–20 words, action-oriented, context-aware to the stage "${stage}".
Return JSON ONLY in this exact shape:

{"options":[{"id":"opt-1","label":"...","payload":"..."},
            {"id":"opt-2","label":"...","payload":"..."},
            {"id":"opt-3","label":"...","payload":"..."}],
 "generated_at":"<iso>"

Use payloads that are short hints like "ask_area:career", "pick_value", "expand:custom". Keep labels user-facing.
Context:
${userContext}
END.`.replace("<iso>", nowIso());
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
{"reply":"<full-text>"}
  
Make the reply concise but actionable (3–6 short paragraphs / or bullet list if appropriate).
Include any short follow-ups the user can click next (2–3 suggestions) inside a "followUps" array in the JSON output.
Add a generated_at ISO timestamp.
END.`;
}

function parseModelJson(text) {
  // Try to extract JSON object from model text response
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

// Handler
async function handlePost(req, res) {
  try {
    const body = req.body || (await new Promise(r => {
      let data = "";
      req.on("data", chunk => data += chunk);
      req.on("end", () => r(JSON.parse(data || "{}")));
    }));
    const { stage = "Discovery", mode = "options", messages = [], payload = null } = body;

    if (!["options", "expand", "full"].includes(mode)) {
      return res.status(400).json({ error: "Invalid mode. Use 'options','expand', or 'full'." });
    }

    // Basic validation
    if (!Array.isArray(messages)) return res.status(400).json({ error: "messages must be an array" });

    const ctxHash = hashContext(stage, messages);

    // MODE: options -> generate or return cached options
    if (mode === "options") {
      const key = `opts:${ctxHash}`;
      const cached = cacheGet(key);
      if (cached) return res.json({ stage, options: cached.options, generated_at: cached.generated_at, cached: true });

      // Ask model to produce 3 short options using low temp & low tokens
      const optionsPrompt = buildOptionsPrompt(stage, messages);
      const llmResp = await client.chat.completions.create({
        model: "gpt-4o-mini", // lower-cost-ish option; change to your preferred model
        messages: [
          { role: "system", content: PROMPT_TXT },
          { role: "user", content: optionsPrompt }
        ],
        max_tokens: 180,
        temperature: 0.2,
      });

      const rawText = llmResp.choices?.[0]?.message?.content ?? "";
      let parsed = parseModelJson(rawText);
      // Ensure we have options fallback
      if (!parsed.options || !Array.isArray(parsed.options)) {
        // fallback minimal deterministic options
        parsed = {
          options: [
            { id: "opt-1", label: "Tell TRUE more in your own words (type)", payload: "custom:input" },
            { id: "opt-2", label: `Pick a suggested prompt for ${stage}`, payload: "suggested:pick" },
            { id: "opt-3", label: "I want a custom expansion (free text)", payload: "expand:custom" }
          ]
        };
      }

      const out = { stage, options: parsed.options.slice(0, 3), generated_at: nowIso() };
      cacheSet(key, out, 1000 * 60 * 60); // cache 1 hour
      return res.json(out);
    }

    // MODE: expand -> expand a chosen option (higher-cost)
    if (mode === "expand") {
      if (!payload) return res.status(400).json({ error: "Missing payload for expand mode." });

      // If payload is 'custom:...' we expand user-provided text; if expand:optId we try to reconstruct from last options
      const [action, param] = String(payload).split(":", 2);

      // If expanding the cached option text, try to find it in cached options
      if (action === "expand" && param) {
        const key = `opts:${ctxHash}`;
        const cached = cacheGet(key);
        let optionLabel = param;
        let optionPayload = payload;
        if (cached && cached.options) {
          const found = cached.options.find(o => o.id === param || o.payload === `expand:${param}` || o.id === `opt-${param}`);
          if (found) {
            optionLabel = found.label;
            optionPayload = found.payload;
          }
        }
        const expandPrompt = buildExpandPrompt(stage, messages, optionLabel, optionPayload);

        const llmResp = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: PROMPT_TXT },
            { role: "user", content: expandPrompt }
          ],
          max_tokens: 450,
          temperature: 0.6,
        });

        const rawText = llmResp.choices?.[0]?.message?.content ?? "";
        const parsed = parseModelJson(rawText);
        const out = {
          stage,
          reply: parsed.reply ?? rawText,
          followUps: parsed.followUps ?? [],
          generated_at: nowIso()
        };
        // cache expansions short-term
        cacheSet(`exp:${ctxHash}:${payload}`, out, 1000 * 60 * 60 * 6);
        return res.json(out);
      }

      // If custom user text to expand: payload = "custom:<text>"
      if (action === "custom") {
        const userText = String(payload).slice(7) || "";
        const expandPrompt = `${PROMPT_TXT}\n\nINSTRUCTION: Expand and respond helpfully to the user's custom input for stage ${stage}.\nUser text:\n${userText}\n\nReturn JSON: {"reply":"...","followUps":[...],"generated_at":"..."}\n`;
        const llmResp = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: PROMPT_TXT },
            { role: "user", content: expandPrompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        });
        const rawText = llmResp.choices?.[0]?.message?.content ?? "";
        const parsed = parseModelJson(rawText);
        const out = {
          stage,
          reply: parsed.reply ?? rawText,
          followUps: parsed.followUps ?? [],
          generated_at: nowIso()
        };
        return res.json(out);
      }

      // fallback
      return res.status(400).json({ error: "Unsupported expand payload." });
    }

    // MODE: full -> produce a full free-text reply (useful for exports, summaries)
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
