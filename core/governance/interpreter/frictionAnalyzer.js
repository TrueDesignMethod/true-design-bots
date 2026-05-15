// core/interpreter/frictionAnalyzer.js
// TRUE AI — Friction Analyzer

// --------------------------------------------------
// FRICTION ANALYZER
// --------------------------------------------------
// Purpose:
// Identify:
//
// - recurring friction patterns
// - overload areas
// - emotional strain
// - environmental pressure
// - behavioral resistance
// - sustainability obstacles
//
// This analyzer is intentionally:
// - reflective
// - non-diagnostic
// - non-shaming
// - emotionally safe
//
// Friction is NOT treated as:
// - failure
// - weakness
// - laziness
// - brokenness
//
// The goal is to help participants
// recognize what may be interfering
// with alignment, capacity, or
// sustainable movement.
// --------------------------------------------------


// --------------------------------------------------
// Main Friction Analysis
// --------------------------------------------------
export async function analyzeFriction({

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

    strengths = [],

    frictionThemes = []

  } = participantProfile;


  // ----------------------------------------------
  // Build analysis prompt
  // ----------------------------------------------
  const prompt = buildFrictionPrompt({

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

    maxTokens: 650
  });


  // ----------------------------------------------
  // Parse structured output
  // ----------------------------------------------
  const parsed =
    safelyParseFriction(response);


  // ----------------------------------------------
  // Return structured friction
  // ----------------------------------------------
  return {

    themes:
      parsed.themes || [],

    overloadAreas:
      parsed.overloadAreas || [],

    behavioralFriction:
      parsed.behavioralFriction || [],

    environmentalFriction:
      parsed.environmentalFriction || [],

    emotionalStrain:
      parsed.emotionalStrain || [],

    sustainabilityRisks:
      parsed.sustainabilityRisks || [],

    overloadLevel:
      parsed.overloadLevel || "moderate",

    reflectiveSummary:
      parsed.reflectiveSummary || ""
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildFrictionPrompt({

  input,

  values = [],

  goals = [],

  strengths = [],

  frictionThemes = []

}) {

  return `
You are TRUE AI.

You are analyzing friction patterns within a participant's life.

Your role is to gently identify:
- recurring strain
- overload
- resistance patterns
- environmental pressure
- emotional tension
- sustainability concerns

Do NOT:
- diagnose
- shame
- imply failure
- pathologize normal human struggle
- frame friction as weakness

Avoid:
- productivity language
- harsh optimization framing
- rigid self-help language
- exaggerated certainty

Recognize that friction may emerge from:
- overload
- conflicting values
- insufficient recovery
- environmental pressure
- chronic responsibility
- unclear boundaries
- emotional depletion
- unrealistic expectations

Return ONLY valid JSON.

Required JSON structure:

{
  "themes": [
    "string"
  ],

  "overloadAreas": [
    "string"
  ],

  "behavioralFriction": [
    "string"
  ],

  "environmentalFriction": [
    "string"
  ],

  "emotionalStrain": [
    "string"
  ],

  "sustainabilityRisks": [
    "string"
  ],

  "overloadLevel":
    "low | moderate | high",

  "reflectiveSummary":
    "string"
}

Participant Values:
${JSON.stringify(values)}

Participant Goals:
${JSON.stringify(goals)}

Known Strengths:
${JSON.stringify(strengths)}

Existing Friction Themes:
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
function safelyParseFriction(response) {

  try {

    return JSON.parse(response);

  } catch (err) {

    console.error(
      "Friction parsing error:",
      err
    );

    return {

      themes: [],

      overloadAreas: [],

      behavioralFriction: [],

      environmentalFriction: [],

      emotionalStrain: [],

      sustainabilityRisks: [],

      overloadLevel: "moderate",

      reflectiveSummary:
        "Some areas of strain or overload may be present, though additional reflection may help clarify them further."
    };
  }
}
