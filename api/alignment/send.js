/**
 * send.js — True Alignment
 * Minimal Node handler to build the Alignment conversation and call OpenAI.
 *
 * Usage:
 * - Deploy as a serverless function or use in Express.
 * - Expects JSON body: { message: "<user text>", priorInsights: "<optional planning or discovery summary text>" }
 *
 * Notes:
 * - Replace process.env.OPENAI_API_KEY with your key.
 * - MODEL_NAME is a placeholder; set to your chosen model (e.g., "gpt-4" or "gpt-4.1-mini").
 */

const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));
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
      max_tokens: 1200,
      temperature: 0.6,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${txt}`);
  }

  const data = await res.json();
  return data.choices[0].message.content;
}

module.exports = async function handleAlignment(req, res) {
  try {
    const { message, priorInsights } = req.body || {};

    // If no priorInsights provided, prompt the user to paste previous outputs
    if (!priorInsights) {
      return res.json({
        needs_priorInsights: true,
        prompt:
          "I don’t yet have your previous session information. Could you paste (or briefly summarize) the outputs from your True Discovery or True Planning session so I can build on them? For example: your Top 10 values, 7-day/30-day plans, and the Planning Summary.",
      });
    }

    // Build the conversation for the model
    const messages = [
      {
        role: 'system',
        content:
          'You are TRUE — alignment-focused. Use the provided inputs to produce simplification, iteration, growth, resilience, and nurture outputs in the defined structure (see prompt.txt).',
      },
      { role: 'user', content: `PRIOR_INSIGHTS:\n${priorInsights}` },
      { role: 'user', content: `USER_MESSAGE:\n${message || ''}` },
      {
        role: 'assistant',
        content:
          'Please return the Alignment Kit as labeled blocks: simplification_plan, iteration_strategy, growth_opportunities, resilience_toolkit, nurture_rituals, alignment_summary, suggested_next_step. End with: Type "export" to save this Alignment Kit to your LifePrint, or "rediscover" if you want to return to Discovery.',
      },
    ];

    const reply = await callOpenAI(messages);
    return res.json({ ok: true, reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
