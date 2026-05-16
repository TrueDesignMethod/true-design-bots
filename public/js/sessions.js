// public/sessions.js
// TRUE AI — Discovery Session Manager

import { supabase }
  from "/js/supabase.js";

import {
  getCurrentUser
} from "/js/auth.js";


// --------------------------------------------------
// Create Session
// --------------------------------------------------
// Creates a new Discovery session
// in Supabase.
//
// Returns:
// {
//   id,
//   created_at,
//   ...
// }
// --------------------------------------------------

export async function createSession({

  title = "Untitled Discovery",

  phase = "TARGET"

} = {}) {

  const user =
    getCurrentUser();

  if (!user) {

    console.warn(
      "TRUE AI: Cannot create session without user."
    );

    return null;
  }


  const { data, error } =
    await supabase

      .from("discovery_sessions")

      .insert({

        user_id:
          user.id,

        title,

        current_phase:
          phase
      })

      .select()

      .single();


  if (error) {

    console.error(
      "TRUE AI createSession error:",
      error
    );

    return null;
  }

  return data;
}


// --------------------------------------------------
// Save Conversation Message
// --------------------------------------------------
// Saves a Discovery message
// to the database.
//
// Roles:
// - user
// - assistant
// --------------------------------------------------

export async function saveMessage({

  sessionId,

  role,

  content,

  phase = "TARGET"

}) {

  if (!sessionId) {

    console.warn(
      "TRUE AI: Missing session ID."
    );

    return;
  }


  const { error } =
    await supabase

      .from("discovery_messages")

      .insert({

        session_id:
          sessionId,

        role,

        content,

        phase
      });


  if (error) {

    console.error(
      "TRUE AI saveMessage error:",
      error
    );
  }
}


// --------------------------------------------------
// Update Session Phase
// --------------------------------------------------

export async function updateSessionPhase({

  sessionId,

  phase

}) {

  if (!sessionId) return;


  const { error } =
    await supabase

      .from("discovery_sessions")

      .update({

        current_phase:
          phase
      })

      .eq("id", sessionId);


  if (error) {

    console.error(
      "TRUE AI updateSessionPhase error:",
      error
    );
  }
}


// --------------------------------------------------
// Save LifePrint
// --------------------------------------------------
// Stores completed LifePrint narrative.
// --------------------------------------------------

export async function saveLifePrint({

  sessionId,

  narrative,

  structured = {}

}) {

  if (!sessionId) return;


  const { error } =
    await supabase

      .from("lifeprints")

      .insert({

        session_id:
          sessionId,

        narrative,

        structured_data:
          structured
      });


  if (error) {

    console.error(
      "TRUE AI saveLifePrint error:",
      error
    );
  }
}


// --------------------------------------------------
// Load User Sessions
// --------------------------------------------------
// Returns:
// [
//   {
//     id,
//     title,
//     current_phase,
//     created_at
//   }
// ]
// --------------------------------------------------

export async function loadSessions() {

  const user =
    getCurrentUser();

  if (!user) return [];


  const { data, error } =
    await supabase

      .from("discovery_sessions")

      .select("*")

      .eq("user_id", user.id)

      .order(
        "created_at",
        { ascending: false }
      );


  if (error) {

    console.error(
      "TRUE AI loadSessions error:",
      error
    );

    return [];
  }

  return data || [];
}


// --------------------------------------------------
// Load Session Messages
// --------------------------------------------------
// Returns Discovery conversation.
// --------------------------------------------------

export async function loadMessages(
  sessionId
) {

  if (!sessionId) return [];


  const { data, error } =
    await supabase

      .from("discovery_messages")

      .select("*")

      .eq("session_id", sessionId)

      .order(
        "created_at",
        { ascending: true }
      );


  if (error) {

    console.error(
      "TRUE AI loadMessages error:",
      error
    );

    return [];
  }

  return data || [];
}


// --------------------------------------------------
// Load LifePrint
// --------------------------------------------------

export async function loadLifePrint(
  sessionId
) {

  if (!sessionId) return null;


  const { data, error } =
    await supabase

      .from("lifeprints")

      .select("*")

      .eq("session_id", sessionId)

      .single();


  if (error) {

    console.error(
      "TRUE AI loadLifePrint error:",
      error
    );

    return null;
  }

  return data;
}


// --------------------------------------------------
// Delete Session
// --------------------------------------------------

export async function deleteSession(
  sessionId
) {

  if (!sessionId) return;


  const { error } =
    await supabase

      .from("discovery_sessions")

      .delete()

      .eq("id", sessionId);


  if (error) {

    console.error(
      "TRUE AI deleteSession error:",
      error
    );
  }
}


// --------------------------------------------------
// Render Sidebar Sessions
// --------------------------------------------------
// Utility helper for UI.
// --------------------------------------------------

export function renderSessionList({

  sessions = [],

  container,

  onSelect

}) {

  if (!container) return;

  container.innerHTML = "";


  sessions.forEach((session) => {

    const entry =
      document.createElement("div");

    entry.className =
      "session-entry";

    entry.textContent =
      session.title ||
      "Untitled Discovery";

    entry.onclick = () => {

      if (onSelect) {

        onSelect(session);
      }
    };

    container.appendChild(entry);
  });
}
