import fetch from 'node-fetch';


const OPENAI_API_KEY = process.env.OPENAI_API_KEY;


export async function callLLM({ model, system, user, maxTokens }) {
const body = {
model,
messages: [
{ role: 'system', content: system },
{ role: 'user', content: user }
],
max_output_tokens: maxTokens
};


const res = await fetch('https://api.openai.com/v1/chat/completions', {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${OPENAI_API_KEY}`
},
body: JSON.stringify(body)
});


const data = await res.json();


if (!res.ok) {
throw new Error(data.error?.message || 'LLM call failed');
}


return data.choices[0].message.content;
}
