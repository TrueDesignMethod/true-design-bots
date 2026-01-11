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
 * @param {boolean} [options.allowStageTransition=true]
 *   Whether the server may suggest a stage transition.
 *   This does NOT force a transition.
 *
 * @returns {Promise<{
 *   reply: string,
 *   suggestedStage?: "discovery" | "planning" | "alignment",
 *   requiresConsent?: boolean
 * }>}
 */
export async function sendMessage(stage, conversation = [], options = {}) {
  const lastUser = conversation[conversation.length - 1];

  return apiPost({
    protocolVersion: "TRUE_V2",

    input: lastUser?.content || "",
    messages: conversation,

    clientStage: stage,
    allowStageTransition:
      options.allowStageTransition !== false
  });
}
