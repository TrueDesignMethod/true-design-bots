// core/interpreter/synthesisEngine.js
// TRUE AI — Discovery Synthesis Engine

// --------------------------------------------------
// SYNTHESIS ENGINE
// --------------------------------------------------
// Purpose:
// Integrate:
//
// - alignment patterns
// - strengths
// - friction
// - contradictions
// - capacity realities
// - upgrade opportunities
//
// into a coherent reflective synthesis.
//
// This engine is intentionally:
// - integrative
// - emotionally grounded
// - non-diagnostic
// - non-performative
//
// The goal is NOT to:
// - summarize mechanically
// - flatten complexity
// - create identity labels
//
// The goal is to:
// help participants feel more clearly
// understood while preserving nuance,
// agency, and emotional safety.
// --------------------------------------------------


// --------------------------------------------------
// Main Synthesis Function
// --------------------------------------------------
export async function synthesizeDiscovery({

  alignment = {},

  strengths = {},

  friction = {},

  capacity = {},

  contradictions = {},

  upgrades = {},

  llm

}) {

  // ----------------------------------------------
  // Build synthesis prompt
  // ----------------------------------------------
  const prompt =
    buildSynthesisPrompt({

      alignment,

      strengths,

      friction,

      capacity,

      contradictions,

      upgrades
    });


  // ----------------------------------------------
  // Run synthesis generation
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 1000
  });


  // ----------------------------------------------
  // Parse structured synthesis
  // ----------------------------------------------
  const parsed =
    safelyParseSynthesis(response);


  // ----------------------------------------------
  // Return structured synthesis
  // ----------------------------------------------
  return {

    dominantThemes:
      parsed.dominantThemes || [],

    primaryTensions:
      parsed.primaryTensions || [],

    supportiveStrengths:
      parsed.supportiveStrengths || [],

    sustainabilityConsiderations:
      parsed.sustainabilityConsiderations || [],

    upgradePriorities:
      parsed.upgradePriorities || [],

    readinessLevel:
      parsed.readinessLevel || "emerging",

    reflectiveNarrative:
      parsed.reflectiveNarrative || ""
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildSynthesisPrompt({

  alignment,

  strengths,

  friction,

  capacity,

  contradictions,

  upgrades

}) {

  return `
You are TRUE AI.

You are synthesizing reflective insights into a coherent understanding of a participant's current state.

Your role is to integrate:
- strengths
- friction
- contradictions
- capacity realities
- alignment patterns
- growth priorities

into a grounded, emotionally intelligent synthesis.

Do NOT:
- diagnose
- reduce the participant to labels
- over-simplify complexity
- force certainty
- exaggerate positivity
- create dramatic transformation narratives

Recognize that:
- human beings are nuanced
- tension is normal
- contradictions are human
- growth requires sustainability
- clarity often emerges gradually

Your tone should feel:
- calm
- thoughtful
- emotionally safe
- reflective
- grounded

Avoid:
- corporate coaching language
- hustle culture framing
- pseudo-spiritual language
- exaggerated encouragement
- rigid self-help rhetoric

Return ONLY valid JSON.

Required JSON structure:

{
  "dominantThemes": [
    "string"
  ],

  "primaryTensions": [
    "string"
  ],

  "supportiveStrengths": [
    "string"
  ],

  "sustainabilityConsiderations": [
    "string"
  ],

  "upgradePriorities": [
    "string"
  ],

  "readinessLevel":
    "emerging | developing | stabilizing | ready",

  "reflectiveNarrative":
    "string"
}

Alignment Analysis:
${JSON.stringify(alignment)}

Strength Analysis:
${JSON.stringify(strengths)}

Friction Analysis:
${JSON.stringify(friction)}

Capacity Analysis:
${JSON.stringify(capacity)}

Contradiction Analysis:
${JSON.stringify(contradictions)}

Upgrade Analysis:
${JSON.stringify(upgrades)}
`;
}


// --------------------------------------------------
// Safe JSON Parsing
// --------------------------------------------------
function safelyParseSynthesis(response) {

  try {

    return JSON.parse(response);

  } catch (err) {

    console.error(
      "Synthesis parsing error:",
      err
    );

    return {

      dominantThemes: [],

      primaryTensions: [],

      supportiveStrengths: [],

      sustainabilityConsiderations: [],

      upgradePriorities: [],

      readinessLevel: "emerging",

      reflectiveNarrative:
        "Several meaningful patterns may be emerging, though additional reflection may help bring greater clarity and coherence over time."
    };
  }
}
