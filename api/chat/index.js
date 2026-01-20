// api/chat/index.js
// TRUE V3 — Chat Entry Point
// Single-entry system with exit-criteria–driven progression

const MicroCors = require("micro-cors");

const {
  getCurrentPosition,
  getNextPosition
} = require("./progression.js");

const {
  evaluateExitCriteria
} = require("./exitCriteria.js");

const {
  selectModule,
  decideModel
} = require("./router.js");

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

      // Persisted progression state
      sessionProgress = null, // { stage, section }

      consent = false
    } = body;

    // ─────────────────────────────────────────────
    // 1. RESOLVE CURRENT POSITION (V3 RULE)
    // Everyone starts at TRUE Discovery → Target
    // ─────────────────────────────────────────────
    const current = getCurrentPosition({
      sessionProgress,
      consent
    });

    if (!current?.stage || !current?.section) {
      throw new Error("Unable to resolve user position safely");
    }

    const { stage, section } = current;

    // ─────────────────────────────────────────────
    // 2. SELECT MODULE (POSITION-LOCKED)
    // ─────────────────────────────────────────────
    const module = selectModule(stage, section);

    if (!module || module.stage !== stage) {
      throw new Error("Stage/module mismatch");
    }

    // ─────────────────────────────────────────────
    // 3. MODEL SELECTION
    // ─────────────────────────────────────────────
    const modelTier = decideModel(module);
    const model =
      modelTier === "PRO" ? MODELS.PRO : MODELS.CHEAP;

    // ─────────────────────────────────────────────
    // 4. PROMPT CONSTRUCTION
    // ─────────────────────────────────────────────
    const userPrompt = module.buildPrompt({
      input,
      messages,
      stage,
      section
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
    // 6. EXIT CRITERIA EVALUATION
    // Determines whether user may advance
    // ─────────────────────────────────────────────
    const exitResult = evaluateExitCriteria({
      stage,
      section,
      input,
      messages,
      reply
    });

    let nextPosition = current;

    if (exitResult?.passed === true) {
      nextPosition = getNextPosition({
        stage,
        section
      });
    }

    // ─────────────────────────────────────────────
    // 7. RESPONSE (CLEAR + NON-PUSHY)
    // ─────────────────────────────────────────────
    return res.json({
      position: {
        stage,
        section
      },
      advanced: exitResult?.passed === true,
      nextPosition,
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
