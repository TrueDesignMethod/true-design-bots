// api/chat/index.js
// TRUE V3 — Chat Entry Point
// Enforces stage authority, prevents silent drift, and preserves user agency

const MicroCors = require("micro-cors");
const {
  detectStage,
  detectIntent,
  selectModule,
  decideModel
} = require("./router.js");

const { resolveEntryStage } = require("./entryResolver.js");
const { callLLM, MODELS } = require("./llm.js");

const cors = MicroCors();

/**
 * parseBody
 * Handles raw Node requests safely
 */
async function parseBody(req) {
  if (req.body) return req.body;

  return new Promise(resolve => {
    let data = "";
    req.on("data", chunk => (data += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(data || "{}"));
      } catch {
        resolve({});
      }
    });
  });
}

async function handlePost(req, res) {
  try {
    const body = await parseBody(req);

    const {
      input = "",
      messages = [],

      // Stage authority inputs
      explicitStage = null,   // user-declared (highest authority)
      sessionStage = null,    // persisted session state
      clientStage = null,     // UI memory only (non-authoritative)

      intent = null,
      consent = false
    } = body;

    // ─────────────────────────────────────────────
    // 1. RESOLVE STAGE (V3 AUTHORITY CONTRACT)
    // ─────────────────────────────────────────────
    const resolution = resolveEntryStage({
      declaredStage: explicitStage,
      sessionStage,
      uiStage: clientStage,
      messages,
      consent
    });

    let stage = resolution?.stage || null;
    let stageSource = resolution?.source || null;

    // ─────────────────────────────────────────────
    // 2. FALLBACK (ONLY IF NO STAGE CONTEXT EXISTS)
    // ─────────────────────────────────────────────
    if (!stage && !sessionStage && !clientStage) {
      stage = detectStage({ input });
      stageSource = "fallback";
    }

    if (!stage) {
      throw new Error("Unable to resolve stage safely");
    }

    // ─────────────────────────────────────────────
    // 3. INTENT DETECTION (NON-DESTRUCTIVE)
    // ─────────────────────────────────────────────
    const resolvedIntent = intent || detectIntent(input);

    // ─────────────────────────────────────────────
    // 4. MODULE SELECTION (STAGE-LOCKED)
    // ─────────────────────────────────────────────
    const module = selectModule(stage, resolvedIntent);

    if (!module || module.stage !== stage) {
      throw new Error("Stage/module mismatch");
    }

    // ─────────────────────────────────────────────
    // 5. MODEL SELECTION (MCL-AWARE)
    // ─────────────────────────────────────────────
    const modelTier = decideModel(module, resolvedIntent);
    const model =
      modelTier === "PRO" ? MODELS.PRO : MODELS.CHEAP;

    // ─────────────────────────────────────────────
    // 6. PROMPT CONSTRUCTION
    // ─────────────────────────────────────────────
    const userPrompt = module.buildPrompt({
      input,
      messages,
      stage
    });

    // ─────────────────────────────────────────────
    // 7. CALL LLM
    // ─────────────────────────────────────────────
    const reply = await callLLM({
      model,
      userPrompt,
      maxTokens: module.tokenCeiling
    });

    // ─────────────────────────────────────────────
    // 8. RESPONSE (TRANSPARENT + TAGGED)
    // ─────────────────────────────────────────────
    return res.json({
      stage,
      stageSource,           // explicit | session | ui | consent | fallback
      module: module.name,
      intent: resolvedIntent,
      reply
    });

  } catch (err) {
    console.error("TRUE chat error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}

module.exports = cors((req, res) => {
  if (req.method === "POST") return handlePost(req, res);
  res.status(405).end();
});
