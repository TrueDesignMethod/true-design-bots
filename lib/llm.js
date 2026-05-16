// lib/llm.js

import OpenAI from "openai";


const client = new OpenAI({

  apiKey:
    process.env.OPENAI_API_KEY
});


export async function llm({

  prompt,

  model = "gpt-4o-mini",

  maxTokens = 300

}) {

  const completion =
    await client.chat.completions.create({

      model,

      messages: [

        {
          role: "user",
          content: prompt
        }
      ],

      max_tokens: maxTokens,

      temperature: 0.7
    });


  return completion
    .choices?.[0]
    ?.message
    ?.content
    ?.trim() || "";
}
