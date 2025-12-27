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

    // 1. Detect stage (with explicit override + plan/alignment jumps)
    const stage = detectStage({ input, explicitStage });

    // 2. Detect intent (lightweight, optional)
    let resolvedIntent = intent || detectIntent(input);

    if (!resolvedIntent && stage === "discovery") {
      resolvedIntent = "values";
    }

    // 3. Select module
    const module = selectModule(stage, resolvedIntent);

    // 4. Detect stage transition (for optional announcement)
    const previousStage = messages
      .slice()
      .reverse()
      .find(m => m.role === "assistant" && m.stage)?.stage;

    const stageChanged = Boolean(previousStage && previousStage !== stage);

    // 5. Decide model tier
    const modelTier = decideModel(module);
    const model = modelTier === "PRO" ? MODELS.PRO : MODELS.CHEAP;

    // 6. Build prompt (this is where reflection vs planning tone lives)
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

    // 8. Respond
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
