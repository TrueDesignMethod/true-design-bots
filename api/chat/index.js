/**
 * api/chat/index.js
 * Vercel / serverless-style handler (updated fallback curated options and expanded decision tree).
 *
 * Behavior:
 * - POST with body { stage, mode, messages, payload? }
 *   - mode: 'options' => return model-generated options or curated fallback list
 *   - mode: 'expand'  => expand a chosen option into a full reply (curated branch or LLM)
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

// DECISION TREE (curated, cheap server-side branches)
// Keys are payloads the client will send (e.g., "discover:values" or "discover:value_area:career").
// Each node returns { reply, followUps: [{id,label,payload}, ...] }.
// Extended with Planning & Alignment nodes to reduce LLM usage.
const decisionTree = {
  // Discovery root nodes
  "discover:values": {
    reply: "Great — let's find your core values. Tell me one area of life that feels important to you right now.",
    followUps: [
      { id: "v-career", label: "Career", payload: "discover:value_area:career" },
      { id: "v-well", label: "Wellness", payload: "discover:value_area:wellness" },
      { id: "v-relationships", label: "Relationships", payload: "discover:value_area:relationships" },
      { id: "v-creativity", label: "Creativity", payload: "discover:value_area:creativity" },
      { id: "v-other", label: "Other — I'll type it", payload: "discover:value_area:other" }
    ]
  },

  "discover:motivations": {
    reply: "What energizes you most these days? What gives you a sense of purpose or momentum?",
    followUps: [
      { id: "m-connection", label: "Connection & relationships", payload: "discover:motivation:connection" },
      { id: "m-career", label: "Career growth & challenge", payload: "discover:motivation:career" },
      { id: "m-health", label: "Health & energy", payload: "discover:motivation:health" },
      { id: "m-other", label: "I'll type my own", payload: "discover:motivation:other" }
    ]
  },

  "discover:advantages_disadvantages": {
    reply: "Let's map strengths and challenges. Which strengths, supports, or resources feel most real for you?",
    followUps: [
      { id: "s-skills", label: "Skills & knowledge", payload: "discover:strength:skills" },
      { id: "s-people", label: "People & relationships", payload: "discover:strength:people" },
      { id: "s-routines", label: "Time & routines", payload: "discover:strength:routines" },
      { id: "s-other", label: "I'll describe my own", payload: "discover:strength:other" }
    ]
  },

  "discover:goal_seeds": {
    reply: "What would you love to improve or move toward in the next chapter of your life? Try listing 1–3 short aspirations.",
    followUps: [
      { id: "g-health", label: "I want to feel healthier", payload: "discover:goal:health" },
      { id: "g-career", label: "I want a career shift", payload: "discover:goal:career" },
      { id: "g-boundaries", label: "I want stronger boundaries", payload: "discover:goal:boundaries" },
      { id: "g-other", label: "I'll type my own", payload: "discover:goal:other" }
    ]
  },

  "discover:obstacles": {
    reply: "What tends to get in your way? List obstacles, fears, or limitations (time, confidence, resources, support).",
    followUps: [
      { id: "o-time", label: "Time & scheduling", payload: "discover:obstacle:time" },
      { id: "o-motivation", label: "Confidence & motivation", payload: "discover:obstacle:motivation" },
      { id: "o-resources", label: "Resources & money", payload: "discover:obstacle:resources" },
      { id: "o-other", label: "Other — I'll type", payload: "discover:obstacle:other" }
    ]
  },

  "discover:strengths": {
    reply: "Tell me about strengths, resources, people, or routines that support you.",
    followUps: [
      { id: "str-people", label: "Supportive people", payload: "discover:strengths:people" },
      { id: "str-skills", label: "Skills & training", payload: "discover:strengths:skills" },
      { id: "str-routines", label: "Stable routines/habits", payload: "discover:strengths:routines" },
      { id: "str-other", label: "I'll type my own", payload: "discover:strengths:other" }
    ]
  },

  "discover:updated_story": {
    reply: "If there's one belief or story that no longer fits who you're becoming, what is it? Or what new story would you like to try on?",
    followUps: [
      { id: "st-example1", label: "I'm not enough → I'm learning & growing", payload: "discover:story:example1" },
      { id: "st-example2", label: "I don't deserve rest → I prioritize renewal", payload: "discover:story:example2" },
      { id: "st-other", label: "I'll type my own", payload: "discover:story:other" }
    ]
  },

  "discover:starting_snapshot": {
    reply: "Quick snapshot: On a scale of 1–10, how aligned do you feel in each area? First: Career (1–10).",
    followUps: [
      { id: "snap-career-low", label: "1–3 (low)", payload: "discover:snapshot:career_low" },
      { id: "snap-career-mid", label: "4–7 (somewhat)", payload: "discover:snapshot:career_mid" },
      { id: "snap-career-high", label: "8–10 (high)", payload: "discover:snapshot:career_high" },
      { id: "snap-career-other", label: "I'll type a number", payload: "discover:snapshot:career_custom" }
    ]
  },

  // Example second-level branching (career -> what about career)
  "discover:value_area:career": {
    reply: "Great — thanks for that. What about your career feels important? (Money, structure, supporting family, alignment, other).",
    followUps: [
      { id: "career-money", label: "Money", payload: "discover:value_detail:money" },
      { id: "career-structure", label: "Structure", payload: "discover:value_detail:structure" },
      { id: "career-support", label: "Supporting family", payload: "discover:value_detail:supporting_family" },
      { id: "career-alignment", label: "Alignment", payload: "discover:value_detail:alignment" },
      { id: "career-other", label: "Other — I'll type it", payload: "discover:value_detail:other" }
    ]
  },

  "discover:value_detail:money": {
    reply: "Noted: Money as a key value in career. Would you like to: (1) Explore motivations that connect to this, (2) Add a goal seed related to money, or (3) Identify obstacles that might stop progress?",
    followUps: [
      { id: "goto-motivations", label: "Explore motivations that drive me", payload: "discover:motivations" },
      { id: "add-goal-money", label: "Add a money-related goal seed", payload: "discover:goal:money_seed" },
      { id: "identify-obstacles", label: "Identify obstacles to this goal", payload: "discover:obstacles" }
    ]
  },

  // Generic fallback acknowledgement node
  "ack:default": {
    reply: "Got it — noted. Would you like to continue exploring another area or keep digging into this one?",
    followUps: [
      { id: "continue-discovery", label: "Back to Discovery menu", payload: "discover:values" },
      { id: "go-planning", label: "Switch to Planning", payload: "Planning:main" }
    ]
  },

  //
  // PLANNING branches (curated)
  //
  "planning:prioritize_goals": {
    reply: "Let's surface 1–3 priority goals. Which domain should we focus on first?",
    followUps: [
      { id: "prio-career", label: "Career / income", payload: "planning:prioritize:career" },
      { id: "prio-health", label: "Health / energy", payload: "planning:prioritize:health" },
      { id: "prio-relationships", label: "Relationships / community", payload: "planning:prioritize:relationships" },
      { id: "prio-other", label: "Other — I'll choose", payload: "planning:prioritize:other" }
    ]
  },

  "planning:prioritize:career": {
    reply: "Career chosen. Would you like TRUE to suggest 1–3 goal seeds related to career (salary, role change, side income)?",
    followUps: [
      { id: "career-goalseed-1", label: "Increase monthly income", payload: "planning:goalseed:increase_income" },
      { id: "career-goalseed-2", label: "Apply to X roles this month", payload: "planning:goalseed:apply_roles" },
      { id: "career-goalseed-3", label: "Start a side project", payload: "planning:goalseed:side_project" },
      { id: "career-goalseed-other", label: "I'll add my own", payload: "planning:goalseed:other" }
    ]
  },

  "planning:refine_goal": {
    reply: "Let's refine a goal. Pick which goal to refine or choose 'New goal' to add one now.",
    followUps: [
      { id: "refine-pick-1", label: "Refine a career goal", payload: "planning:refine:career_example" },
      { id: "refine-pick-2", label: "Refine a health goal", payload: "planning:refine:health_example" },
      { id: "refine-new", label: "New goal — I'll type it", payload: "planning:refine:new" }
    ]
  },

  "planning:refine:career_example": {
    reply: "Career goal example: 'Increase revenue from $X to $Y in 90 days.' What does success look like in simple terms?",
    followUps: [
      { id: "refine-success", label: "Define success now", payload: "planning:refine:success_prompt" },
      { id: "refine-emotional", label: "Add emotional anchor", payload: "planning:refine:emotional_anchor" },
      { id: "refine-outcome", label: "Describe desired outcome", payload: "planning:refine:desired_outcome" }
    ]
  },

  "planning:micro_steps": {
    reply: "Micro-steps help momentum. Choose a goal to create a micro-step for, or ask TRUE to suggest one.",
    followUps: [
      { id: "micro-suggest", label: "Suggest a micro-step", payload: "planning:micro:suggest" },
      { id: "micro-choose", label: "I have a goal — create a micro-step", payload: "planning:micro:custom" }
    ]
  },

  "planning:obstacle_map": {
    reply: "Let's match obstacles to strategies. Which obstacle is most relevant right now?",
    followUps: [
      { id: "obs-time", label: "Time & scheduling", payload: "planning:obstacle:time" },
      { id: "obs-motivation", label: "Motivation & follow-through", payload: "planning:obstacle:motivation" },
      { id: "obs-resources", label: "Resources & money", payload: "planning:obstacle:resources" },
      { id: "obs-other", label: "Other — I'll describe", payload: "planning:obstacle:other" }
    ]
  },

  "planning:7day": {
    reply: "7-Day Plan: We'll generate 3 actions, 1 supporting habit, 1 obstacle strategy, and a reflection question. Ready for TRUE to propose?",
    followUps: [
      { id: "7day-gen", label: "Yes — propose a 7-day plan", payload: "planning:7day:generate" },
      { id: "7day-custom", label: "I'll define preferences", payload: "planning:7day:custom" }
    ]
  },

  "planning:7day:generate": {
    reply: "Here is a compact 7-day starter: (1) Action A, (2) Action B, (3) Action C. Habit: X. Obstacle strategy: Y. Reflection: 'What moved the needle this week?' Would you like this expanded into a schedule or exported to your LifePrint?",
    followUps: [
      { id: "7day-export", label: "Export 7-day plan", payload: "planning:7day:export" },
      { id: "7day-schedule", label: "Expand into daily schedule", payload: "planning:7day:schedule" },
      { id: "7day-adjust", label: "Adjust actions", payload: "planning:7day:adjust" }
    ]
  },

  "planning:30day": {
    reply: "30-Day Plan: We'll layer momentum steps, habit progression, two checkpoint reflections, weekly goals and progress markers. Ready for TRUE to propose a 30-day structure?",
    followUps: [
      { id: "30day-gen", label: "Yes — propose 30-day plan", payload: "planning:30day:generate" },
      { id: "30day-custom", label: "I want to set the weekly goals", payload: "planning:30day:custom" }
    ]
  },

  "planning:90day": {
    reply: "90-Day Plan: We'll build monthly milestones, risk prep, and systems for discipline. Do you want a themed 90-day focus (recommended) or a general plan?",
    followUps: [
      { id: "90-theme", label: "Give me a 90-day growth theme", payload: "planning:90day:theme" },
      { id: "90-general", label: "Create a general 90-day roadmap", payload: "planning:90day:generate" }
    ]
  },

  //
  // ALIGNMENT branches (curated)
  //
  "alignment:clutter": {
    reply: "Let's identify clutter. Which area feels most cluttered right now?",
    followUps: [
      { id: "clutter-mental", label: "Mental", payload: "alignment:clutter:mental" },
      { id: "clutter-emotional", label: "Emotional", payload: "alignment:clutter:emotional" },
      { id: "clutter-physical", label: "Physical", payload: "alignment:clutter:physical" },
      { id: "clutter-schedule", label: "Schedule", payload: "alignment:clutter:schedule" }
    ]
  },

  "alignment:release_plan": {
    reply: "Which clutter are you ready to reduce, remove, or delegate?",
    followUps: [
      { id: "release-mental", label: "Reduce mental clutter", payload: "alignment:release:mental" },
      { id: "release-physical", label: "Remove physical clutter", payload: "alignment:release:physical" },
      { id: "release-schedule", label: "Delegate or reduce schedule items", payload: "alignment:release:schedule" },
      { id: "release-other", label: "Other — I'll describe", payload: "alignment:release:other" }
    ]
  },

  "alignment:revision_strategy": {
    reply: "Designing a revision strategy: Do you prefer calendar-based monthly reviews, rhythm-based (energy) reviews, or quick checkpoints?",
    followUps: [
      { id: "rev-monthly", label: "Monthly calendar review", payload: "alignment:revision:monthly" },
      { id: "rev-energy", label: "Rhythm / energy-based reviews", payload: "alignment:revision:energy" },
      { id: "rev-quick", label: "Quick weekly checkpoints", payload: "alignment:revision:weekly" }
    ]
  },

  "alignment:growth_map": {
    reply: "What's stretching you right now? Choose what feels most relevant to your growth.",
    followUps: [
      { id: "grow-skills", label: "Skills to build", payload: "alignment:growth:skills" },
      { id: "grow-challenges", label: "Stretching challenges", payload: "alignment:growth:challenges" },
      { id: "grow-environments", label: "Environments/communities", payload: "alignment:growth:environments" }
    ]
  },

  "alignment:90day_theme": {
    reply: "A 90-day growth theme helps focus energy. Pick one tone for your quarter.",
    followUps: [
      { id: "theme-deepen", label: "Deepen foundational skill", payload: "alignment:90day:deepen" },
      { id: "theme-expand", label: "Expand reach/visibility", payload: "alignment:90day:expand" },
      { id: "theme-stabilize", label: "Stabilize habits/routines", payload: "alignment:90day:stabilize" }
    ]
  },

  "alignment:resilience": {
    reply: "Let's assemble a resilience toolkit. Which area should we start with?",
    followUps: [
      { id: "res-stress", label: "Stress regulation", payload: "alignment:resilience:stress" },
      { id: "res-triggers", label: "Emotional triggers & scripts", payload: "alignment:resilience:triggers" },
      { id: "res-somatic", label: "Somatic practices", payload: "alignment:resilience:somatic" }
    ]
  },

  "alignment:nurture_rituals": {
    reply: "Nurture rituals — choose the cadence you'd like: daily, weekly, or monthly.",
    followUps: [
      { id: "nurture-daily", label: "Daily rituals", payload: "alignment:nurture:daily" },
      { id: "nurture-weekly", label: "Weekly rituals", payload: "alignment:nurture:weekly" },
      { id: "nurture-monthly", label: "Monthly rituals", payload: "alignment:nurture:monthly" }
    ]
  },

  "alignment:iteration_map": {
    reply: "Iteration strategy map helps you adapt without guilt. Pick a revision frequency to start.",
    followUps: [
      { id: "iter-weekly", label: "Weekly quick reviews", payload: "alignment:iteration:weekly" },
      { id: "iter-monthly", label: "Monthly deeper revisions", payload: "alignment:iteration:monthly" },
      { id: "iter-quarterly", label: "Quarterly strategic reviews", payload: "alignment:iteration:quarterly" }
    ]
  }
};

// Build options prompt (same as before)
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

    // EXPAND — expand a chosen option (curated branch or LLM)
    if (mode === "expand") {
      if (!payload) return res.status(400).json({ error: "Missing payload for expand mode." });

      // payload might come in many forms; normalize a key to look up in decisionTree
      // Accept examples: "discover:values", "expand:d-1", "d-1", "discover:value_area:career"
      let lookupKey = String(payload);
      // strip optional "expand:" prefix
      if (lookupKey.startsWith("expand:")) lookupKey = lookupKey.slice("expand:".length);

      // First check direct decisionTree match
      if (decisionTree[lookupKey]) {
        const node = decisionTree[lookupKey];
        // Return curated node shape matching LLM expand output
        return res.json({
          stage,
          reply: node.reply,
          followUps: node.followUps || [],
          generated_at: nowIso(),
          curated: true
        });
      }

      // If lookupKey isn't found in decision tree, try a few heuristics:
      // - If payload looks like "discover:...:other" or endsWith(":other"), return an acknowledgement prompting typed input
      if (lookupKey.endsWith(":other")) {
        return res.json({
          stage,
          reply: "Please type your response in the input box and click Send — I'll record it and continue.",
          followUps: [],
          generated_at: nowIso(),
          curated: true
        });
      }

      // Not in decision tree — fall back to LLM expand (original behavior)
      try {
        // Attempt to find label from cache options if available
        const key = `opts:${ctxHash}`;
        const cached = cacheGet(key);
        let optionLabel = lookupKey;
        if (cached && cached.options) {
          const found = cached.options.find(o => o.id === lookupKey || o.payload === lookupKey);
          if (found) optionLabel = found.label;
        }

        const expandPrompt = buildExpandPrompt(stage, messages, optionLabel, lookupKey);
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
        cacheSet(`exp:${ctxHash}:${lookupKey}`, out, 1000 * 60 * 60 * 6);
        return res.json(out);
      } catch (err) {
        // Final fallback: return curated generic ack
        const node = decisionTree["ack:default"];
        return res.json({
          stage,
          reply: node.reply,
          followUps: node.followUps,
          generated_at: nowIso(),
          fallback: true
        });
      }
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
