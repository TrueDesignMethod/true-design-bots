// core/state/persistence.js
// TRUE AI — Persistence Utilities

// --------------------------------------------------
// PERSISTENCE UTILITIES
// --------------------------------------------------
// Purpose:
// Provide lightweight persistence helpers for:
//
// - participant profiles
// - discovery history
// - LifePrint storage
// - session continuity
//
// This layer is intentionally:
// - simple
// - storage-agnostic
// - modular
// - non-business-logic-oriented
//
// It should NOT:
// - analyze participants
// - generate interpretation
// - contain framework logic
//
// Its responsibility is ONLY:
// save + retrieve state.
// --------------------------------------------------


import { supabase }
  from "../../lib/supabase.js";


// --------------------------------------------------
// Save Participant Profile
// --------------------------------------------------
export async function saveParticipantProfile({

  participantId,

  profile

}) {

  const { data, error } =
    await supabase

      .from("participant_profiles")

      .upsert({

        participant_id:
          participantId,

        profile,

        updated_at:
          new Date().toISOString()
      })

      .select()

      .single();


  if (error) {

    console.error(
      "Error saving participant profile:",
      error
    );

    throw error;
  }

  return data;
}


// --------------------------------------------------
// Load Participant Profile
// --------------------------------------------------
export async function loadParticipantProfile(
  participantId
) {

  const { data, error } =
    await supabase

      .from("participant_profiles")

      .select("*")

      .eq(
        "participant_id",
        participantId
      )

      .single();


  if (error) {

    console.error(
      "Error loading participant profile:",
      error
    );

    return null;
  }

  return data?.profile || null;
}


// --------------------------------------------------
// Save Discovery History
// --------------------------------------------------
export async function saveDiscoveryHistory({

  participantId,

  history

}) {

  const { data, error } =
    await supabase

      .from("discovery_history")

      .upsert({

        participant_id:
          participantId,

        history,

        updated_at:
          new Date().toISOString()
      })

      .select()

      .single();


  if (error) {

    console.error(
      "Error saving discovery history:",
      error
    );

    throw error;
  }

  return data;
}


// --------------------------------------------------
// Load Discovery History
// --------------------------------------------------
export async function loadDiscoveryHistory(
  participantId
) {

  const { data, error } =
    await supabase

      .from("discovery_history")

      .select("*")

      .eq(
        "participant_id",
        participantId
      )

      .single();


  if (error) {

    console.error(
      "Error loading discovery history:",
      error
    );

    return null;
  }

  return data?.history || null;
}


// --------------------------------------------------
// Save LifePrint
// --------------------------------------------------
export async function saveLifePrint({

  participantId,

  lifeprint

}) {

  const { data, error } =
    await supabase

      .from("lifeprints")

      .insert({

        participant_id:
          participantId,

        lifeprint,

        generated_at:
          new Date().toISOString()
      })

      .select()

      .single();


  if (error) {

    console.error(
      "Error saving LifePrint:",
      error
    );

    throw error;
  }

  return data;
}


// --------------------------------------------------
// Load Participant LifePrints
// --------------------------------------------------
export async function loadLifePrints(
  participantId
) {

  const { data, error } =
    await supabase

      .from("lifeprints")

      .select("*")

      .eq(
        "participant_id",
        participantId)

      .order(
        "generated_at",
        { ascending: false }
      );


  if (error) {

    console.error(
      "Error loading LifePrints:",
      error
    );

    return [];
  }

  return data || [];
}


// --------------------------------------------------
// Save Discovery Session
// --------------------------------------------------
export async function saveDiscoverySession({

  participantId,

  session

}) {

  const { data, error } =
    await supabase

      .from("discovery_sessions")

      .insert({

        participant_id:
          participantId,

        session,

        created_at:
          new Date().toISOString()
      })

      .select()

      .single();


  if (error) {

    console.error(
      "Error saving discovery session:",
      error
    );

    throw error;
  }

  return data;
}
