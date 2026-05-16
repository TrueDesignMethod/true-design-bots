// core/lifeprint/generateStrengths.js
// TRUE AI — LifePrint Strengths Generator

// --------------------------------------------------
// LIFEPRINT STRENGTHS GENERATOR
// --------------------------------------------------
// Purpose:
// Create a reflective strengths section that helps
// participants recognize:
//
// - supportive qualities
// - resilience patterns
// - adaptive capacities
// - grounded strengths
// - sustainable internal resources
//
// This section should feel:
// - honest
// - encouraging
// - grounded
// - emotionally intelligent
//
// It should NOT feel:
// - inflated
// - performative
// - corporate
// - overly flattering
//
// Strengths are presented as:
// supportive resources,
// not identity labels.
// --------------------------------------------------


// --------------------------------------------------
// Main Strengths Generator
// --------------------------------------------------
export async function generateStrengths({

  strengths = {},

  participantProfile = {},

  llm

}) {

  // ----------------------------------------------
  // Extract strengths analysis
  // ----------------------------------------------
  const {

    detected = [],

    resiliencePatterns = [],

    supportiveQualities = [],

    growthAssets = [],

    overextendedStrengths = [],

    reflectiveSummary = ""

  } = strengths;


  // ----------------------------------------------
  // Participant context
  // ----------------------------------------------
  const {

    values = [],

    goals = []

  } = participantProfile;


  // ----------------------------------------------
  // Build prompt
  // ----------------------------------------------
  const prompt =
    buildStrengthsPrompt({

      values,

      goals,

      detected,

      resiliencePatterns,

      supportiveQualities,

      growthAssets,

      overextendedStrengths,

      reflectiveSummary
    });


  // ----------------------------------------------
  // Generate narrative
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 850
  });


  // ----------------------------------------------
  // Return formatted section
  // ----------------------------------------------
  return {

    title:
      "Strength Architecture",

    narrative:
      response?.trim() || "",

    highlights: [

      ...detected,

      ...supportiveQualities
    ].slice(0, 6)
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildStrengthsPrompt({

  values = [],

  goals = [],

  detected = [],

  resiliencePatterns = [],

  supportiveQualities = [],

  growthAssets = [],

  overextendedStrengths = [],

  reflectiveSummary = ""

}) {

  return `
You are TRUE AI.

You are writing the Strength Architecture section of a participant's LifePrint.

Your role is to help the participant recognize:
- supportive qualities
- resilience patterns
- grounded strengths
- adaptive capacities
- meaningful internal resources

The section should feel:
- calm
- reflective
- emotionally intelligent
- grounded
- believable

Do NOT:
- flatter excessively
- exaggerate strengths
- create heroic narratives
- use performance language
- imply perfection
- create personality labels

Avoid:
- "superpower"
- "elite"
- "high performer"
- "unstoppable"
- "optimize"
- "unlock your potential"

Recognize:
- strengths can become overextended
- resilience can become exhaustion
- responsibility can become overload
- empathy can become depletion

The goal is:
honest supportive reflection.

Write in:
- second person ("you")
- calm, readable language
- emotionally steady pacing

The section should include:
- meaningful strengths
- resilience patterns
- supportive qualities
- how these strengths may support alignment
- gentle awareness around overextension

It should feel:
- human
- nuanced
- thoughtful

NOT:
- inflated
- dramatic
- generic

Participant Values:
${JSON.stringify(values)}

Participant Goals:
${JSON.stringify(goals)}

Detected Strengths:
${JSON.stringify(detected)}

Resilience Patterns:
${JSON.stringify(resiliencePatterns)}

Supportive Qualities:
${JSON.stringify(supportiveQualities)}

Growth Assets:
${JSON.stringify(growthAssets)}

Overextended Strengths:
${JSON.stringify(overextendedStrengths)}

Reflective Summary:
${reflectiveSummary}
`;
}
