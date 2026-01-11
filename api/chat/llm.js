import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const SYSTEM_PROMPT = fs.readFileSync(
  path.resolve("prompts/system.txt"),
  "utf8"
);

export const MODELS = {
  CHEAP: "gpt-3.5-turbo",
  PRO: "gpt-3.5-turbo" // can use GPT-4 if available for PRO
};

export async function callLLM({
  model = MODELS.CHEAP,
  userPrompt,
  maxTokens = 300
}) {
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
      max_tokens: maxTokens
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
