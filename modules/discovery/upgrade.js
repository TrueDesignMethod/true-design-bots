// modules/discovery/upgrade.js
// TRUE AI — UPGRADE Discovery Module

// --------------------------------------------------
// UPGRADE MODULE
// --------------------------------------------------
// Purpose:
// Help participants explore:
//
// - sustainable growth areas
// - supportive adjustments
// - realistic next steps
// - mindset reframes
// - boundary strengthening
// - aligned movement
//
// UPGRADE is the third phase of Discovery.
//
// It is intentionally:
// - grounded
// - sustainability-oriented
// - non-performative
// - supportive
//
// The goal is NOT:
// radical self-reinvention.
//
// The goal IS:
// helping participants identify
// sustainable pathways toward
// greater alignment and coherence.
// --------------------------------------------------


import {
  behavioralQuestions
} from "../../core/intake/behavioralQuestions.js";

import {
  capacityQuestions
} from "../../core/intake/capacityQuestions.js";


// --------------------------------------------------
// UPGRADE Module Definition
// --------------------------------------------------
export const upgradeModule = {

  id: "UPGRADE",

  stage: "discovery",

  description:
    "Explore sustainable growth, supportive adjustments, and aligned next steps.",

  objectives: [

    "Identify realistic growth priorities",

    "Strengthen sustainability awareness",

    "Explore supportive boundaries",

    "Encourage aligned experimentation",

    "Support gentle momentum",

    "Increase self-trust"
  ]
};


// --------------------------------------------------
// Get UPGRADE Questions
// --------------------------------------------------
export function getUpgradeQuestions() {

  return [

    ...behavioralQuestions,

    ...capacityQuestions
  ];
}


// --------------------------------------------------
// UPGRADE Reflection Prompt
// --------------------------------------------------
export function buildUpgradeReflection({

  participantProfile = {}

}) {

  const {

    strengths = [],

    frictionThemes = [],

    contradictionThemes = [],

    sustainabilityConcerns = [],

    pacingConsiderations = [],

    upgradeThemes = []

  } = participantProfile;


  return `
You are currently in the UPGRADE phase of TRUE Discovery.

This phase focuses on:
- sustainable growth
- supportive adjustments
- realistic movement
- boundary strengthening
- aligned experimentation
- gentle momentum

Known Strengths:
${formatList(strengths)}

Known Friction Themes:
${formatList(frictionThemes)}

Known Contradiction Themes:
${formatList(contradictionThemes)}

Known Sustainability Concerns:
${formatList(sustainabilityConcerns)}

Known Pacing Considerations:
${formatList(pacingConsiderations)}

Current Upgrade Themes:
${formatList(upgradeThemes)}

Use reflective questioning to help the participant:
- identify realistic next steps
- strengthen sustainability awareness
- explore supportive boundaries
- consider low-friction adjustments
- recognize strengths that may support movement

Do NOT:
- overwhelm participants
- pressure transformation
- create rigid action plans
- encourage over-optimization
- glorify productivity

The tone should feel:
- calm
- grounded
- supportive
- realistic
- emotionally steady
`;
}


// --------------------------------------------------
// UPGRADE Completion Evaluation
// --------------------------------------------------
export function evaluateUpgradeCompletion({

  participantProfile = {}

}) {

  const {

    upgradeThemes = [],

    pacingConsiderations = [],

    sustainabilityConcerns = [],

    supportFactors = []

  } = participantProfile;


  // ----------------------------------------------
  // Basic readiness checks
  // ----------------------------------------------
  const hasGrowthAwareness =
    upgradeThemes.length >= 2;

  const hasPacingAwareness =
    pacingConsiderations.length >= 1;

  const hasSustainabilityAwareness =
    sustainabilityConcerns.length >= 1;

  const hasSupportAwareness =
    supportFactors.length >= 1;


  // ----------------------------------------------
  // Determine completion
  // ----------------------------------------------
  const completed =

    hasGrowthAwareness &&
    hasPacingAwareness &&
    hasSustainabilityAwareness;


  // ----------------------------------------------
  // Determine readiness level
  // ----------------------------------------------
  let readinessLevel =
    "stabilizing";

  if (
    completed &&
    hasSupportAwareness
  ) {

    readinessLevel =
      "ready";
  }


  return {

    completed,

    readinessLevel,

    missingAreas: [

      !hasGrowthAwareness &&
        "growth priorities",

      !hasPacingAwareness &&
        "pacing awareness",

      !hasSustainabilityAwareness &&
        "sustainability awareness",

      !hasSupportAwareness &&
        "support awareness"

    ].filter(Boolean)
  };
}


// --------------------------------------------------
// UPGRADE Transition Recommendation
// --------------------------------------------------
export function getNextUpgradeStep({

  completion = {}

}) {

  if (!completion.completed) {

    return {

      nextState:
        "UPGRADE",

      recommendation:
        "Continue exploring sustainable movement, pacing, and supportive adjustments before finalizing Discovery."
    };
  }


  return {

    nextState:
      "COMPLETE",

    recommendation:
      "Participant appears ready for LifePrint synthesis and transition into future planning or support pathways."
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
