/**
 * api/discovery/send.js
 * True Discovery serverless handler
 *
 * Expects JSON body: { message: "<user text>", priorInsights: "<optional discovery summary text>" }
 * Reads system prompt from '../../prompts/discovery-prompt.txt'
 *
 * Returns JSON:
 *  - If priorInsights missing:
 *      { needs_priorInsights: true, prompt: "<exact prompt to show user>" }
 *  - Otherwise:
 *      { ok: true, reply: "<assistant text>", outputs: <parsed object or null> }
 */

const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4';
const PROMPT_PATH = path.join(__dirname, '../../prompts/discovery-prompt.txt');

function extractJsonLike(text) {
  // Try to extract the first JSON-like block {...}
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    // attempt to parse
    return JSON.parse(match[0]);
  } catch (e) {
    // not valid JSON — return null so frontend still gets raw text
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
      max_tokens: 1200,
      temperature: 0.7,
      top_p: 1,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI error: ${res.status} ${txt}`);
  }
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content ?? '';
  return content;
}

module.exports = async function handleDiscovery(req, res) {
  try {
    const body = req.body || {};
    const { message = '', priorInsights = '' } = body;

    // If no priorInsights provided, prompt the user to paste their Discovery outputs.
    if (!priorInsights || String(priorInsights).trim() === '') {
      return res.json({
        needs_priorInsights: true,
        prompt:
          "I don’t yet have your previous session information. Could you paste (or briefly summarize) the outputs from your True Discovery session so I can build on them? For example: your Top 10 values, Motivation Map, Goal Seeds, and Advantages/Disadvantages — or your full Discovery Summary.",
      });
    }

    // Load system prompt (if file missing, fall back to inline short prompt)
    let systemPrompt = 'You are TRUE — a compassionate values-centered AI mentor focused on True Discovery.';
    try {
      if (fs.existsSync(PROMPT_PATH)) {
        systemPrompt = fs.readFileSync(PROMPT_PATH, 'utf8');
      }
    } catch (e) {
      // ignore and use fallback
    }

    // Build messages: system, user priorInsights, user message, assistant instruction
    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `PRIOR_INSIGHTS:\n${priorInsights}` },
      { role: 'user', content: `USER_MESSAGE:\n${message}` },
      {
        role: 'assistant',
        content:
          'Synthesize the prior insights and user message. OUTPUT: return a JSON-like block or bullet list that includes the following keys (exact names): top_values, motivation_map, life_snapshot, goal_seeds, advantages, disadvantages, alignment_logic, discovery_summary, suggested_next_step. End with: Type "export" to save this Discovery Summary to your LifePrint, or "continue" to proceed to Planning.',
      },
    ];

    const reply = await callOpenAIChat(messages);

    // Try to parse JSON-like block from reply for structured outputs
    const outputs = extractJsonLike(reply);

    return res.json({ ok: true, reply, outputs });
  } catch (err) {
    console.error('Discovery handler error:', err);
    return res.status(500).json({ ok: false, error: err.message || String(err) });
  }
};
