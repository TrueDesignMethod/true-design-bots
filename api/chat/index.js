// api/chat/index.js
// TRUE V3 — Chat Entry Point (Vercel-safe, ESM)

import { detectIntent, selectModule, decideModel } from "./router.js";
import { callLLM, MODELS } from "./llm.js";

/* -----------------------------
   Helpers
----------------------------- */

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

/* -----------------------------
   POST Handler
----------------------------- */

async function handlePost(req, res) {
  try {
    const body = await parseBody(req);

    const {
      input = "",
      messages = [],
      declaredStage = "discovery"
    } = body;

    const currentStage = normalizeStage(declaredStage);

    // Intent + module selection
    const intent = detectIntent(input);
    const module = selectModule(currentStage, intent);

    if (!module) {
      throw new Error("No module selected");
    }

    // Choose model
   const model =
  decideModel(module) === "PRO"
    ? MODELS.DEPTH
    : MODELS.STANDARD;

