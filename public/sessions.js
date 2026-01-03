// sessions.js
// Handles all Supabase persistence for TRUE sessions + messages

import { supabase } from "./supabase.js";

/* ───────── Sessions ───────── */

export async function createSession(userId, stage = "discovery") {
  const { data, error } = await supabase
    .from("sessions")
    .insert({
      user_id: userId,
      current_stage: stage
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getLatestSession(userId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("last_active_at", { ascending: false })
    .limit(1)
    .single();

  if (error) return null;
  return data;
}

export async function getAllSessions(userId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("id, started_at, current_stage")
    .eq("user_id", userId)
    .order("started_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function loadUserSessions(userId) {
  const sidebar = document.getElementById("sidebar");
  sidebar.innerHTML = `<h3>Session History</h3>`;

  const { data, error } = await supabase
  .from("sessions")
  .select("id, started_at, current_stage")
  .eq("user_id", userId)
  .order("last_active_at", { ascending: false });


  if (error) {
    console.error("Error loading sessions:", error);
    return;
  }

 if (!data || data.length === 0) {
  const empty = document.createElement("div");
  empty.className = "session-entry";
  empty.textContent = "Reflections you save will appear here.";
  sidebar.appendChild(empty);
  return;
}


  data.forEach((session) => {
    const div = document.createElement("div");
    div.className = "session-entry";
    const date = new Date(session.started_at).toLocaleDateString();
    div.textContent = `Reflection · ${date}`;
    sidebar.appendChild(div);
  });
}


/* ───────── Messages ───────── */

export async function saveMessage(sessionId, role, content) {
  const { error } = await supabase
    .from("messages")
    .insert({
      session_id: sessionId,
      role,
      content
    });

  if (error) throw error;
}

export async function getMessages(sessionId) {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at");

  if (error) throw error;
  return data;
}
