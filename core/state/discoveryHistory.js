// core/state/discoveryHistory.js
// TRUE AI — Discovery History State

// --------------------------------------------------
// DISCOVERY HISTORY
// --------------------------------------------------
// Purpose:
// Store reflective Discovery session history
// across participant interactions.
//
// This history system exists to support:
// - continuity
// - longitudinal reflection
// - recurring theme awareness
// - LifePrint evolution
// - strategist context
//
// It is intentionally:
// - lightweight
// - readable
// - non-clinical
// - reflection-oriented
//
// The goal is NOT:
// surveillance,
// behavioral scoring,
// or psychological profiling.
//
// The goal is:
// coherent reflective continuity.
// --------------------------------------------------


// --------------------------------------------------
// Create Empty Discovery History
// --------------------------------------------------
export function createDiscoveryHistory() {

  return {

    participantId: null,

    createdAt:
      new Date().toISOString(),

    updatedAt:
      new Date().toISOString(),

    sessions: []
  };
}


// --------------------------------------------------
// Create Discovery Session Snapshot
// --------------------------------------------------
export function createDiscoverySession({

  sessionId = null,

  discoveryState = "reflect",

  participantInput = "",

  reflectiveResponse = "",

  synthesis = {},

  lifeprint = {},

  readinessLevel = "emerging"

}) {

  return {

    sessionId,

    timestamp:
      new Date().toISOString(),

    discoveryState,

    readinessLevel,

    participantInput,

    reflectiveResponse,

    synthesis: {

      dominantThemes:
        synthesis.dominantThemes || [],

      primaryTensions:
        synthesis.primaryTensions || [],

      supportiveStrengths:
        synthesis.supportiveStrengths || [],

      sustainabilityConsiderations:
        synthesis.sustainabilityConsiderations || [],

      upgradePriorities:
        synthesis.upgradePriorities || []
    },

    lifeprintSummary: {

      summary:
        lifeprint?.sections?.summary
          ?.narrative || "",

      momentum:
        lifeprint?.sections?.momentum
          ?.steps || []
    }
  };
}


// --------------------------------------------------
// Add Session To Discovery History
// --------------------------------------------------
export function addDiscoverySession({

  history = {},

  session = {}

}) {

  const existingSessions =
    history.sessions || [];

  return {

    ...history,

    sessions: [

      ...existingSessions,

      session
    ],

    updatedAt:
      new Date().toISOString()
  };
}


// --------------------------------------------------
// Get Most Recent Session
// --------------------------------------------------
export function getLatestDiscoverySession(
  history = {}
) {

  const sessions =
    history.sessions || [];

  if (sessions.length === 0) {
    return null;
  }

  return sessions[
    sessions.length - 1
  ];
}


// --------------------------------------------------
// Get Recent Themes
// --------------------------------------------------
export function getRecurringThemes(
  history = {}
) {

  const sessions =
    history.sessions || [];

  const themes = [];

  sessions.forEach((session) => {

    const dominantThemes =
      session?.synthesis
        ?.dominantThemes || [];

    themes.push(...dominantThemes);
  });


  // ----------------------------------------------
  // Count recurring themes
  // ----------------------------------------------
  const counts = {};

  themes.forEach((theme) => {

    counts[theme] =
      (counts[theme] || 0) + 1;
  });


  // ----------------------------------------------
  // Return recurring themes only
  // ----------------------------------------------
  return Object.entries(counts)

    .filter(([_, count]) => count >= 2)

    .map(([theme]) => theme);
}


// --------------------------------------------------
// Get Readiness Trend
// --------------------------------------------------
export function getReadinessTrend(
  history = {}
) {

  const sessions =
    history.sessions || [];

  return sessions.map((session) => ({

    timestamp:
      session.timestamp,

    readinessLevel:
      session.readinessLevel
  }));
}
