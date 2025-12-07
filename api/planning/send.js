/**
 * api/planning/send.js
 * True Planning serverless handler
 *
 * Expects JSON body: { message: "<user text>", priorInsights: "<optional discovery summary text>" }
 * Reads system prompt from '../../prompts/planning-prompt.txt'
 *
 * Behavior:
 *  - If priorInsights missing, returns needs_priorInsights + exact prompt
 *  - Otherwise calls OpenAI and returns { ok, reply, outputs }
 */

const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4';
const PROMPT_PATH = path.join(__dirname, '../../prompts/planning-prompt.txt');

function extractJsonLike(text) {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch (e) {
    return null;
  }
}

async function callOpenAIChat(messages) {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      max_tokens: 1400,
      temperature: 0.6,
      top_p: 1,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${txt}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content ?? '';
}

module.exports = async function handlePlanning(req, res) {
  try {
    const body = req.body || {};
    const { message = '', priorInsights = '' } = body;

    // If no priorInsights provided, prompt user to paste Discovery outputs
    if (!priorInsights || String(priorInsights).trim() === '') {
      return res.json({
        needs_priorInsights: true,
        prompt:
          "I don’t yet have your previous session information. Could you paste (or briefly summarize) the outputs from your True Discovery session so I can build on them? For example: your Top 10 values, Motivation Map, Goal Seeds, and Advantages/Disadvantages — or your full Discovery Summary.",
      });
    }

    // Load system prompt
    let systemPrompt = 'You are TRUE — the values-centred Planning AI.';
    try {
      if (fs.existsSync(PROMPT_PATH)) {
        systemPrompt = fs.readFileSync(PROMPT_PATH, 'utf8');
      }
    } catch (e) {
      // ignore, use fallback
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `DISCOVERY_INSIGHTS:\n${priorInsights}` },
      { role: 'user', content: `USER_MESSAGE:\n${message}` },
      {
        role: 'assistant',
        content:
          'Using the discovery inputs, produce a Planning output block with these keys (exact names): priority_goals, refined_goals, micro_steps, obstacle_strategies, accountability, plans, planning_summary, suggested_next_step. Plans should include 7_day, 14_day, 30_day, 90_day arrays. End with: Type "export" to save these planning outputs to your LifePrint, or "align" to move to Alignment.',
      },
    ];

    const reply = await callOpenAIChat(messages);
    const outputs = extractJsonLike(reply);

    return res.json({ ok: true, reply, outputs });
  } catch (err) {
    console.error('Planning handler error:', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};
