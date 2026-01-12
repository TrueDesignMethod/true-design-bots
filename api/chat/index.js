// api/chat/index.js

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

async function handlePost(req, res) {
  try {
    const body =
      req.body ||
      (await new Promise(resolve => {
        let data = "";
        req.on("data", chunk => (data += chunk));
        req.on("end", () => {
          try {
            resolve(JSON.parse(data || "{}"));
          } catch {
            resolve({});
          }
        });
      }));

    const {
      input = "",
      messages = [],
      clientStage = null,   // ← IMPORTANT
      explicitStage = null, // ← ONLY user-declared
      intent = null,
      sessionStage = null,
      consent = false
    } = body;

    // ─────────────────────────────────────────────
    // 1. RESOLVE STAGE (LOCKED, V2)
    // ─────────────────────────────────────────────
    let stage = resolveEntryStage({
      sessionStage,
      clientStage,
      declaredStage: explicitStage,
      messages,
      consent
    });

    // ─────────────────────────────────────────────
    // 2. FALLBACK ONLY (legacy / malformed)
    // ─────────────────────────────────────────────
    if (!stage) {
      stage = detectStage({ input });
    }

    // ─────────────────────────────────────────────
    // 3. INTENT (NON-DESTRUCTIVE)
    // ─────────────────────────────────────────────
    const resolvedIntent = intent || detectIntent(input);

    // ─────────────────────────────────────────────
    // 4. MODULE SELECTION (STAGE-SAFE)
    // ─────────────────────────────────────────────
    const module = selectModule(stage, resolvedIntent);

    // ─────────────────────────────────────────────
    // 5. MODEL SELECTION
    // ─────────────────────────────────────────────
    const modelTier = decideModel(module);
    const model =
      modelTier === "PRO" ? MODELS.PRO : MODELS.CHEAP;

    // ─────────────────────────────────────────────
    // 6. PROMPT
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
    // 8. RESPONSE (STAGE TAGGED)
    // ─────────────────────────────────────────────
    return res.json({
      stage,
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
