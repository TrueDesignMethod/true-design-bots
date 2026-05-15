// core/lifeprint/generateFriction.js
// TRUE AI — LifePrint Friction Generator

// --------------------------------------------------
// LIFEPRINT FRICTION GENERATOR
// --------------------------------------------------
// Purpose:
// Create a reflective friction section that helps
// participants better understand:
//
// - recurring strain
// - overload patterns
// - emotional tension
// - sustainability risks
// - environmental pressure
// - internal contradictions
//
// This section should feel:
// - honest
// - emotionally safe
// - grounded
// - clarifying
//
// It should NOT feel:
// - shaming
// - diagnostic
// - harsh
// - psychologically invasive
//
// Friction is treated as:
// meaningful information,
// not personal failure.
// --------------------------------------------------


// --------------------------------------------------
// Main Friction Generator
// --------------------------------------------------
export async function generateFriction({

  friction = {},

  contradictions = {},

  capacity = {},

  llm

}) {

  // ----------------------------------------------
  // Extract friction analysis
  // ----------------------------------------------
  const {

    themes = [],

    overloadAreas = [],

    behavioralFriction = [],

    environmentalFriction = [],

    emotionalStrain = [],

    sustainabilityRisks = [],

    overloadLevel = "moderate",

    reflectiveSummary = ""

  } = friction;


  // ----------------------------------------------
  // Extract contradiction analysis
  // ----------------------------------------------
  const {

    primaryTensions = [],

    competingPriorities = [],

    unresolvedTensions = []

  } = contradictions;


  // ----------------------------------------------
  // Extract capacity analysis
  // ----------------------------------------------
  const {

    sustainabilityConcerns = [],

    pacingConsiderations = []

  } = capacity;


  // ----------------------------------------------
  // Build prompt
  // ----------------------------------------------
  const prompt =
    buildFrictionPrompt({

      themes,

      overloadAreas,

      behavioralFriction,

      environmentalFriction,

      emotionalStrain,

      sustainabilityRisks,

      overloadLevel,

      reflectiveSummary,

      primaryTensions,

      competingPriorities,

      unresolvedTensions,

      sustainabilityConcerns,

      pacingConsiderations
    });


  // ----------------------------------------------
  // Generate narrative
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 950
  });


  // ----------------------------------------------
  // Return formatted section
  // ----------------------------------------------
  return {

    title:
      "Friction & Load Patterns",

    overloadLevel,

    narrative:
      response?.trim() || "",

    highlights: [

      ...themes,

      ...overloadAreas,

      ...sustainabilityRisks
    ].slice(0, 7)
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildFrictionPrompt({

  themes = [],

  overloadAreas = [],

  behavioralFriction = [],

  environmentalFriction = [],

  emotionalStrain = [],

  sustainabilityRisks = [],

  overloadLevel = "moderate",

  reflectiveSummary = "",

  primaryTensions = [],

  competingPriorities = [],

  unresolvedTensions = [],

  sustainabilityConcerns = [],

  pacingConsiderations = []

}) {

  return `
You are TRUE AI.

You are writing the Friction & Load Patterns section of a participant's LifePrint.

Your role is to help the participant understand:
- recurring friction
- emotional strain
- overload patterns
- sustainability concerns
- internal tension
- environmental pressure

The tone should feel:
- calm
- emotionally safe
- grounded
- reflective
- humane

Do NOT:
- shame participants
- imply failure
- sound clinical
- over-diagnose
- frame struggle as weakness
- use harsh self-improvement language

Avoid:
- "self-sabotage"
- "lazy"
- "undisciplined"
- "fix yourself"
- "push harder"
- productivity obsession

Recognize:
- overload is often contextual
- contradiction is human
- exhaustion is meaningful
- capacity matters
- environments affect people
- sustainable pacing matters

This section should help participants feel:
- clarified
- less alone
- more self-aware
- more compassionate toward themselves

The writing should:
- acknowledge tension honestly
- avoid dramatic language
- avoid hopelessness
- preserve agency
- remain emotionally steady

Write in:
- second person ("you")
- thoughtful readable language
- emotionally grounded pacing

The section should include:
- recurring friction patterns
- overload realities
- internal tensions
- sustainability concerns
- environmental pressures
- emotional strain
- pacing considerations

It should feel:
- insightful
- human
- stabilizing

NOT:
- overwhelming
- harsh
- psychologically invasive

Friction Themes:
${JSON.stringify(themes)}

Overload Areas:
${JSON.stringify(overloadAreas)}

Behavioral Friction:
${JSON.stringify(behavioralFriction)}

Environmental Friction:
${JSON.stringify(environmentalFriction)}

Emotional Strain:
${JSON.stringify(emotionalStrain)}

Sustainability Risks:
${JSON.stringify(sustainabilityRisks)}

Overload Level:
${overloadLevel}

Primary Tensions:
${JSON.stringify(primaryTensions)}

Competing Priorities:
${JSON.stringify(competingPriorities)}

Unresolved Tensions:
${JSON.stringify(unresolvedTensions)}

Sustainability Concerns:
${JSON.stringify(sustainabilityConcerns)}

Pacing Considerations:
${JSON.stringify(pacingConsiderations)}

Reflective Summary:
${reflectiveSummary}
`;
}
