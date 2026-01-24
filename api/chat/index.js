// api/chat/index.js
// TRUE V3 — Chat Entry Point
// Governance-authoritative progression

const MicroCors = require("micro-cors");

const {
  detectIntent,
  selectModule,
  decideModel
} = require("./router");

const { resolveStage } = require("../../core/governance/resolveStage");
const { callLLM, MODELS } = require("./llm");

const cors = MicroCors();

/**
 * parseBody
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

      // Persisted session state
      stage: currentStage = "discovery",

      // Evidence accumulated client-side or server-side
      evidence = {}
    } = body;

    // ─────────────────────────────────────────────
    // 1. DETECT INTENT (SECTION ONLY)
    // ─────────────────────────────────────────────
    const intent = detectIntent(input);

    // ─────────────────────────────────────────────
    // 2. SELECT MODULE (STAGE-LOCKED)
    // ─────────────────────────────────────────────
    const module = selectModule(currentStage, intent);

    if (!module || module.stage !== currentStage) {
      throw new Error("Stage/module mismatch");
    }

    // ─────────────────────────────────────────────
    // 3. MODEL SELECTION (MCL-COMPLIANT)
    // ─────────────────────────────────────────────
    const modelTier = decideModel(module);
    const model =
      modelTier === "PRO" ? MODELS.DEPTH : MODELS.STANDARD;

    // ─────────────────────────────────────────────
    // 4. PROMPT CONSTRUCTION
    // ─────────────────────────────────────────────
    const userPrompt = module.buildPrompt({
      input,
      messages,
      stage: currentStage
    });

    // ─────────────────────────────────────────────
    // 5. CALL LLM
    // ─────────────────────────────────────────────
    const reply = await callLLM({
      model,
      userPrompt,
      maxTokens: module.tokenCeiling
    });

    // ─────────────────────────────────────────────
    // 6. GOVERNANCE-STAGE RESOLUTION
    // ─────────────────────────────────────────────
    const nextStage = resolveStage({
      currentStage,
      requestedStage: body.requestedStage, // optional
      evidence
    });

    // ─────────────────────────────────────────────
    // 7. RESPONSE
    // ─────────────────────────────────────────────
    return res.json({
      stage: currentStage,
      advanced: nextStage !== currentStage,
      nextStage,
      module: module.name,
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
