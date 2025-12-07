/**
 * send.js — True Planning
 * Expects JSON body: { message: "<user text>", priorInsights: "<optional discovery summary text>" }
 *
 * If priorInsights is missing, returns a prompt instructing the user to paste their Discovery outputs.
 */

const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));
const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4';

async function callOpenAI(messages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
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

module.exports = async function handlePlanning(req, res) {
  try {
    const { message, priorInsights } = req.body || {};

    if (!priorInsights) {
      return res.json({
        needs_priorInsights: true,
        prompt:
          "I don’t yet have your previous session information. Could you paste (or briefly summarize) the outputs from your True Discovery session so I can build on them? For example: your Top 10 values, Motivation Map, Goal Seeds, and Advantages/Disadvantages — or your full Discovery Summary.",
      });
    }

    const messages = [
      {
        role: 'system',
        content:
          'You are TRUE — a focused planning AI. Use the provided Discovery outputs to create 1–3 prioritized goals and build micro-steps, obstacle strategies, accountability systems, and 7/14/30/90 day plans. Follow the prompt.txt output format.',
      },
      { role: 'user', content: `DISCOVERY_INSIGHTS:\n${priorInsights}` },
      { role: 'user', content: `USER_MESSAGE:\n${message || ''}` },
      {
        role: 'assistant',
        content:
          'Please produce the Planning outputs as a clearly labeled block (priority_goals, refined_goals, micro_steps, obstacle_strategies, accountability, plans, planning_summary, suggested_next_step). Finish with: Type "export" to save these planning outputs to your LifePrint, or "align" to move to Alignment.',
      },
    ];

    const reply = await callOpenAI(messages);
    return res.json({ ok: true, reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
