// core/lifeprint/generateSummary.js
// TRUE AI — LifePrint Summary Generator

// --------------------------------------------------
// LIFEPRINT SUMMARY GENERATOR
// --------------------------------------------------
// Purpose:
// Create a grounded reflective overview of:
//
// - participant themes
// - alignment patterns
// - strengths
// - friction
// - contradictions
// - sustainability considerations
// - emerging direction
//
// This summary should feel:
// - coherent
// - emotionally safe
// - thoughtful
// - human
//
// It should NOT feel:
// - diagnostic
// - performative
// - overly motivational
// - mechanically analytical
//
// The summary is the emotional entry point
// into the participant's LifePrint.
// --------------------------------------------------


// --------------------------------------------------
// Main Summary Generator
// --------------------------------------------------
export async function generateSummary({

  participantProfile = {},

  synthesis = {},

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
  // Extract synthesis insights
  // ----------------------------------------------
  const {

    dominantThemes = [],

    primaryTensions = [],

    supportiveStrengths = [],

    sustainabilityConsiderations = [],

    upgradePriorities = [],

    readinessLevel = "emerging"

  } = synthesis;


  // ----------------------------------------------
  // Build summary prompt
  // ----------------------------------------------
  const prompt =
    buildSummaryPrompt({

      values,

      goals,

      dominantThemes,

      primaryTensions,

      supportiveStrengths,

      sustainabilityConsiderations,

      upgradePriorities,

      readinessLevel
    });


  // ----------------------------------------------
  // Generate summary
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 900
  });


  // ----------------------------------------------
  // Return formatted summary
  // ----------------------------------------------
  return {

    title:
      "Discovery Summary",

    readinessLevel,

    narrative:
      response?.trim() || ""
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildSummaryPrompt({

  values = [],

  goals = [],

  dominantThemes = [],

  primaryTensions = [],

  supportiveStrengths = [],

  sustainabilityConsiderations = [],

  upgradePriorities = [],

  readinessLevel = "emerging"

}) {

  return `
You are TRUE AI.

You are writing the Discovery Summary section of a participant's LifePrint.

Your role is to create:
- a coherent reflective overview
- emotionally grounded synthesis
- calm interpretive clarity

The summary should help the participant feel:
- understood
- clarified
- gently oriented

Do NOT:
- diagnose
- exaggerate
- over-praise
- pressure transformation
- use motivational hype
- sound clinical
- sound corporate
- sound spiritually inflated

The tone should feel:
- thoughtful
- calm
- reflective
- emotionally intelligent
- grounded
- humane

Recognize:
- contradictions are human
- tension is normal
- growth takes time
- sustainability matters
- participants are not problems to solve

Avoid:
- "best version of yourself"
- "unlock your potential"
- "high performer"
- "optimize"
- "level up"
- "fix yourself"

Write in:
- second person ("you")
- warm but restrained language
- emotionally steady pacing

The summary should include:
- dominant life themes
- current tensions
- supportive strengths
- sustainability realities
- emerging opportunities for alignment

It should sound:
- insightful
- coherent
- human

NOT:
- generic
- dramatic
- overly polished

Participant Values:
${JSON.stringify(values)}

Participant Goals:
${JSON.stringify(goals)}

Dominant Themes:
${JSON.stringify(dominantThemes)}

Primary Tensions:
${JSON.stringify(primaryTensions)}

Supportive Strengths:
${JSON.stringify(supportiveStrengths)}

Sustainability Considerations:
${JSON.stringify(sustainabilityConsiderations)}

Upgrade Priorities:
${JSON.stringify(upgradePriorities)}

Current Readiness Level:
${readinessLevel}
`;
}
