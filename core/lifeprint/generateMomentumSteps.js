// core/lifeprint/generateMomentumSteps.js
// TRUE AI — LifePrint Momentum Steps Generator

// --------------------------------------------------
// LIFEPRINT MOMENTUM STEPS GENERATOR
// --------------------------------------------------
// Purpose:
// Generate small, realistic, low-friction next steps
// that help participants:
//
// - build gentle momentum
// - increase alignment
// - reduce overwhelm
// - support sustainability
// - create movement without pressure
//
// Momentum is treated as:
// sustainable movement,
// not aggressive acceleration.
//
// This section should feel:
// - realistic
// - calm
// - actionable
// - emotionally safe
//
// It should NOT feel:
// - overwhelming
// - productivity-driven
// - rigid
// - hyper-performative
//
// The goal is to help participants leave
// the LifePrint with a few grounded,
// achievable next steps.
// --------------------------------------------------


// --------------------------------------------------
// Main Momentum Generator
// --------------------------------------------------
export async function generateMomentumSteps({

  synthesis = {},

  upgrades = {},

  capacity = {},

  llm

}) {

  // ----------------------------------------------
  // Extract synthesis insights
  // ----------------------------------------------
  const {

    dominantThemes = [],

    primaryTensions = [],

    upgradePriorities = [],

    readinessLevel = "emerging"

  } = synthesis;


  // ----------------------------------------------
  // Extract upgrade insights
  // ----------------------------------------------
  const {

    supportiveExperiments = [],

    sustainableAdjustments = [],

    pacingRecommendations = []

  } = upgrades;


  // ----------------------------------------------
  // Extract capacity insights
  // ----------------------------------------------
  const {

    overallCapacity = "moderate",

    sustainabilityConcerns = []

  } = capacity;


  // ----------------------------------------------
  // Build prompt
  // ----------------------------------------------
  const prompt =
    buildMomentumPrompt({

      dominantThemes,

      primaryTensions,

      upgradePriorities,

      readinessLevel,

      supportiveExperiments,

      sustainableAdjustments,

      pacingRecommendations,

      overallCapacity,

      sustainabilityConcerns
    });


  // ----------------------------------------------
  // Generate momentum response
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 850
  });


  // ----------------------------------------------
  // Parse momentum structure
  // ----------------------------------------------
  const parsed =
    safelyParseMomentum(response);


  // ----------------------------------------------
  // Return formatted section
  // ----------------------------------------------
  return {

    title:
      "Momentum Steps",

    readinessLevel,

    narrative:
      parsed.narrative || "",

    steps:
      parsed.steps || [],

    reminders:
      parsed.reminders || []
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildMomentumPrompt({

  dominantThemes = [],

  primaryTensions = [],

  upgradePriorities = [],

  readinessLevel = "emerging",

  supportiveExperiments = [],

  sustainableAdjustments = [],

  pacingRecommendations = [],

  overallCapacity = "moderate",

  sustainabilityConcerns = []

}) {

  return `
You are TRUE AI.

You are writing the Momentum Steps section of a participant's LifePrint.

Your role is to help the participant identify:
- small realistic next steps
- sustainable movement
- low-friction actions
- stabilizing practices
- supportive experiments
- gentle momentum

The goal is NOT:
- aggressive transformation
- high performance
- rapid optimization
- overwhelming planning

The goal IS:
- realistic movement
- sustainable pacing
- emotional steadiness
- increased alignment

The participant should leave feeling:
- calmer
- clearer
- more capable of movement
- less overwhelmed

Do NOT:
- overload participants with tasks
- create rigid routines
- imply urgency
- use hustle culture language
- encourage perfectionism

Avoid:
- "go all in"
- "push harder"
- "maximize productivity"
- "discipline yourself"
- "grind"
- "10x"

Recognize:
- small movement matters
- pacing matters
- recovery matters
- sustainability matters
- consistency is built gradually

Write in:
- second person ("you")
- calm grounded language
- emotionally steady pacing

Return ONLY valid JSON.

Required JSON structure:

{
  "narrative":
    "string",

  "steps": [
    "string"
  ],

  "reminders": [
    "string"
  ]
}

The steps should:
- be realistic
- be low-friction
- support sustainability
- avoid overwhelm
- feel achievable

Examples of appropriate momentum:
- reducing one obligation
- creating one boundary
- introducing one recovery habit
- simplifying one commitment
- creating one reflection practice

Dominant Themes:
${JSON.stringify(dominantThemes)}

Primary Tensions:
${JSON.stringify(primaryTensions)}

Upgrade Priorities:
${JSON.stringify(upgradePriorities)}

Supportive Experiments:
${JSON.stringify(supportiveExperiments)}

Sustainable Adjustments:
${JSON.stringify(sustainableAdjustments)}

Pacing Recommendations:
${JSON.stringify(pacingRecommendations)}

Overall Capacity:
${overallCapacity}

Sustainability Concerns:
${JSON.stringify(sustainabilityConcerns)}

Readiness Level:
${readinessLevel}
`;
}


// --------------------------------------------------
// Safe JSON Parsing
// --------------------------------------------------
function safelyParseMomentum(response) {

  try {

    return JSON.parse(response);

  } catch (err) {

    console.error(
      "Momentum parsing error:",
      err
    );

    return {

      narrative:
        "Meaningful movement often begins with small, sustainable shifts rather than dramatic change.",

      steps: [

        "Identify one area of unnecessary pressure that could be softened slightly.",

        "Create a small moment of intentional reflection during the week.",

        "Notice where your current pace may need more sustainability or recovery."
      ],

      reminders: [

        "Small consistent movement is still meaningful movement.",

        "Sustainable growth is often quieter than dramatic transformation.",

        "You do not need to solve everything at once."
      ]
    };
  }
}
