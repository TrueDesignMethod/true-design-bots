// api/chat/index.js
// TRUE V3 — Chat Entry Point (ESM)

import MicroCors from "micro-cors";
import { detectIntent, selectModule, decideModel } from "./router.js";
import { resolveStage } from "../../core/governance/resolveStage.js";
import { callLLM, MODELS } from "./llm.js";

const cors = MicroCors();

async function parseBody(req) {
  if (req.body) return req.body;
  return new Promise((resolve) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
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
      stage: currentStage = "discovery",
      evidence = {}
    } = body;

    const intent = detectIntent(input);
    const module = selectModule(currentStage, intent);

    if (!module || module.stage !== currentStage) {
      throw new Error("Stage/module mismatch");
    }

    const model = decideModel(module) === "PRO" ? MODELS.DEPTH : MODELS.STANDARD;

    const userPrompt = module.buildPrompt({ input, messages, stage: currentStage });
    const reply = await callLLM({ model, userPrompt, maxTokens: module.tokenCeiling });

    const nextStage = resolveStage({ currentStage, requestedStage: body.requestedStage, evidence });

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

export default cors((req, res) => {
  if (req.method === "POST") return handlePost(req, res);
  res.status(405).end();
});
