// core/interpreter/capacityAnalyzer.js
// TRUE AI — Capacity Analyzer

// --------------------------------------------------
// CAPACITY ANALYZER
// --------------------------------------------------
// Purpose:
// Identify:
//
// - emotional bandwidth
// - cognitive load
// - recovery capacity
// - environmental strain
// - support availability
// - sustainability limits
// - pacing concerns
//
// This analyzer is intentionally:
// - reflective
// - non-shaming
// - non-diagnostic
// - sustainability-oriented
//
// Capacity is NOT treated as:
// - worth
// - ambition
// - intelligence
// - moral discipline
//
// Human capacity changes across:
// - seasons
// - environments
// - responsibilities
// - emotional conditions
//
// The goal is to help participants
// realistically understand what
// their current life structure
// can sustainably support.
// --------------------------------------------------


// --------------------------------------------------
// Main Capacity Analysis
// --------------------------------------------------
export async function analyzeCapacity({

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

    frictionThemes = [],

    strengths = []

  } = participantProfile;


  // ----------------------------------------------
  // Build analysis prompt
  // ----------------------------------------------
  const prompt =
    buildCapacityPrompt({

      input,

      values,

      goals,

      frictionThemes,

      strengths
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
    safelyParseCapacity(response);


  // ----------------------------------------------
  // Return structured capacity
  // ----------------------------------------------
  return {

    overallCapacity:
      parsed.overallCapacity || "moderate",

    emotionalBandwidth:
      parsed.emotionalBandwidth || [],

    cognitiveLoad:
      parsed.cognitiveLoad || [],

    environmentalStrain:
      parsed.environmentalStrain || [],

    recoveryChallenges:
      parsed.recoveryChallenges || [],

    supportFactors:
      parsed.supportFactors || [],

    sustainabilityConcerns:
      parsed.sustainabilityConcerns || [],

    pacingConsiderations:
      parsed.pacingConsiderations || [],

    reflectiveSummary:
      parsed.reflectiveSummary || ""
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildCapacityPrompt({

  input,

  values = [],

  goals = [],

  frictionThemes = [],

  strengths = []

}) {

  return `
You are TRUE AI.

You are analyzing participant capacity.

Your role is to gently identify:
- emotional bandwidth
- cognitive load
- environmental strain
- recovery limitations
- support systems
- sustainability concerns
- pacing considerations

Do NOT:
- shame participants
- imply laziness
- frame exhaustion as failure
- glorify overwork
- encourage over-optimization

Recognize that:
- capacity fluctuates
- overload is often contextual
- sustainable pacing matters
- recovery is important
- environmental pressure is real

Use calm, grounded language.

Avoid:
- hustle culture language
- productivity obsession
- rigid motivational framing
- exaggerated positivity

Return ONLY valid JSON.

Required JSON structure:

{
  "overallCapacity":
    "low | moderate | stable | supported",

  "emotionalBandwidth": [
    "string"
  ],

  "cognitiveLoad": [
    "string"
  ],

  "environmentalStrain": [
    "string"
  ],

  "recoveryChallenges": [
    "string"
  ],

  "supportFactors": [
    "string"
  ],

  "sustainabilityConcerns": [
    "string"
  ],

  "pacingConsiderations": [
    "string"
  ],

  "reflectiveSummary":
    "string"
}

Participant Values:
${JSON.stringify(values)}

Participant Goals:
${JSON.stringify(goals)}

Known Friction Themes:
${JSON.stringify(frictionThemes)}

Known Strengths:
${JSON.stringify(strengths)}

Participant Input:
"""
${input}
"""
`;
}


// --------------------------------------------------
// Safe JSON Parsing
// --------------------------------------------------
function safelyParseCapacity(response) {

  try {

    return JSON.parse(response);

  } catch (err) {

    console.error(
      "Capacity parsing error:",
      err
    );

    return {

      overallCapacity: "moderate",

      emotionalBandwidth: [],

      cognitiveLoad: [],

      environmentalStrain: [],

      recoveryChallenges: [],

      supportFactors: [],

      sustainabilityConcerns: [],

      pacingConsiderations: [],

      reflectiveSummary:
        "Some capacity pressures or sustainability considerations may be present, though additional reflection may help clarify them further."
    };
  }
}
