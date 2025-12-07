// send.js — TRUE Alignment (client-side)
// Place at apps/alignment/public/send.js
const API_ENDPOINT = window.TRUE_API_ENDPOINT || '/api/chat'
const BOT_NAME = 'alignment'

async function safeFetch(url, opts){
  const res = await fetch(url, opts)
  if (!res.ok) {
    const text = await res.text().catch(()=>null)
    throw new Error(`Request failed ${res.status}: ${text || res.statusText}`)
  }
  return res
}

/**
 * sendToBot for Alignment
 */
export async function sendToBot(message, userId){
  if (!message) throw new Error('Message required')
  const payload = { bot: BOT_NAME, message, user_id: userId }

  const res = await safeFetch(API_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })
  const json = await res.json()
  if (json.error) throw new Error(json.error)
  return json.assistant ?? ''
}
