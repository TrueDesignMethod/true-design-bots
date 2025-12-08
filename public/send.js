// public/send.js
// Client-side helper to interact with /api/chat
// Exposes methods: fetchOptions, expandOption, sendFull
// This file intentionally contains no secrets.

async function apiPost(body) {
  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const t = await res.text();
    throw new Error(`Server ${res.status}: ${t}`);
  }
  return res.json();
}

export async function fetchOptions(stage, conversation = []) {
  return apiPost({ stage, mode: "options", messages: conversation });
}

export async function expandOption(stage, conversation = [], payload) {
  // payload examples: "expand:opt-1", "custom:My custom question text..."
  return apiPost({ stage, mode: "expand", messages: conversation, payload });
}

export async function sendFull(stage, conversation = []) {
  return apiPost({ stage, mode: "full", messages: conversation });
}
