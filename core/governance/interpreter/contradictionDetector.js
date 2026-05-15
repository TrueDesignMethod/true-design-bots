// core/interpreter/contradictionDetector.js
// TRUE AI — Contradiction Detector

// --------------------------------------------------
// CONTRADICTION DETECTOR
// --------------------------------------------------
// Purpose:
// Identify:
//
// - internal contradictions
// - value-behavior tension
// - goal-capacity mismatch
// - identity-environment conflict
// - competing priorities
// - unsustainable expectations
//
// This detector is intentionally:
// - reflective
// - non-judgmental
// - emotionally safe
// - non-diagnostic
//
// Contradictions are NOT treated as:
// - hypocrisy
// - failure
// - dishonesty
//
// Human beings naturally hold:
// - conflicting needs
// - competing values
// - survival adaptations
// - emotional tensions
//
// The goal is to surface these
// patterns gently so participants
// can better understand themselves.
// --------------------------------------------------


// --------------------------------------------------
// Main Contradiction Detection
// --------------------------------------------------
export async function detectContradictions({

  input = "",

  participantProfile = {},

  llm

}) {

  // ----------------------------------------------
  // Extract participant context
  // ----------------------------------------------
  const {

    values = [],

    goals = [],

    strengths = [],

    frictionThemes = []

  } = participantProfile;


  // ----------------------------------------------
  // Build analysis prompt
  // ----------------------------------------------
  const prompt =
    buildContradictionPrompt({

      input,

      values,

      goals,

      strengths,

      frictionThemes
    });


  // ----------------------------------------------
  // Run LLM analysis
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 700
  });


  // ----------------------------------------------
  // Parse structured response
  // ----------------------------------------------
  const parsed =
    safelyParseContradictions(response);


  // ----------------------------------------------
  // Return structured contradictions
  // ----------------------------------------------
  return {

    themes:
      parsed.themes || [],

    valueBehaviorTension:
      parsed.valueBehaviorTension || [],

    goalCapacityMismatch:
      parsed.goalCapacityMismatch || [],

    identityEnvironmentConflict:
      parsed.identityEnvironmentConflict || [],

    competingPriorities:
      parsed.competingPriorities || [],

    hiddenPressures:
      parsed.hiddenPressures || [],

    unresolvedTensions:
      parsed.unresolvedTensions || [],

    reflectiveSummary:
      parsed.reflectiveSummary || ""
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildContradictionPrompt({

  input,

  values = [],

  goals = [],

  strengths = [],

  frictionThemes = []

}) {

  return `
You are TRUE AI.

You are identifying internal contradictions and tensions within a participant's life.

Your role is to gently surface:
- conflicting priorities
- competing values
- mismatches between goals and capacity
- identity tension
- environmental conflict
- unsustainable expectations

Do NOT:
- shame participants
- accuse participants
- imply hypocrisy
- over-pathologize
- force certainty

Recognize that contradictions are:
- normal
- human
- often adaptive
- frequently unconscious

Use calm, reflective language.

Avoid:
- harsh language
- self-help hype
- productivity framing
- black-and-white thinking

Return ONLY valid JSON.

Required JSON structure:

{
  "themes": [
    "string"
  ],

  "valueBehaviorTension": [
    "string"
  ],

  "goalCapacityMismatch": [
    "string"
  ],

  "identityEnvironmentConflict": [
    "string"
  ],

  "competingPriorities": [
    "string"
  ],

  "hiddenPressures": [
    "string"
  ],

  "unresolvedTensions": [
    "string"
  ],

  "reflectiveSummary":
    "string"
}

Participant Values:
${JSON.stringify(values)}

Participant Goals:
${JSON.stringify(goals)}

Known Strengths:
${JSON.stringify(strengths)}

Known Friction Themes:
${JSON.stringify(frictionThemes)}

Participant Input:
"""
${input}
"""
`;
}


// --------------------------------------------------
// Safe JSON Parsing
// --------------------------------------------------
function safelyParseContradictions(response) {

  try {

    return JSON.parse(response);

  } catch (err) {

    console.error(
      "Contradiction parsing error:",
      err
    );

    return {

      themes: [],

      valueBehaviorTension: [],

      goalCapacityMismatch: [],

      identityEnvironmentConflict: [],

      competingPriorities: [],

      hiddenPressures: [],

      unresolvedTensions: [],

      reflectiveSummary:
        "Some internal tensions or competing pressures may be present, though additional reflection may help clarify them more fully."
    };
  }
}
