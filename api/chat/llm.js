// api/chat/llm.js
// TRUE V3 — LLM Boundary Layer (ESM)
// The model has no authority over stage, pacing, or progression

import fs from "fs";
import path from "path";
import fetch from "node-fetch";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = fs.readFileSync(
  path.resolve("prompts/system.txt"),
  "utf8"
);

export const MODELS = {
  STANDARD: "gpt-3.5-turbo",
  DEPTH: "gpt-3.5-turbo" // reserved for higher nuance when upgraded
};

export async function callLLM({ model = MODELS.STANDARD, userPrompt, maxTokens = 300 }) {
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
  if (!content) throw new Error("LLM returned no usable output");

  return content;
}
