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

export async function fetchLatestSession(userId) {
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

export async function getLatestSession(userId) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("user_id", userId)
    .order("last_active_at", { ascending: false })
    .limit(1);

  if (error || !data || data.length === 0) return null;
  return data[0];
}

export async function loadUserSessions(userId) {
  const { data: sessions } = await supabase
    .from("sessions")
    .select("id, title, current_stage, created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const sidebar = document.getElementById("sidebar");

// Preserve header, clear only session entries
sidebar.querySelectorAll(".session-entry").forEach(el => el.remove());


  if (!sessions || sessions.length === 0) return;

  sessions.forEach((session) => {
    const div = document.createElement("div");
    div.className = "session-entry";
    div.textContent = session.title || "Untitled reflection";

    div.dataset.sessionId = session.id;
    div.dataset.stage = session.current_stage;

    sidebar.appendChild(div);
  });

  // ✅ ADD THIS BLOCK — RIGHT HERE
  sidebar
    .querySelector(".session-entry")
    ?.classList.add("active");
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
