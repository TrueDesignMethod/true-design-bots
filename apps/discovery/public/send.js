/**
 * send.js — True Discovery
 * Minimal Node handler to build the Discovery conversation and call OpenAI.
 *
 * Usage:
 * - Deploy as a serverless function or use in Express.
 * - Expects JSON body: { message: "<user text>", priorInsights: "<optional discovery summary text>" }
 *
 * Notes:
 * - Replace process.env.OPENAI_API_KEY with your key.
 * - MODEL_NAME is a placeholder; set to your chosen model (e.g., "gpt-4" or other).
 */

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4';

async function callOpenAI(messages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      top_p: 1,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data.choices[0].message.content;
}

module.exports = async function handleDiscovery(req, res) {
  try {
    const { message, priorInsights } = req.body || {};

    // If no priorInsights provided, prompt the user to paste their Discovery outputs.
    if (!priorInsights) {
      return res.json({
        needs_priorInsights: true,
        prompt:
          "I don’t yet have your previous session information. Could you paste (or briefly summarize) the outputs from your True Discovery session so I can build on them? For example: your Top 10 values, Motivation Map, Goal Seeds, and Advantages/Disadvantages — or your full Discovery Summary.",
      });
    }

    // Build the conversation for the model: system + user-provided priorInsights + user's current message
    const messages = [
      {
        role: 'system',
        content:
          'You are TRUE — a compassionate values-centered AI mentor focused on True Discovery. Produce a Clarity Bundle from the provided priorInsights and any new input the user gives. See prompt.txt for exact output structure.',
      },
      { role: 'user', content: `PRIOR_INSIGHTS:\n${priorInsights}` },
      { role: 'user', content: `USER_MESSAGE:\n${message || ''}` },
      {
        role: 'assistant',
        content:
          'Please synthesize the prior insights and current user message, then output the Clarity Bundle as JSON-like bullets (top_values, motivation_map, life_snapshot, goal_seeds, advantages, disadvantages, alignment_logic, discovery_summary, suggested_next_step). End with: Type "export" to save this Discovery Summary to your LifePrint, or "continue" to proceed to Planning.',
      },
    ];

    const reply = await callOpenAI(messages);
    return res.json({ ok: true, reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
