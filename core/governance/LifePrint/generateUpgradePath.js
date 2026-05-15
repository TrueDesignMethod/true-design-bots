// core/lifeprint/generateUpgradePath.js
// TRUE AI — LifePrint Upgrade Path Generator

// --------------------------------------------------
// LIFEPRINT UPGRADE PATH GENERATOR
// --------------------------------------------------
// Purpose:
// Create a grounded upgrade section that helps
// participants identify:
//
// - sustainable growth priorities
// - realistic mindset shifts
// - supportive boundaries
// - low-friction adjustments
// - emotionally sustainable changes
// - aligned next directions
//
// This section should feel:
// - encouraging
// - grounded
// - realistic
// - stabilizing
//
// It should NOT feel:
// - overwhelming
// - aggressive
// - hyper-productive
// - transformational in tone
//
// Growth is treated as:
// gradual alignment,
// not self-reinvention.
// --------------------------------------------------


// --------------------------------------------------
// Main Upgrade Path Generator
// --------------------------------------------------
export async function generateUpgradePath({

  upgrades = {},

  strengths = {},

  friction = {},

  llm

}) {

  // ----------------------------------------------
  // Extract upgrade analysis
  // ----------------------------------------------
  const {

    priorities = [],

    mindsetShifts = [],

    boundaryNeeds = [],

    sustainableAdjustments = [],

    strengthsToLeverage = [],

    supportiveExperiments = [],

    pacingRecommendations = [],

    reflectiveSummary = ""

  } = upgrades;


  // ----------------------------------------------
  // Extract strengths analysis
  // ----------------------------------------------
  const {

    detected = [],

    supportiveQualities = []

  } = strengths;


  // ----------------------------------------------
  // Extract friction analysis
  // ----------------------------------------------
  const {

    overloadAreas = [],

    sustainabilityRisks = [],

    overloadLevel = "moderate"

  } = friction;


  // ----------------------------------------------
  // Build prompt
  // ----------------------------------------------
  const prompt =
    buildUpgradePrompt({

      priorities,

      mindsetShifts,

      boundaryNeeds,

      sustainableAdjustments,

      strengthsToLeverage,

      supportiveExperiments,

      pacingRecommendations,

      reflectiveSummary,

      detected,

      supportiveQualities,

      overloadAreas,

      sustainabilityRisks,

      overloadLevel
    });


  // ----------------------------------------------
  // Generate narrative
  // ----------------------------------------------
  const response = await llm({

    prompt,

    maxTokens: 1000
  });


  // ----------------------------------------------
  // Return formatted section
  // ----------------------------------------------
  return {

    title:
      "Upgrade Path",

    narrative:
      response?.trim() || "",

    priorities: priorities.slice(0, 5),

    experiments: supportiveExperiments.slice(0, 5)
  };
}


// --------------------------------------------------
// Prompt Builder
// --------------------------------------------------
function buildUpgradePrompt({

  priorities = [],

  mindsetShifts = [],

  boundaryNeeds = [],

  sustainableAdjustments = [],

  strengthsToLeverage = [],

  supportiveExperiments = [],

  pacingRecommendations = [],

  reflectiveSummary = "",

  detected = [],

  supportiveQualities = [],

  overloadAreas = [],

  sustainabilityRisks = [],

  overloadLevel = "moderate"

}) {

  return `
You are TRUE AI.

You are writing the Upgrade Path section of a participant's LifePrint.

Your role is to help the participant identify:
- realistic next growth areas
- sustainable adjustments
- supportive mindset shifts
- boundary improvements
- emotionally sustainable movement
- aligned experimentation

The tone should feel:
- grounded
- calm
- realistic
- supportive
- emotionally intelligent

Do NOT:
- pressure transformation
- encourage over-optimization
- overwhelm the participant
- create dramatic reinvention narratives
- use hustle culture language
- imply constant productivity

Avoid:
- "grind harder"
- "10x yourself"
- "unlock your highest self"
- "optimize everything"
- "be unstoppable"

Recognize:
- growth can be gradual
- sustainability matters
- pacing matters
- small changes can be meaningful
- rest and recovery matter
- alignment matters more than intensity

The participant should leave this section feeling:
- clearer
- steadier
- more capable of realistic movement
- less pressured
- more aware of supportive possibilities

Write in:
- second person ("you")
- grounded reflective language
- emotionally steady pacing

The section should include:
- upgrade priorities
- mindset reframes
- boundary strengthening
- sustainable adjustments
- realistic experimentation
- pacing awareness
- strengths that may support growth

It should feel:
- actionable
without
- becoming rigid or overwhelming.

Upgrade Priorities:
${JSON.stringify(priorities)}

Mindset Shifts:
${JSON.stringify(mindsetShifts)}

Boundary Needs:
${JSON.stringify(boundaryNeeds)}

Sustainable Adjustments:
${JSON.stringify(sustainableAdjustments)}

Strengths To Leverage:
${JSON.stringify(strengthsToLeverage)}

Supportive Experiments:
${JSON.stringify(supportiveExperiments)}

Pacing Recommendations:
${JSON.stringify(pacingRecommendations)}

Detected Strengths:
${JSON.stringify(detected)}

Supportive Qualities:
${JSON.stringify(supportiveQualities)}

Overload Areas:
${JSON.stringify(overloadAreas)}

Sustainability Risks:
${JSON.stringify(sustainabilityRisks)}

Overload Level:
${overloadLevel}

Reflective Summary:
${reflectiveSummary}
`;
}
