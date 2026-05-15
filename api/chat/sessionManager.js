// api/chat/sessionManager.js
// TRUE AI — Supabase Session Manager

import { supabase } from "../../lib/supabase.js";


// --------------------------------------------------
// Get Session
// --------------------------------------------------
export async function getSession(sessionId) {

  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("session_id", sessionId)
    .single();

  if (error) {
    return null;
  }

  return data;
}


// --------------------------------------------------
// Create Session
// --------------------------------------------------
export async function createSession(sessionId) {

  const payload = {
    session_id: sessionId,

    discovery_state: "reflect",

    participant_profile: {},

    metadata: {
      readinessLevel: "emerging"
    }
  };

  const { data, error } = await supabase
    .from("sessions")
    .insert(payload)
    .select()
    .single();

  if (error) {
    throw new Error(
      "Unable to create session."
    );
  }

  return data;
}


// --------------------------------------------------
// Get Or Create Session
// --------------------------------------------------
export async function getOrCreateSession(
  sessionId
) {

  let session = await getSession(sessionId);

  if (!session) {
    session = await createSession(sessionId);
  }

  return session;
}


// --------------------------------------------------
// Update Discovery State
// --------------------------------------------------
export async function updateDiscoveryState(
  sessionId,
  discoveryState
) {

  const { data, error } = await supabase
    .from("sessions")
    .update({
      discovery_state: discoveryState,
      updated_at: new Date().toISOString()
    })
    .eq("session_id", sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(
      "Unable to update discovery state."
    );
  }

  return data;
}


// --------------------------------------------------
// Update Participant Profile
// --------------------------------------------------
export async function updateParticipantProfile(
  sessionId,
  updates = {}
) {

  const session =
    await getOrCreateSession(sessionId);

  const updatedProfile = {
    ...(session.participant_profile || {}),
    ...updates
  };

  const { data, error } = await supabase
    .from("sessions")
    .update({
      participant_profile: updatedProfile,
      updated_at: new Date().toISOString()
    })
    .eq("session_id", sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(
      "Unable to update participant profile."
    );
  }

  return data;
}


// --------------------------------------------------
// Add Conversation History
// --------------------------------------------------
export async function addToHistory({
  sessionId,
  role,
  content
}) {

  const { error } = await supabase
    .from("session_history")
    .insert({
      session_id: sessionId,
      role,
      content
    });

  if (error) {
    throw new Error(
      "Unable to save conversation history."
    );
  }

  return true;
}


// --------------------------------------------------
// Get Recent History
// --------------------------------------------------
export async function getRecentHistory(
  sessionId,
  limit = 12
) {

  const { data, error } = await supabase
    .from("session_history")
    .select("*")
    .eq("session_id", sessionId)
    .order("created_at", {
      ascending: false
    })
    .limit(limit);

  if (error) {
    return [];
  }

  return data.reverse();
}


// --------------------------------------------------
// Update Metadata
// --------------------------------------------------
export async function updateMetadata(
  sessionId,
  metadata = {}
) {

  const session =
    await getOrCreateSession(sessionId);

  const updatedMetadata = {
    ...(session.metadata || {}),
    ...metadata
  };

  const { data, error } = await supabase
    .from("sessions")
    .update({
      metadata: updatedMetadata,
      updated_at: new Date().toISOString()
    })
    .eq("session_id", sessionId)
    .select()
    .single();

  if (error) {
    throw new Error(
      "Unable to update metadata."
    );
  }

  return data;
}
