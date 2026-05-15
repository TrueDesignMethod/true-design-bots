// core/interpreter/upgradeAnalyzer.js
// TRUE AI — Upgrade Analyzer

// --------------------------------------------------
// UPGRADE ANALYZER
// --------------------------------------------------
// Purpose:
// Identify:
//
// - realistic growth priorities
// - sustainable shifts
// - mindset reframes
// - boundary needs
// - capacity-supportive adjustments
// - strengths to leverage
// - low-friction development paths
//
// This analyzer is intentionally:
// - reflective
// - grounded
// - non-performative
// - sustainability-oriented
//
// Upgrades are NOT treated as:
// - self-reinvention
// - endless optimization
// - productivity escalation
//
// The goal is to help participants
// identify realistic and aligned
// next areas of growth.
// --------------------------------------------------


// --------------------------------------------------
// Main Upgrade Analysis
// --------------------------------------------------
export async function analyzeUpgradeAreas({

  input = "",

  participantProfile = {},

  strengths = {},

  friction = {},

  contradictions = {},

  llm

}) {

  // ----------------------------------------------
  // Extract participant context
  // ----------------------------------------------
  const {

    values = [],

    goals = []

  } = participantProfile;


  // ----------------------------------------------
  // Build analysis prompt
  // ----------------------------------------------
  const prompt =
    buildUpgradePrompt({

      input,

      values,

      goals,

      strengths,

      friction,

      contradictions
    });


  // ----------------------------------------------
  // Run LLM analysis
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 750
  });


  // ----------------------------------------------
  // Parse structured response
  // ----------------------------------------------
  const parsed =
    safelyParseUpgrades(response);


  // ----------------------------------------------
  // Return structured upgrade analysis
  // ----------------------------------------------
  return {

    priorities:
      parsed.priorities || [],

    mindsetShifts:
      parsed.mindsetShifts || [],

    boundaryNeeds:
      parsed.boundaryNeeds || [],

    sustainableAdjustments:
      parsed.sustainableAdjustments || [],

    strengthsToLeverage:
      parsed.strengthsToLeverage || [],

    supportiveExperiments:
      parsed.supportiveExperiments || [],

    pacingRecommendations:
      parsed.pacingRecommendations || [],

    reflectiveSummary:
      parsed.reflectiveSummary || ""
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildUpgradePrompt({

  input,

  values = [],

  goals = [],

  strengths = {},

  friction = {},

  contradictions = {}

}) {

  return `
You are TRUE AI.

You are identifying potential upgrade areas within a participant's life.

Your role is to gently identify:
- realistic growth priorities
- sustainable behavioral shifts
- mindset reframes
- boundary development
- supportive adjustments
- strengths that may support growth
- low-friction next steps

Do NOT:
- pressure transformation
- encourage over-optimization
- imply participants must reinvent themselves
- use hustle culture language
- generate aggressive action plans

Recognize that:
- sustainable growth matters
- pacing matters
- capacity matters
- rest matters
- small shifts can be meaningful

Use calm, grounded, reflective language.

Avoid:
- productivity obsession
- exaggerated positivity
- rigid self-help framing
- perfectionistic expectations

Return ONLY valid JSON.

Required JSON structure:

{
  "priorities": [
    "string"
  ],

  "mindsetShifts": [
    "string"
  ],

  "boundaryNeeds": [
    "string"
  ],

  "sustainableAdjustments": [
    "string"
  ],

  "strengthsToLeverage": [
    "string"
  ],

  "supportiveExperiments": [
    "string"
  ],

  "pacingRecommendations": [
    "string"
  ],

  "reflectiveSummary":
    "string"
}

Participant Values:
${JSON.stringify(values)}

Participant Goals:
${JSON.stringify(goals)}

Strength Analysis:
${JSON.stringify(strengths)}

Friction Analysis:
${JSON.stringify(friction)}

Contradiction Analysis:
${JSON.stringify(contradictions)}

Participant Input:
"""
${input}
"""
`;
}


// --------------------------------------------------
// Safe JSON Parsing
// --------------------------------------------------
function safelyParseUpgrades(response) {

  try {

    return JSON.parse(response);

  } catch (err) {

    console.error(
      "Upgrade parsing error:",
      err
    );

    return {

      priorities: [],

      mindsetShifts: [],

      boundaryNeeds: [],

      sustainableAdjustments: [],

      strengthsToLeverage: [],

      supportiveExperiments: [],

      pacingRecommendations: [],

      reflectiveSummary:
        "Several possible growth areas may be emerging, though additional reflection may help clarify what feels most aligned and sustainable."
    };
  }
}
