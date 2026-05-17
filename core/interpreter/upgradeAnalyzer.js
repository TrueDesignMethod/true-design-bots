// core/interpreter/upgradeAnalyzer.js
// TRUE AI — Symbolic Upgrade Inference Engine
//
// PURPOSE
// --------------------------------------------------
// Infer:
// - realistic upgrades
// - sustainable movement
// - supportive adjustments
// - boundary reinforcement
// - pacing support
// - strength-leveraged movement
//
// WITHOUT LLM DEPENDENCE.
//
// This is NOT:
// - optimization coaching
// - transformation pressure
// - productivity escalation
//
// Upgrades are treated as:
// - sustainable adaptation
// - supportive restructuring
// - aligned movement
// - low-friction evolution
//
// The goal is to infer:
// realistic next-step possibilities
// from symbolic state patterns.
// --------------------------------------------------


// --------------------------------------------------
// Main Upgrade Analysis
// --------------------------------------------------
export async function analyzeUpgradeAreas({

  input = "",

  participantProfile = {},

  strengths = {},

  friction = {},

  contradictions = {}

}) {

  // ----------------------------------------------
  // Extract Context
  // ----------------------------------------------
  const {

    values = [],

    goals = []

  } = participantProfile;


  // ----------------------------------------------
  // State Containers
  // ----------------------------------------------
  const priorities = [];

  const mindsetShifts = [];

  const boundaryNeeds = [];

  const sustainableAdjustments = [];

  const strengthsToLeverage = [];

  const supportiveExperiments = [];

  const pacingRecommendations = [];


  // ----------------------------------------------
  // Extract Analyzer Outputs
  // ----------------------------------------------
  const detectedStrengths =
    strengths?.detected || [];

  const frictionThemes =
    friction?.themes || [];

  const contradictionThemes =
    contradictions?.themes || [];

  const overloadLevel =
    friction?.overloadLevel || "moderate";


  // ------------------------------------------------
  // STRENGTH-LEVERAGED MOVEMENT
  // ------------------------------------------------

  if (
    detectedStrengths.includes(
      "self_awareness"
    )
  ) {

    strengthsToLeverage.push(
      "existing reflective awareness"
    );

    supportiveExperiments.push(
      "structured self-reflection"
    );
  }


  if (
    detectedStrengths.includes(
      "adaptability"
    )
  ) {

    strengthsToLeverage.push(
      "willingness to adjust"
    );

    supportiveExperiments.push(
      "small sustainable changes"
    );
  }


  if (
    detectedStrengths.includes(
      "relational_awareness"
    )
  ) {

    strengthsToLeverage.push(
      "interpersonal insight"
    );

    boundaryNeeds.push(
      "relational boundary reinforcement"
    );
  }


  // ------------------------------------------------
  // FRICTION-INFORMED UPGRADES
  // ------------------------------------------------

  if (
    frictionThemes.includes(
      "overload"
    )
  ) {

    priorities.push(
      "capacity stabilization"
    );

    sustainableAdjustments.push(
      "reduce chronic overextension"
    );

    pacingRecommendations.push(
      "slower sustainable pacing"
    );
  }


  if (
    frictionThemes.includes(
      "boundary_erosion"
    )
  ) {

    priorities.push(
      "boundary restoration"
    );

    boundaryNeeds.push(
      "reduce emotional overextension"
    );

    supportiveExperiments.push(
      "practice lower-stakes boundary setting"
    );
  }


  if (
    frictionThemes.includes(
      "misalignment"
    )
  ) {

    priorities.push(
      "value realignment"
    );

    mindsetShifts.push(
      "permission to reassess existing structures"
    );
  }


  if (
    frictionThemes.includes(
      "uncertainty"
    )
  ) {

    pacingRecommendations.push(
      "avoid forced certainty"
    );

    supportiveExperiments.push(
      "small exploratory movement"
    );
  }


  // ------------------------------------------------
  // CONTRADICTION-INFORMED INFERENCE
  // ------------------------------------------------

  if (
    contradictionThemes.some(
      theme =>
        theme.includes("peace")
    )
  ) {

    mindsetShifts.push(
      "rest may be necessary rather than earned"
    );

    sustainableAdjustments.push(
      "reduce unnecessary urgency"
    );
  }


  if (
    contradictionThemes.some(
      theme =>
        theme.includes("boundaries")
    )
  ) {

    boundaryNeeds.push(
      "greater protection of emotional capacity"
    );
  }


  if (
    contradictionThemes.some(
      theme =>
        theme.includes("authenticity")
    )
  ) {

    mindsetShifts.push(
      "external expectations may deserve reevaluation"
    );
  }


  if (
    contradictionThemes.some(
      theme =>
        theme.includes("recovery")
    )
  ) {

    pacingRecommendations.push(
      "recovery may need structural protection"
    );
  }


  // ------------------------------------------------
  // OVERLOAD ADJUSTMENTS
  // ------------------------------------------------

  if (
    overloadLevel === "high"
  ) {

    priorities.unshift(
      "capacity recovery"
    );

    pacingRecommendations.unshift(
      "avoid escalation"
    );

    sustainableAdjustments.push(
      "increase recovery space"
    );
  }


  // ------------------------------------------------
  // Goal-Based Support
  // ------------------------------------------------

  if (
    goals.length >= 3
  ) {

    supportiveExperiments.push(
      "prioritize fewer simultaneous goals"
    );
  }


  // ------------------------------------------------
  // Value-Based Support
  // ------------------------------------------------

  if (
    values.length >= 3
  ) {

    mindsetShifts.push(
      "alignment may matter more than optimization"
    );
  }


  // ------------------------------------------------
  // Build Reflective Summary
  // ------------------------------------------------
  const reflectiveSummary =
    buildReflectiveSummary({

      priorities,

      overloadLevel,

      strengthsToLeverage
    });


  // ------------------------------------------------
  // Return Structured Upgrade Inference
  // ------------------------------------------------
  return {

    priorities:
      unique(priorities),

    mindsetShifts:
      unique(mindsetShifts),

    boundaryNeeds:
      unique(boundaryNeeds),

    sustainableAdjustments:
      unique(sustainableAdjustments),

    strengthsToLeverage:
      unique(strengthsToLeverage),

    supportiveExperiments:
      unique(supportiveExperiments),

    pacingRecommendations:
      unique(pacingRecommendations),

    reflectiveSummary
  };
}


// --------------------------------------------------
// Reflective Summary Builder
// --------------------------------------------------
function buildReflectiveSummary({

  priorities = [],

  overloadLevel = "moderate",

  strengthsToLeverage = []

}) {

  // ----------------------------------------------
  // Low Directionality
  // ----------------------------------------------
  if (
    priorities.length === 0
  ) {

    return `
Some possible areas for sustainable adjustment or reflection may still be emerging.

Meaningful growth does not always require immediate action or major reinvention.
`.trim();
  }


  // ----------------------------------------------
  // Construct Reflective Summary
  // ----------------------------------------------
  return `
Current reflection patterns suggest several possible opportunities for more sustainable movement and supportive adjustment.

These are not prescriptions or requirements.

Instead, they may represent areas where:
- pacing
- boundaries
- recovery
- alignment
- realistic expectations
- existing strengths

could be leveraged more intentionally.

Current overload level appears ${overloadLevel}, which may influence what feels sustainably manageable right now.
`.trim();
}


// --------------------------------------------------
// Utility — Unique Values
// --------------------------------------------------
function unique(arr = []) {

  return [...new Set(arr)];
}
