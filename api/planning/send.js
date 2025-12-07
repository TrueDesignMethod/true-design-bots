// api/planning/send.js
import fs from 'fs/promises';
import path from 'path';

const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4';
const PROMPT_FILE = path.join(process.cwd(), 'prompts', 'planning-prompt.txt');

function extractJsonLike(text) {
  if (!text) return null;
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return null;
  try {
    return JSON.parse(match[0]);
  } catch {
    return null;
  }
}

async function callOpenAI(messages) {
  const resp = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: MODEL_NAME,
      messages,
      max_tokens: 1400,
      temperature: 0.6,
      top_p: 1
    })
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`OpenAI error ${resp.status}: ${txt}`);
  }

  const data = await resp.json();
  return data.choices?.[0]?.message?.content ?? '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });

  try {
    const { message = '', priorInsights = '' } = req.body || {};

    // If no priorInsights provided, prompt the user to paste their Discovery outputs.
    if (!priorInsights || String(priorInsights).trim() === '') {
      return res.status(200).json({
        needs_priorInsights: true,
        prompt:
          "I don’t yet have your previous session information. Could you paste (or briefly summarize) the outputs from your True Discovery session so I can build on them? For example: your Top 10 values, Motivation Map, Goal Seeds, and Advantages/Disadvantages — or your full Discovery Summary."
      });
    }

    // Load system prompt from file (fallback to concise prompt if file missing)
    let systemPrompt = 'You are TRUE — the values-centered Planning AI.';
    try {
      const txt = await fs.readFile(PROMPT_FILE, 'utf8');
      if (txt && txt.trim()) systemPrompt = txt;
    } catch {
      /* ignore and use fallback */
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `DISCOVERY_INSIGHTS:\n${priorInsights}` },
      { role: 'user', content: `USER_MESSAGE:\n${message}` },
      {
        role: 'assistant',
        content:
          'Using the discovery inputs, produce a Planning output block with these exact keys: priority_goals, refined_goals, micro_steps, obstacle_strategies, accountability, plans, planning_summary, suggested_next_step. Ensure plans include 7_day, 14_day, 30_day, and 90_day arrays. End with: Type "export" to save these planning outputs to your LifePrint, or "align" to move to Alignment.'
      }
    ];

    const reply = await callOpenAI(messages);
    const outputs = extractJsonLike(reply);

    return res.status(200).json({ ok: true, reply, outputs });
  } catch (err) {
    console.error('Planning handler error:', err);
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
}
