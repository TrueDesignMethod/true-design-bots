// api/chat/index.js

const MicroCors = require("micro-cors");
const {
  detectStage,
  detectIntent,
  selectModule,
  decideModel
} = require("./router.js");
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
      explicitStage = null,
      intent = null
    } = body;

    // 1. Detect stage (explicit override respected)
    const stage = detectStage({ input, explicitStage });

    // 2. Detect intent (optional, lightweight)
    const resolvedIntent = intent || detectIntent(input);

    // 3. Select module (single-stage, no stacking)
    const module = selectModule(stage, resolvedIntent);

    // 4. Detect previous stage (if assistant messages include stage metadata)
    const previousStage = messages
      .slice()
      .reverse()
      .find(
        m =>
          m.role === "assistant" &&
          typeof m.stage === "string"
      )?.stage || null;

    const stageChanged =
      Boolean(previousStage && previousStage !== stage);

    // 5. Decide model tier (module-driven)
    const modelTier = decideModel(module);
    const model =
      modelTier === "PRO" ? MODELS.PRO : MODELS.CHEAP;

    // 6. Build prompt (module owns tone + framing)
    const userPrompt = module.buildPrompt({
      input,
      messages,
      stage,
      stageChanged,
      previousStage
    });

    // 7. Call LLM
    const reply = await callLLM({
      model,
      userPrompt,
      maxTokens: module.tokenCeiling
    });

    // 8. Respond (explicitly tag stage for future turns)
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
