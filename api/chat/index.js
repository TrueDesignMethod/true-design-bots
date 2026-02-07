// api/chat/index.js
// TRUE V3 — Chat Entry Point (ESM)

import { detectIntent, selectModule, decideModel } from "./router.js";
import { resolveStage } from "../../core/governance/resolveStage.js";
import { callLLM, MODELS } from "./llm.js";

function normalizeStage(stage) {
  if (stage === "planning") return "sustainment";
  return stage;
}


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
  declaredStage = "discovery",
  evidence = {}
} = body;

const currentStage = normalizeStage(declaredStage);



    const intent = detectIntent(input);
    const module = selectModule(currentStage, intent);
   
console.log("MODULE SELECTED:", module);


    if (!module || module.stage !== currentStage) {
      throw new Error("Stage/module mismatch");
    }

    const model = decideModel(module) === "PRO" ? MODELS.DEPTH : MODELS.STANDARD;

const userPrompt = "[TEST PROMPT]";
const reply = "[TEST] Backend reached reply successfully.";

const nextStage = currentStage;

    return res.json({
      stage: currentStage,
      advanced: nextStage !== currentStage,
      nextStage,
      module: module.name,
      reply
    });

 } catch (err) {
  console.error("TRUE chat error:", err);

  return res.status(500).json({
    error: err.message,
    stack: err.stack
  });
}

}

export default async function handler(req, res) {
  // Allow CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method === "POST") {
    return handlePost(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}
