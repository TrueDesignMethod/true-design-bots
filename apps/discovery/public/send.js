// send.js — TRUE Discovery (client-side)
// Place at apps/discovery/public/send.js
// Usage: import or include this file in the discovery index.html and call sendToBot(message)

const API_ENDPOINT = window.TRUE_API_ENDPOINT || '/api/chat' // replace with your deployed endpoint if needed
const BOT_NAME = 'discovery'
const MAX_RETRIES = 2
const RETRY_DELAY_BASE = 400 // ms

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
 * sendToBot
 * @param {string} message - user message
 * @param {string} userId - logged-in user's ID (replace with auth id)
 * @param {function} onProgress - optional callback to stream tokens / partial responses
 */
export async function sendToBot(message, userId, onProgress){
  if (!message || typeof message !== 'string') throw new Error('Invalid message')
  if (!userId) console.warn('No userId provided — use placeholder or wire up auth')

  const payload = { bot: BOT_NAME, message, user_id: userId }

  const opts = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }

  // Attempt streaming first (server must support streaming)
  try {
    const res = await safeFetch(API_ENDPOINT, { ...opts })
    // If server returns SSE/stream, you can detect and stream; fallback to JSON
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('text/event-stream') || contentType.includes('stream')) {
      // example SSE parsing (very small minimal parser)
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false
      let accumulated = ''
      while (!done) {
        const { value, done: streamDone } = await reader.read()
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          accumulated += chunk
          if (typeof onProgress === 'function') onProgress(chunk, accumulated)
        }
        done = streamDone
      }
      return accumulated
    } else {
      const json = await res.json()
      if (json.error) throw new Error(json.error)
      return json.assistant ?? json.reply ?? json.output ?? ''
    }
  } catch (err) {
    // If streaming or direct fetch fails, attempt a final non-stream fallback
    console.error('Primary send failed, attempting fallback:', err)
    // try one final fetch (no streaming expectations)
    const res2 = await safeFetch(API_ENDPOINT, opts, 0)
    const json2 = await res2.json()
    if (json2.error) throw new Error(json2.error)
    return json2.assistant ?? json2.reply ?? json2.output ?? ''
  }
}
