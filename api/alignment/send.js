/**
 * api/alignment/send.js
 * True Alignment serverless handler
 *
 * Expects JSON body: { message: "<user text>", priorInsights: "<optional planning or discovery summary text>" }
 * Reads system prompt from '../../prompts/alignment-prompt.txt'
 *
 * Behavior:
 *  - If priorInsights missing, returns needs_priorInsights + exact prompt
 *  - Otherwise calls OpenAI and returns { ok, reply, outputs }
 */

const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4';
const PROMPT_PATH = path.join(__dirname, '../../prompts/alignment-prompt.txt');

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

module.exports = async function handleAlignment(req, res) {
  try {
    const body = req.body || {};
    const { message = '', priorInsights = '' } = body;

    if (!priorInsights || String(priorInsights).trim() === '') {
      return res.json({
        needs_priorInsights: true,
        prompt:
          "I don’t yet have your previous session information. Could you paste (or briefly summarize) the outputs from your True Discovery or True Planning session so I can build on them? For example: your Top 5 values, 7-day/30-day plans, and the Planning Summary.",
      });
    }

    // Load system prompt
    let systemPrompt = 'You are TRUE — alignment-focused.';
    try {
      if (fs.existsSync(PROMPT_PATH)) {
        systemPrompt = fs.readFileSync(PROMPT_PATH, 'utf8');
      }
    } catch (e) {
      // ignore
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `PRIOR_INSIGHTS:\n${priorInsights}` },
      { role: 'user', content: `USER_MESSAGE:\n${message}` },
      {
        role: 'assistant',
        content:
          'Return an Alignment Kit as a JSON-like block with these keys (exact names): simplification_plan, iteration_strategy, growth_opportunities, resilience_toolkit, nurture_rituals, alignment_summary, suggested_next_step. End with: Type "export" to save this Alignment Kit to your LifePrint, or "rediscover" if you want to return to Discovery.',
      },
    ];

    const reply = await callOpenAIChat(messages);
    const outputs = extractJsonLike(reply);

    return res.json({ ok: true, reply, outputs });
  } catch (err) {
    console.error('Alignment handler error:', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};
