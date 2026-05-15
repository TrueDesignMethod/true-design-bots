// api/chat/llm.js
// TRUE AI — OpenAI Wrapper (ESM)

import OpenAI from "openai";


// ----------------------------------
// OpenAI Client
// ----------------------------------
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


// ----------------------------------
// Model Registry
// ----------------------------------
export const MODELS = {

  // Fast reflective generation
  STANDARD: "gpt-4.1-mini",

  // Deeper synthesis + LifePrint assembly
  SYNTHESIS: "gpt-4.1",

  // Reserved for future expansion
  ADVANCED: "gpt-4.1"
};


// ----------------------------------
// Core LLM Call
// ----------------------------------
export async function callLLM({
  model = MODELS.STANDARD,

  systemPrompt = "",

  userPrompt = "",

  temperature = 0.7,

  maxTokens = 500
}) {

  try {

    const completion =
      await client.chat.completions.create({

        model,

        temperature,

        max_tokens: maxTokens,

        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: userPrompt
          }
        ]
      });


    return (
      completion.choices?.[0]?.message?.content?.trim()
      || ""
    );

  } catch (err) {

    console.error("LLM Error:", err);

    throw new Error(
      "Unable to generate reflective response."
    );
  }
}
