// modules/discovery/target.js
// TRUE AI — TARGET Discovery Module

// --------------------------------------------------
// TARGET MODULE
// --------------------------------------------------
// Purpose:
// Help participants clarify:
//
// - what they want
// - what matters to them
// - desired direction
// - desired emotional states
// - meaningful goals
// - alignment priorities
//
// TARGET is the opening phase of Discovery.
//
// It is intentionally:
// - exploratory
// - reflective
// - clarifying
// - non-performative
//
// The goal is NOT:
// aggressive goal-setting.
//
// The goal IS:
// helping participants articulate
// meaningful direction with greater clarity.
// --------------------------------------------------


import {
  targetQuestions
} from "../../core/intake/targetQuestions.js";


// --------------------------------------------------
// TARGET Module Definition
// --------------------------------------------------
export const targetModule = {

  id: "TARGET",

  stage: "discovery",

  description:
    "Clarify values, direction, goals, and desired states.",

  objectives: [

    "Identify meaningful goals",

    "Clarify desired direction",

    "Surface internal priorities",

    "Explore emotional alignment",

    "Increase self-awareness"
  ]
};


// --------------------------------------------------
// Get TARGET Questions
// --------------------------------------------------
export function getTargetQuestions() {

  return targetQuestions;
}


// --------------------------------------------------
// TARGET Reflection Prompt
// --------------------------------------------------
export function buildTargetReflection({

  participantProfile = {}

}) {

  const {

    goals = [],

    values = [],

    desiredStates = []

  } = participantProfile;


  return `
You are currently in the TARGET phase of TRUE Discovery.

This phase focuses on:
- clarifying direction
- identifying meaningful goals
- understanding personal values
- exploring desired ways of living

Current Known Goals:
${formatList(goals)}

Current Values:
${formatList(values)}

Desired States:
${formatList(desiredStates)}

Use reflective questioning to help the participant:
- clarify what matters most
- explore alignment
- identify meaningful direction
- distinguish external expectations from internal priorities

Do NOT:
- pressure performance
- encourage unrealistic ambition
- force certainty
- rush toward planning

The tone should feel:
- thoughtful
- grounded
- emotionally safe
- exploratory
`;
}


// --------------------------------------------------
// TARGET Completion Evaluation
// --------------------------------------------------
export function evaluateTargetCompletion({

  participantProfile = {}

}) {

  const {

    goals = [],

    values = [],

    desiredStates = []

  } = participantProfile;


  // ----------------------------------------------
  // Basic readiness checks
  // ----------------------------------------------
  const hasGoals =
    goals.length >= 2;

  const hasValues =
    values.length >= 3;

  const hasDesiredStates =
    desiredStates.length >= 1;


  // ----------------------------------------------
  // Determine completion
  // ----------------------------------------------
  const completed =

    hasGoals &&
    hasValues &&
    hasDesiredStates;


  return {

    completed,

    readinessLevel:
      completed
        ? "developing"
        : "emerging",

    missingAreas: [

      !hasGoals &&
        "meaningful goals",

      !hasValues &&
        "core values",

      !hasDesiredStates &&
        "desired emotional states"

    ].filter(Boolean)
  };
}


// --------------------------------------------------
// TARGET Transition Recommendation
// --------------------------------------------------
export function getNextTargetStep({

  completion = {}

}) {

  if (!completion.completed) {

    return {

      nextState:
        "TARGET",

      recommendation:
        "Continue clarifying direction, values, and desired states before moving deeper into reflection."
    };
  }


  return {

    nextState:
      "REFLECT",

    recommendation:
      "Participant appears ready to begin deeper reflection around current reality, friction, and alignment."
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
