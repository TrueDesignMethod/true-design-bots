// api/chat/index.js
// TRUE V3 — Chat Entry Point (Vercel-safe, ESM)

import { detectIntent, selectModule, decideModel } from "./router.js";
import { callLLM, MODELS } from "./llm.js";

// Translate frontend stages to backend stages
function normalizeStage(stage) {
  if (stage === "planning") return "sustainment";
  return stage || "discovery";
}

// Safe body parser for Vercel
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
    const { input = "", declaredStage = "discovery" } = body;

    const currentStage = normalizeStage(declaredStage);
    const intent = detectIntent(input);
    const module = selectModule(currentStage, intent);

    if (!module) {
      throw new Error("No module selected");
    }

    const model =
      decideModel(module) === "PRO"
        ? MODELS.DEPTH
        : MODELS.STANDARD;

    const reply = await callLLM({
      model,
      userPrompt: input,
      maxTokens: 300
    });

    return res.status(200).json({
      reply,
      stage: currentStage,
      module: module.name || "unknown"
    });

  } catch (err) {
    console.error("TRUE chat error:", err);
    return res.status(500).json({ error: err.message });
  }
}

export default async function handler(req, res) {
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
