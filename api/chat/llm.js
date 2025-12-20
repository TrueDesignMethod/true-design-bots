import fetch from "node-fetch";
import fs from "fs";
import path from "path";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is not set");
}

// Load canonical system prompt once
const SYSTEM_PROMPT = fs.readFileSync(
  path.resolve("prompts/system.txt"),
  "utf8"
);

// Model registry (real, supported models)
export const MODELS = {
  CHEAP: "gpt-4.1-mini",
  PRO: "gpt-4.1"
};

/**
 * callLLM
 * - All meaning decisions happen BEFORE this function
 * - This function only executes a bounded generation
 * - Uses OpenAI Responses API (not chat.completions)
 */
export async function callLLM({
  model = MODELS.CHEAP,
  userPrompt,
  maxTokens
}) {
  const res = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: "system",
          content: [{ type: "text", text: SYSTEM_PROMPT }]
        },
        {
          role: "user",
          content: [{ type: "text", text: userPrompt }]
        }
      ],
      max_output_tokens: maxTokens
    })
  });

  const data = await res.json();

  // 🔍 Always log raw response during development
  console.log("LLM RAW RESPONSE:", JSON.stringify(data, null, 2));

  if (!res.ok) {
    throw new Error(data.error?.message || "LLM call failed");
  }

  // ✅ Responses API canonical extraction
  if (data.output_text && data.output_text.trim()) {
    return data.output_text;
  }

  throw new Error("LLM returned no usable output");
}
