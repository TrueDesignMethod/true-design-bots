// api/chat/llm.js

import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Load canonical system prompt once
const SYSTEM_PROMPT = fs.readFileSync(
  path.resolve("prompts/system.txt"),
  "utf8"
);

// Model registry
export const MODELS = {
  CHEAP: "gpt-5-mini",
  PRO: "gpt-5"
};

/**
 * callLLM
 * Executes a single bounded generation using the Responses API.
 */
export async function callLLM({
  model = MODELS.CHEAP,
  userPrompt,
  maxTokens
}) {
  const body = {
    model,
    input: [
      {
        role: "system",
        content: [
          { type: "input_text", text: SYSTEM_PROMPT }
        ]
      },
      {
        role: "user",
        content: [
          { type: "input_text", text: userPrompt }
        ]
      }
    ],
    max_output_tokens: maxTokens
  };

  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify(body)
  });

  const data = await res.json();

  console.log("LLM RAW RESPONSE:", JSON.stringify(data, null, 2));

  if (!res.ok) {
    throw new Error(data.error?.message || "LLM call failed");
  }

  // Correct Responses API extraction
  if (data.output_text) {
    return data.output_text;
  }

  throw new Error("LLM returned no usable output");
}
