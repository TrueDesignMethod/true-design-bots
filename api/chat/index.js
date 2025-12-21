// api/chat/index.js

const MicroCors = require("micro-cors");
const {
  detectStage,
  detectIntent,
  selectModule,
  decideModel
} = require("./router.js");
const { callLLM, MODELS } = require("./llm.js");
const { MCL } = require("./mcl.js");

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

    const { input = "", messages = [], explicitStage = null, intent = null } = body;

    const stage = detectStage({ input, explicitStage });

    let resolvedIntent = intent || detectIntent(input);
    if (!resolvedIntent && stage === "discovery") {
      resolvedIntent = "values";
    }

    const module = selectModule(stage, resolvedIntent);

    const previousStage = messages
      .slice()
      .reverse()
      .find(m => m.role === "assistant" && m.stage)?.stage;

    const stageChanged = previousStage && previousStage !== stage;

    const modelTier = decideModel(module);
    const model = modelTier === "PRO" ? MODELS.PRO : MODELS.CHEAP;

    const userPrompt = module.buildPrompt({
      input,
      messages,
      stageChanged,
      previousStage
    });

    const reply = await callLLM({
      model,
      userPrompt,
      maxTokens: module.tokenCeiling
    });

    return res.json({
      stage,
      module: module.name,
      intent: resolvedIntent,
      reply
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}

module.exports = cors((req, res) => {
  if (req.method === "POST") return handlePost(req, res);
  res.status(405).end();
});
