/*
send.js — lightweight client-side send helper for TRUE chatbot
- Expects an API endpoint at /api/chat that accepts JSON: { stage, messages }
- messages = [{role: 'system'|'user'|'assistant', content: '...'}]
- Uses fetch; replace token retrieval with your own secure method.
*/


async function sendToTrueBot({ stage = 'Discovery', messages = [] } = {}) {
// Attach the stage name so server selects correct stage-bot behavior
const payload = { stage, messages };


// Use an environment-backed token; in a production app, call your backend which holds secrets.
const res = await fetch('/api/chat', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(payload),
});


if (!res.ok) {
const text = await res.text();
throw new Error(`Server error: ${res.status} ${text}`);
}


const data = await res.json();
// Expected response shape: { reply: '...', jsonOutput: {...} }
return data;
}


// Small helper for UI integration
export async function sendUserMessage(stage, userMessage, conversation = []) {
// conversation is an array of previous messages (objects: role + content)
const messages = [
{ role: 'system', content: 'Load prompt.txt (TRUE system) and operate as the chosen stage-bot.' },
...conversation,
{ role: 'user', content: userMessage },
];


const response = await sendToTrueBot({ stage, messages });
return response;
}


// Example quick test (uncomment in dev only)
// sendUserMessage('Discovery', 'I want to start.').then(r => console.log(r)).catch(e => console.error(e));
