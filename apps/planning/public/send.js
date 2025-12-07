// send.js — TRUE Planning (client-side)
// Place at apps/planning/public/send.js
const API_ENDPOINT = window.TRUE_API_ENDPOINT || '/api/chat'
const BOT_NAME = 'planning'
const MAX_RETRIES = 2
const RETRY_DELAY_BASE = 400

async function sleep(ms){return new Promise(r=>setTimeout(r,ms))}

async function safeFetch(url, opts, retries = MAX_RETRIES){
  try {
    const res = await fetch(url, opts)
    if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`)
    return res
  } catch (err) {
    if (retries > 0) {
      await sleep(RETRY_DELAY_BASE * (MAX_RETRIES - retries + 1))
      return safeFetch(url, opts, retries - 1)
    }
    throw err
  }
}

/**
 * sendToBot for Planning
 * returns assistant text
 */
export async function sendToBot(message, userId, onProgress){
  if (!message) throw new Error('Message required')
  if (!userId) console.warn('No userId provided')

  const payload = { bot: BOT_NAME, message, user_id: userId }

  const opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }

  try {
    const res = await safeFetch(API_ENDPOINT, opts)
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      return json.assistant ?? ''
    } else {
      // fallback to text
      const text = await res.text()
      if (onProgress) onProgress(text)
      return text
    }
  } catch (err) {
    console.error('sendToBot (planning) failed:', err)
    throw err
  }
}
