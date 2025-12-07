// api/discovery/send.js
import fs from 'fs/promises';
import path from 'path';

const MODEL_NAME = process.env.MODEL_NAME || 'gpt-4';
const PROMPT_FILE = path.join(process.cwd(), 'prompts', 'discovery-prompt.txt');

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
      max_tokens: 1200,
      temperature: 0.7,
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
    let systemPrompt = 'You are TRUE — a compassionate values-centered AI mentor focused on True Discovery.';
    try {
      const txt = await fs.readFile(PROMPT_FILE, 'utf8');
      if (txt && txt.trim()) systemPrompt = txt;
    } catch {
      /* ignore and use fallback */
    }

    const messages = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: `PRIOR_INSIGHTS:\n${priorInsights}` },
      { role: 'user', content: `USER_MESSAGE:\n${message}` },
      {
        role: 'assistant',
        content:
          'Synthesize the prior insights and the user message. Return a JSON-like block (or clear bullet list) containing these exact keys: top_values, motivation_map, life_snapshot, goal_seeds, advantages, disadvantages, alignment_logic, discovery_summary, suggested_next_step. End with: Type "export" to save this Discovery Summary to your LifePrint, or "continue" to proceed to Planning.'
      }
    ];

    const reply = await callOpenAI(messages);
    const outputs = extractJsonLike(reply);

    return res.status(200).json({ ok: true, reply, outputs });
  } catch (err) {
    console.error('Discovery handler error:', err);
    return res.status(500).json({ ok: false, error: String(err.message || err) });
  }
}
