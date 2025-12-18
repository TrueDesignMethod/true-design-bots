import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Load canonical system prompt once
const SYSTEM_PROMPT = fs.readFileSync(
  path.resolve("prompts/system.txt"),
  "utf8"
);

// Model registry (easy to swap later)
export const MODELS = {
  CHEAP: "gpt-5.2-mini",   // example cheap model
  PRO: "gpt-5.2-pro"
};

/**
 * callLLM
 * - All meaning decisions happen BEFORE this function
 * - This function only executes a bounded generation
 */
export async function callLLM({
  model = MODELS.CHEAP,
  userPrompt,
  maxTokens
}) {
  const body = {
    model,
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userPrompt }
    ],
    max_output_tokens: maxTokens
  };

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "LLM call failed");
  }

  return data.choices[0].message.content;
}
