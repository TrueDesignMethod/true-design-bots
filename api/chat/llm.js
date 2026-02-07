// api/chat/llm.js
// TRUE V3 — LLM Boundary Layer (ESM)
// The model has no authority over stage, pacing, or progression

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// ─────────────────────────────────────────────
// Resolve __dirname in ESM
// ─────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─────────────────────────────────────────────
// Read system prompt safely
// ─────────────────────────────────────────────
const SYSTEM_PROMPT_PATH = path.join(__dirname, "prompts", "system.txt");

let SYSTEM_PROMPT = "";
try {
  SYSTEM_PROMPT = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf8");
} catch (err) {
  console.error(`Failed to read system prompt at ${SYSTEM_PROMPT_PATH}:`, err);
  SYSTEM_PROMPT = "You are TRUE. Follow your stage-aware guidance."; // fallback
}

// ─────────────────────────────────────────────
// Models
// ─────────────────────────────────────────────
export const MODELS = {
  STANDARD: "gpt-3.5-turbo",
  DEPTH: "gpt-3.5-turbo" // reserved for higher nuance when upgraded
};

// ─────────────────────────────────────────────
// Call LLM
// ─────────────────────────────────────────────
export async function callLLM({ model = MODELS.STANDARD, userPrompt, maxTokens = 300 }) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not set in environment");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt }
      ],
      max_tokens: maxTokens,
      temperature: 0.4
    })
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "LLM call failed");
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("LLM returned no usable output");
  }

  return content;
}
