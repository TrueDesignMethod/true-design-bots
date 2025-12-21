// api/chat/index.js

import MicroCors from "micro-cors";
import { detectStage, detectIntent, selectModule, decideModel } from "./router.js";
import { callLLM, MODELS } from "./llm.js";
import { MCL } from "./mcl.js";

const cors = MicroCors();

async function handlePost(req, res) {
  try {
    // Parse JSON body
    const body = req.body || await new Promise(resolve => {
      let data = "";
      req.on("data", chunk => { data += chunk; });
      req.on("end", () => {
        try { resolve(JSON.parse(data || "{}")); }
        catch (err) { console.error("JSON parse error:", err); resolve({}); }
      });
    });

    const { input = "", messages = [], explicitStage = null, intent = null } = body;

    if (!input && messages.length === 0) {
      return res.status(400).json({ error: "No input provided." });
    }

    // 1. Determine stage
    const stage = detectStage({ input, explicitStage });

    // 2. Detect intent
    let resolvedIntent = intent || detectIntent(input);
    if (!resolvedIntent && stage === "discovery") {
      resolvedIntent = "values"; // default for Discovery
    }

    // 3. Select module
    const module = selectModule(stage, resolvedIntent);
    if (!module) {
      throw new Error(`No module resolved for stage "${stage}"`);
    }

    // 4. Enforce MCL invariants
    if (MCL.invariants.oneStageOnly && module.stage && module.stage !== stage) {
      throw new Error(
        `Stage violation: resolved module "${module.name}" belongs to "${module.stage}" but stage is "${stage}"`
      );
    }

    // 5. Decide model
    const modelTier = decideModel(module);
    const model = modelTier === "PRO" ? MODELS.PRO : MODELS.CHEAP;

    const stage = detectStage({ input, explicitStage });

// NEW: Detect stage change
const previousStage = messages
  .slice()
  .reverse()
  .find(m => m.role === "assistant")?.stage;

const stageChanged = previousStage && previousStage !== stage;

    // 6. Build prompt
   const userPrompt = module.buildPrompt({
  input,
  messages,
  stageChanged,
  previousStage
});


    // 7. Call GPT-3.5
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
