// core/interpreter/strengthsAnalyzer.js
// TRUE AI — Strengths Analyzer

// --------------------------------------------------
// STRENGTHS ANALYZER
// --------------------------------------------------
// Purpose:
// Identify:
//
// - existing strengths
// - resilience patterns
// - adaptive capacities
// - supportive traits
// - sustainable advantages
//
// This analyzer is intentionally:
// - reflective
// - non-performative
// - non-diagnostic
// - non-hierarchical
//
// Strengths are NOT treated as:
// - superiority
// - fixed identity
// - productivity assets only
//
// The goal is to help participants
// recognize qualities that may support
// aligned and sustainable growth.
// --------------------------------------------------


// --------------------------------------------------
// Main Strength Analysis
// --------------------------------------------------
export async function analyzeStrengths({

  input = "",

  participantProfile = {},

  llm

}) {

  // ----------------------------------------------
  // Extract context
  // ----------------------------------------------
  const {

    values = [],

    goals = [],

    frictionThemes = [],

    previousStrengths = []

  } = participantProfile;


  // ----------------------------------------------
  // Build prompt
  // ----------------------------------------------
  const prompt = buildStrengthsPrompt({

    input,

    values,

    goals,

    frictionThemes,

    previousStrengths
  });


  // ----------------------------------------------
  // Run LLM analysis
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 550
  });


  // ----------------------------------------------
  // Parse structured output
  // ----------------------------------------------
  const parsed =
    safelyParseStrengths(response);


  // ----------------------------------------------
  // Return structured strengths
  // ----------------------------------------------
  return {

    detected:
      parsed.detected || [],

    resiliencePatterns:
      parsed.resiliencePatterns || [],

    supportiveQualities:
      parsed.supportiveQualities || [],

    growthAssets:
      parsed.growthAssets || [],

    overextendedStrengths:
      parsed.overextendedStrengths || [],

    reflectiveSummary:
      parsed.reflectiveSummary || ""
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildStrengthsPrompt({

  input,

  values = [],

  goals = [],

  frictionThemes = [],

  previousStrengths = []

}) {

  return `
You are TRUE AI.

You are analyzing participant strengths.

Your role is to identify:
- supportive qualities
- resilience patterns
- adaptive capacities
- emotionally sustainable strengths
- existing internal resources

Do NOT:
- exaggerate strengths
- flatter participants
- create personality labels
- imply perfection
- use corporate performance language

Avoid:
- productivity obsession
- "high performer" language
- superiority framing
- motivational hype

A strength may include:
- emotional resilience
- thoughtfulness
- adaptability
- persistence
- compassion
- curiosity
- self-awareness
- creativity
- relational capacity
- groundedness

Also identify:
- strengths that may become harmful
  when overextended.

Return ONLY valid JSON.

Required JSON structure:

{
  "detected": [
    "string"
  ],

  "resiliencePatterns": [
    "string"
  ],

  "supportiveQualities": [
    "string"
  ],

  "growthAssets": [
    "string"
  ],

  "overextendedStrengths": [
    "string"
  ],

  "reflectiveSummary": "string"
}

Participant Values:
${JSON.stringify(values)}

Participant Goals:
${JSON.stringify(goals)}

Known Friction Themes:
${JSON.stringify(frictionThemes)}

Previously Identified Strengths:
${JSON.stringify(previousStrengths)}

Participant Input:
"""
${input}
"""
`;
}


// --------------------------------------------------
// Safe JSON Parsing
// --------------------------------------------------
function safelyParseStrengths(response) {

  try {

    return JSON.parse(response);

  } catch (err) {

    console.error(
      "Strengths parsing error:",
      err
    );

    return {

      detected: [],

      resiliencePatterns: [],

      supportiveQualities: [],

      growthAssets: [],

      overextendedStrengths: [],

      reflectiveSummary:
        "Several supportive qualities may be present, though additional reflection may help clarify them more fully."
    };
  }
}
