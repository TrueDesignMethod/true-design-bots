// core/governance/transitionReadiness.js
// TRUE AI — Transition Readiness Evaluation

import { DISCOVERY_STATES }
  from "./resolveDiscoveryState.js";


// --------------------------------------------------
// Readiness Levels
// --------------------------------------------------
export const READINESS_LEVELS = {

  EMERGING: "emerging",

  DEVELOPING: "developing",

  STABILIZING: "stabilizing",

  READY: "ready"
};


// --------------------------------------------------
// Evaluate Transition Readiness
// --------------------------------------------------
export function evaluateTransitionReadiness({

  participantProfile = {},

  synthesis = {},

  strengths = {},

  friction = {},

  contradictions = {},

  upgrades = {},

  sessionHistory = []

}) {

  // ----------------------------------------------
  // Initialize readiness score
  // ----------------------------------------------
  let score = 0;


  // ----------------------------------------------
  // Clarity signals
  // ----------------------------------------------
  const goals =
    participantProfile.goals || [];

  const values =
    participantProfile.values || [];

  if (goals.length >= 2) {
    score += 2;
  }

  if (values.length >= 2) {
    score += 2;
  }


  // ----------------------------------------------
  // Reflective depth
  // ----------------------------------------------
  const contradictionThemes =
    contradictions?.themes || [];

  if (contradictionThemes.length > 0) {
    score += 2;
  }


  // ----------------------------------------------
  // Strength awareness
  // ----------------------------------------------
  const strengthsDetected =
    strengths?.detected || [];

  if (strengthsDetected.length >= 2) {
    score += 2;
  }


  // ----------------------------------------------
  // Upgrade awareness
  // ----------------------------------------------
  const upgradePriorities =
    upgrades?.priorities || [];

  if (upgradePriorities.length >= 2) {
    score += 2;
  }


  // ----------------------------------------------
  // Emotional overwhelm reduction
  // ----------------------------------------------
  const overloadLevel =
    friction?.overloadLevel || "moderate";

  if (overloadLevel === "low") {
    score += 2;
  }

  if (overloadLevel === "moderate") {
    score += 1;
  }


  // ----------------------------------------------
  // Conversational continuity
  // ----------------------------------------------
  if (sessionHistory.length >= 5) {
    score += 1;
  }


  // ----------------------------------------------
  // Determine readiness level
  // ----------------------------------------------
  let readinessLevel =
    READINESS_LEVELS.EMERGING;

  if (score >= 10) {
    readinessLevel =
      READINESS_LEVELS.READY;

  } else if (score >= 7) {
    readinessLevel =
      READINESS_LEVELS.STABILIZING;

  } else if (score >= 4) {
    readinessLevel =
      READINESS_LEVELS.DEVELOPING;
  }


  // ----------------------------------------------
  // Determine recommendation
  // ----------------------------------------------
  const recommendation =
    buildRecommendation({
      readinessLevel,
      contradictions,
      friction,
      upgrades
    });


  // ----------------------------------------------
  // Return structured readiness
  // ----------------------------------------------
  return {

    readinessLevel,

    readinessScore: score,

    recommendation,

    indicators: {

      goalsClarified:
        goals.length > 0,

      valuesClarified:
        values.length > 0,

      strengthsRecognized:
        strengthsDetected.length > 0,

      contradictionsRecognized:
        contradictionThemes.length > 0,

      upgradeAwareness:
        upgradePriorities.length > 0
    }
  };
}


// --------------------------------------------------
// Recommendation Builder
// --------------------------------------------------
function buildRecommendation({

  readinessLevel,

  contradictions = {},

  friction = {},

  upgrades = {}

}) {

  // ----------------------------------------------
  // Emerging
  // ----------------------------------------------
  if (
    readinessLevel ===
    READINESS_LEVELS.EMERGING
  ) {

    return {
      focus:
        "Continue reflective discovery.",

      guidance:
        "More clarity and self-understanding may be helpful before moving into structured planning.",

      suggestedState:
        DISCOVERY_STATES.REFLECT
    };
  }


  // ----------------------------------------------
  // Developing
  // ----------------------------------------------
  if (
    readinessLevel ===
    READINESS_LEVELS.DEVELOPING
  ) {

    return {
      focus:
        "Strengthen clarity and alignment.",

      guidance:
        "Patterns and growth areas are becoming clearer. Continued reflection and gentle experimentation may help stabilize direction.",

      suggestedState:
        DISCOVERY_STATES.UPGRADE
    };
  }


  // ----------------------------------------------
  // Stabilizing
  // ----------------------------------------------
  if (
    readinessLevel ===
    READINESS_LEVELS.STABILIZING
  ) {

    return {
      focus:
        "Prepare for intentional planning.",

      guidance:
        "You appear to have growing awareness of your values, strengths, and friction patterns. Structured planning may soon become useful.",

      suggestedState:
        DISCOVERY_STATES.UPGRADE
    };
  }


  // ----------------------------------------------
  // Ready
  // ----------------------------------------------
  return {

    focus:
      "Ready for strategic planning.",

    guidance:
      "You appear to have sufficient clarity and self-awareness to begin translating reflection into intentional long-term planning.",

    suggestedState:
      DISCOVERY_STATES.UPGRADE
  };
}
