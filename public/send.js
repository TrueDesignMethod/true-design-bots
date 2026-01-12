// public/send.js
// TRUE V2 client transport layer
// Purpose: send user reflection + context to the server
// This file contains NO routing logic, NO module awareness, NO secrets

async function apiPost(body) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text}`);
  }

  return res.json();
}

/**
 * sendMessage (TRUE V2)
 *
 * Called by the UI when the user submits a message.
 * This function does not reason about stages or modules.
 * It passes context only.
 *
 * @param {string} stage
 *   One of: "discovery" | "planning" | "alignment"
 *
 * @param {Array<{ role: "user" | "assistant", content: string }>} conversation
 *
 * @param {Object} [options]
 *
 * @param {boolean} [options.allowStageTransition=true]
 *   Whether the server may suggest a stage transition.
 *
 * @param {boolean} [options.consent=false]
 *   Explicit user consent to enact a previously suggested stage change.
 *   This should only be true on the turn AFTER a suggestion.
 *
 * @returns {Promise<{
 *   reply: string,
 *   stage: string,
 *   module: string,
 *   intent: string
 * }>}
 */
export async function sendMessage(
  stage,
  conversation = [],
  options = {}
) {
  const lastUser = conversation[conversation.length - 1];

  return apiPost({
    protocolVersion: "TRUE_V2",

    input: lastUser?.content || "",
    messages: conversation,

    // TRUE ENTRY SIGNALS
    declaredStage: stage,
    allowStageTransition:
      options.allowStageTransition !== false,

    // CONSENT SIGNAL (event-based)
    consent: options.consent === true
  });
}
