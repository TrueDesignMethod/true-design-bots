// public/send.js
// Lightweight client-side gateway for TRUE
// Purpose: send user reflection + stage to the server
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
 * sendMessage
 * Called by index.html when the user sends a message.
 *
 * @param {string} stage - "Discovery" | "Planning" | "Alignment"
 * @param {Array} conversation - [{ role, content }]
 *
 * @returns {Promise<{ reply: string }>}
 */
export async function sendMessage(stage, conversation = []) {
  const lastUserMessage = [...conversation]
    .reverse()
    .find(m => m.role === "user");

  return apiPost({
    input: lastUserMessage?.content || "",
    messages: conversation,
    explicitStage: stage.toLowerCase()
  });
}

