// api/chat/llm.js
// TRUE V3 — LLM Boundary Layer (Vercel-safe, ESM)
//
// Responsibilities:
// - Read system prompt
// - Call OpenAI with supported models
// - Return assistant text only
//
// NO stage logic
// NO routing logic
// NO governance authority

import fs from "fs";
import path from "path";
import fetch from "node-fetch";
import { fileURLToPath } from "url";

/* -------------------------------------------------
   Environment
------------------------------------------------- */

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error("❌ OPENAI_API_KEY is not set in environment variables");
}

/* -------------------------------------------------
   Resolve __dirname (ESM-safe)
------------------------------------------------- */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* -------------------------------------------------
   Load system prompt (text only)
------------------------------------------------- */

const SYSTEM_PROMPT_PATH = path.join(__dirname, "prompts", "system.txt");

let SYSTEM_PROMPT = "";

try {
  SYSTEM_PROMPT = fs.readFileSync(SYSTEM_PROMPT_PATH, "utf8");
} catch (err) {
  console.error(
    `❌ Failed to read system prompt at ${SYSTEM_PROMPT_PATH}`,
    err
  );

  // Safe fallback — NEVER crash the function on prompt failure
  SYSTEM_PROMPT =
    "You are TRUE — a calm, reflective, stage-aware intelligence.";
}

/* -------------------------------------------------
   Supported Models (CURRENT)
------------------------------------------------- */

export const MODELS = {
  STANDARD: "gpt-4o-mini", // fast + inexpensive
  DEPTH: "gpt-4o"          // higher nuance when required
};

/* -------------------------------------------------
   Call OpenAI
------------------------------------------------- */

export async function callLLM({
  model = MODELS.STANDARD,
  userPrompt,
  maxTokens = 300
}) {
  if (!OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY not set");
  }

  if (!userPrompt || typeof userPrompt !== "string") {
    throw new Error("Invalid userPrompt passed to callLLM");
  }

  const response = await fetch(
    "https://api.openai.com/v1/chat/completions",
    {
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
    }
  );

  const data = await response.json();

  if (!response.ok) {
    console.error("❌ OpenAI API error:", data);
    throw new Error(
      data?.error?.message || "OpenAI request failed"
    );
  }

  const content = data?.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned no content");
  }

  return content;
}
