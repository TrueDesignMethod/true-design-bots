// core/interpreter/alignmentAnalyzer.js
// TRUE AI — Alignment Analyzer

// --------------------------------------------------
// ALIGNMENT ANALYZER
// --------------------------------------------------
// Purpose:
// Identify:
//
// - alignment between values and lifestyle
// - alignment between goals and capacity
// - internal coherence
// - major tension areas
// - meaningful congruence
//
// This analyzer is intentionally:
// - reflective
// - non-diagnostic
// - non-deterministic
// - emotionally safe
//
// It does NOT:
// - define identity
// - rank participants
// - determine worth
//
// It helps surface:
// alignment + friction.
// --------------------------------------------------


// --------------------------------------------------
// Main Alignment Analysis
// --------------------------------------------------
export async function analyzeAlignment({

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
  const prompt = buildAlignmentPrompt({

    input,

    values,

    goals,

    frictionThemes,

    strengths
  });


  // ----------------------------------------------
  // LLM analysis
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 500
  });


  // ----------------------------------------------
  // Parse response
  // ----------------------------------------------
  const parsed =
    safelyParseAlignment(response);


  // ----------------------------------------------
  // Return structured alignment
  // ----------------------------------------------
  return {

    overallAlignment:
      parsed.overallAlignment || "mixed",

    alignedAreas:
      parsed.alignedAreas || [],

    misalignedAreas:
      parsed.misalignedAreas || [],

    tensions:
      parsed.tensions || [],

    supportivePatterns:
      parsed.supportivePatterns || [],

    reflectiveSummary:
      parsed.reflectiveSummary || ""
  };
}


// --------------------------------------------------
// Build Alignment Prompt
// --------------------------------------------------
function buildAlignmentPrompt({

  input,

  values = [],

  goals = [],

  frictionThemes = [],

  strengths = []

}) {

  return `
You are TRUE AI.

You are analyzing alignment patterns within a participant's life.

Your task is NOT to diagnose, judge, or define identity.

Your role is to gently identify:
- areas of alignment
- areas of tension
- value congruence
- goal friction
- emotional mismatch
- supportive patterns

Use calm, reflective language.

Avoid:
- harsh language
- certainty
- motivational coaching
- optimization language
- over-pathologizing

Return ONLY valid JSON.

Required JSON structure:

{
  "overallAlignment": "low | mixed | emerging | strong",

  "alignedAreas": [
    "string"
  ],

  "misalignedAreas": [
    "string"
  ],

  "tensions": [
    "string"
  ],

  "supportivePatterns": [
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
function safelyParseAlignment(response) {

  try {

    return JSON.parse(response);

  } catch (err) {

    console.error(
      "Alignment parsing error:",
      err
    );

    return {

      overallAlignment: "mixed",

      alignedAreas: [],

      misalignedAreas: [],

      tensions: [],

      supportivePatterns: [],

      reflectiveSummary:
        "Some alignment patterns were identified, though additional reflection may help clarify them further."
    };
  }
}
