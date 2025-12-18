import MicroCors from "micro-cors";
import { detectStage, detectIntent, selectModule, decideModel } from "./router.js";
import { callLLM, MODELS } from "./llm.js";
import { MCL } from "./mcl.js";

const cors = MicroCors();

async function handlePost(req, res) {
  try {
    const body = req.body || await new Promise(resolve => {
      let data = "";
      req.on("data", chunk => (data += chunk));
      req.on("end", () => resolve(JSON.parse(data || "{}")));
    });

    const { input = "", messages = [], explicitStage = null, intent = null } = body;

    if (!input && messages.length === 0) {
      return res.status(400).json({ error: "No input provided." });
    }

    // 1. Determine stage (server authority)
    const stage = detectStage({ input, explicitStage });

    // 2. Detect intent if not explicitly set
    const resolvedIntent = intent || detectIntent(input);

    // 3. Select module
    const module = selectModule(stage, resolvedIntent);

    if (!module) {
      throw new Error(`No module resolved for stage "${stage}"`);
    }

    // 4. Enforce MCL invariants
    if (MCL.invariants.oneStageOnly && module.stage !== stage) {
      throw new Error("Stage violation detected.");
    }

    // 5. Decide model
    const modelTier = decideModel(module.meta);
    const model = modelTier === "PRO" ? MODELS.PRO : MODELS.CHEAP;

    // 6. Build module prompt
    const userPrompt = module.buildPrompt({ input, messages });

    // 7. Execute LLM call
    const reply = await callLLM({ model, userPrompt, maxTokens: module.meta.tokenCeiling });

    return res.json({
      stage,
      module: module.meta.name,
      intent: resolvedIntent,
      reply
    });

  } catch (err) {
    console.error("TRUE chat error:", err);
    return res.status(500).json({
      error: "Server error",
      message: err.message
    });
  }
}

export default cors((req, res) => {
  if (req.method === "POST") return handlePost(req, res);
  res.setHeader("Allow", "POST");
  res.status(405).end("Method Not Allowed");
});
