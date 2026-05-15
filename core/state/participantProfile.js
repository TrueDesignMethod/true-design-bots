// core/state/participantProfile.js
// TRUE AI — Participant Profile State

// --------------------------------------------------
// PARTICIPANT PROFILE
// --------------------------------------------------
// Purpose:
// Store longitudinal participant information
// gathered throughout Discovery conversations.
//
// This profile is intentionally:
// - lightweight
// - reflective
// - flexible
// - non-clinical
//
// It is NOT:
// - a psychological profile
// - a diagnosis
// - a fixed identity system
//
// The goal is simply to maintain:
// continuity + coherence
// across participant interactions.
// --------------------------------------------------


// --------------------------------------------------
// Create Empty Participant Profile
// --------------------------------------------------
export function createParticipantProfile() {

  return {

    // --------------------------------------------
    // Identity / Session
    // --------------------------------------------
    participantId: null,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),


    // --------------------------------------------
    // Discovery Orientation
    // --------------------------------------------
    values: [],

    goals: [],

    desiredStates: [],

    frictionThemes: [],

    contradictionThemes: [],

    strengths: [],

    upgradeThemes: [],


    // --------------------------------------------
    // Capacity / Sustainability
    // --------------------------------------------
    overloadAreas: [],

    sustainabilityConcerns: [],

    pacingConsiderations: [],

    supportFactors: [],


    // --------------------------------------------
    // Reflection History
    // --------------------------------------------
    reflectionHistory: [],

    lifeprints: [],


    // --------------------------------------------
    // Discovery Progress
    // --------------------------------------------
    readinessLevel:
      "emerging",

    currentDiscoveryState:
      "reflect",

    lastDiscoveryState:
      "reflect",


    // --------------------------------------------
    // Session Metadata
    // --------------------------------------------
    totalSessions: 0,

    lastSessionAt: null
  };
}


// --------------------------------------------------
// Merge Profile Updates
// --------------------------------------------------
export function mergeParticipantProfile({

  currentProfile = {},

  updates = {}

}) {

  return {

    ...currentProfile,

    ...updates,

    updatedAt:
      new Date().toISOString()
  };
}


// --------------------------------------------------
// Add Reflection Snapshot
// --------------------------------------------------
export function addReflectionSnapshot({

  profile = {},

  reflection = {}

}) {

  const history =
    profile.reflectionHistory || [];

  return {

    ...profile,

    reflectionHistory: [

      ...history,

      {
        timestamp:
          new Date().toISOString(),

        ...reflection
      }
    ],

    updatedAt:
      new Date().toISOString()
  };
}


// --------------------------------------------------
// Add LifePrint Snapshot
// --------------------------------------------------
export function addLifePrint({

  profile = {},

  lifeprint = {}

}) {

  const existingLifeprints =
    profile.lifeprints || [];

  return {

    ...profile,

    lifeprints: [

      ...existingLifeprints,

      {
        generatedAt:
          new Date().toISOString(),

        ...lifeprint
      }
    ],

    updatedAt:
      new Date().toISOString()
  };
}


// --------------------------------------------------
// Increment Session Count
// --------------------------------------------------
export function incrementSessionCount(
  profile = {}
) {

  return {

    ...profile,

    totalSessions:
      (profile.totalSessions || 0) + 1,

    lastSessionAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString()
  };
}
