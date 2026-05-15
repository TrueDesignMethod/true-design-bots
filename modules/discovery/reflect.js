// modules/discovery/reflect.js
// TRUE AI — REFLECT Discovery Module

// --------------------------------------------------
// REFLECT MODULE
// --------------------------------------------------
// Purpose:
// Help participants explore:
//
// - current reality
// - internal tension
// - recurring friction
// - emotional patterns
// - sustainability concerns
// - alignment gaps
//
// REFLECT is the second phase of Discovery.
//
// It is intentionally:
// - introspective
// - emotionally grounded
// - non-judgmental
// - clarifying
//
// The goal is NOT:
// self-criticism.
//
// The goal IS:
// deeper self-awareness and
// honest reflective understanding.
// --------------------------------------------------


import {
  reflectQuestions
} from "../../core/intake/reflectQuestions.js";


// --------------------------------------------------
// REFLECT Module Definition
// --------------------------------------------------
export const reflectModule = {

  id: "REFLECT",

  stage: "discovery",

  description:
    "Explore current reality, friction, emotional patterns, and alignment.",

  objectives: [

    "Increase self-awareness",

    "Identify recurring friction",

    "Recognize overload patterns",

    "Surface internal contradictions",

    "Explore sustainability concerns",

    "Clarify alignment gaps"
  ]
};


// --------------------------------------------------
// Get REFLECT Questions
// --------------------------------------------------
export function getReflectQuestions() {

  return reflectQuestions;
}


// --------------------------------------------------
// REFLECT Reflection Prompt
// --------------------------------------------------
export function buildReflectReflection({

  participantProfile = {}

}) {

  const {

    goals = [],

    values = [],

    frictionThemes = [],

    overloadAreas = [],

    contradictionThemes = []

  } = participantProfile;


  return `
You are currently in the REFLECT phase of TRUE Discovery.

This phase focuses on:
- exploring current reality
- identifying friction patterns
- recognizing emotional strain
- understanding sustainability concerns
- clarifying internal tensions

Known Goals:
${formatList(goals)}

Known Values:
${formatList(values)}

Known Friction Themes:
${formatList(frictionThemes)}

Known Overload Areas:
${formatList(overloadAreas)}

Known Contradiction Themes:
${formatList(contradictionThemes)}

Use reflective questioning to help the participant:
- explore what currently feels heavy
- notice recurring tension patterns
- understand where misalignment may exist
- identify sustainability concerns
- recognize emotional or environmental strain

Do NOT:
- shame participants
- over-diagnose
- rush toward fixing
- push productivity
- force emotional intensity

The tone should feel:
- calm
- grounded
- emotionally safe
- thoughtful
- stabilizing
`;
}


// --------------------------------------------------
// REFLECT Completion Evaluation
// --------------------------------------------------
export function evaluateReflectCompletion({

  participantProfile = {}

}) {

  const {

    frictionThemes = [],

    overloadAreas = [],

    contradictionThemes = [],

    sustainabilityConcerns = []

  } = participantProfile;


  // ----------------------------------------------
  // Basic readiness checks
  // ----------------------------------------------
  const hasFrictionAwareness =
    frictionThemes.length >= 2;

  const hasOverloadAwareness =
    overloadAreas.length >= 1;

  const hasContradictionAwareness =
    contradictionThemes.length >= 1;

  const hasSustainabilityAwareness =
    sustainabilityConcerns.length >= 1;


  // ----------------------------------------------
  // Determine completion
  // ----------------------------------------------
  const completed =

    hasFrictionAwareness &&
    hasOverloadAwareness &&
    hasContradictionAwareness;


  // ----------------------------------------------
  // Determine readiness level
  // ----------------------------------------------
  let readinessLevel =
    "developing";

  if (
    completed &&
    hasSustainabilityAwareness
  ) {

    readinessLevel =
      "stabilizing";
  }


  return {

    completed,

    readinessLevel,

    missingAreas: [

      !hasFrictionAwareness &&
        "friction awareness",

      !hasOverloadAwareness &&
        "overload awareness",

      !hasContradictionAwareness &&
        "internal tension awareness",

      !hasSustainabilityAwareness &&
        "sustainability awareness"

    ].filter(Boolean)
  };
}


// --------------------------------------------------
// REFLECT Transition Recommendation
// --------------------------------------------------
export function getNextReflectStep({

  completion = {}

}) {

  if (!completion.completed) {

    return {

      nextState:
        "REFLECT",

      recommendation:
        "Continue exploring recurring friction, overload, and alignment patterns before moving into upgrade exploration."
    };
  }


  return {

    nextState:
      "UPGRADE",

    recommendation:
      "Participant appears ready to begin exploring sustainable growth areas and supportive next steps."
  };
}


// --------------------------------------------------
// Helper Formatter
// --------------------------------------------------
function formatList(items = []) {

  if (!items || items.length === 0) {

    return "- None identified yet";
  }

  return items
    .map((item) => `- ${item}`)
    .join("\n");
}
