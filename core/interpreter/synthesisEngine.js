// core/interpreter/synthesisEngine.js
// TRUE AI — Symbolic Discovery Synthesis Engine
//
// PURPOSE
// --------------------------------------------------
// Aggregate:
// - strengths
// - friction
// - contradictions
// - alignment
// - capacity
// - upgrade signals
//
// into a coherent symbolic state.
//
// WITHOUT LLM DEPENDENCE.
//
// This engine acts as:
// - a state integrator
// - readiness estimator
// - sustainability synthesizer
// - symbolic cognition layer
//
// OUTPUT:
// structured state JSON
//
// NOT prose.
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

  upgrades = {}

}) {

  // ----------------------------------------------
  // Extract Core Signals
  // ----------------------------------------------
  const dominantStrengths =
    strengths?.detected || [];

  const dominantFriction =
    friction?.themes || [];

  const dominantContradictions =
    contradictions?.themes || [];

  const upgradePriorities =
    upgrades?.priorities || [];


  // ----------------------------------------------
  // Aggregate Tensions
  // ----------------------------------------------
  const primaryTensions = [

    ...(contradictions
      ?.unresolvedTensions || []),

    ...(alignment
      ?.tensions || [])

  ];


  // ----------------------------------------------
  // Aggregate Sustainability
  // ----------------------------------------------
  const sustainabilityConsiderations = [

    ...(capacity
      ?.sustainabilityConcerns || []),

    ...(friction
      ?.sustainabilityRisks || [])

  ];


  // ----------------------------------------------
  // Determine Alignment State
  // ----------------------------------------------
  const alignmentState =
    determineAlignmentState({

      alignment,

      friction,

      contradictions
    });


  // ----------------------------------------------
  // Determine Sustainability Risk
  // ----------------------------------------------
  const sustainabilityRisk =
    determineSustainabilityRisk({

      friction,

      capacity
    });


  // ----------------------------------------------
  // Determine Readiness
  // ----------------------------------------------
  const readinessLevel =
    determineReadiness({

      strengths,

      friction,

      capacity,

      contradictions,

      alignment
    });


  // ----------------------------------------------
  // Determine Dominant Themes
  // ----------------------------------------------
  const dominantThemes =
    rankThemes([

      ...dominantStrengths,

      ...dominantFriction,

      ...dominantContradictions

    ]);


  // ----------------------------------------------
  // Return Structured Synthesis
  // ----------------------------------------------
  return {

    dominantThemes,

    dominantStrengths,

    dominantFriction,

    dominantContradictions,

    primaryTensions:
      unique(primaryTensions),

    supportiveStrengths:
      dominantStrengths,

    sustainabilityConsiderations:
      unique(
        sustainabilityConsiderations
      ),

    upgradePriorities:
      unique(upgradePriorities),

    readinessLevel,

    sustainabilityRisk,

    alignmentState
  };
}


// --------------------------------------------------
// Determine Alignment State
// --------------------------------------------------
function determineAlignmentState({

  alignment = {},

  friction = {},

  contradictions = {}

}) {

  const alignmentLevel =
    alignment?.overallAlignment
    || "mixed";

  const contradictionCount =
    contradictions?.themes
      ?.length || 0;

  const frictionCount =
    friction?.themes
      ?.length || 0;


  // ----------------------------------------------
  // Strong Alignment
  // ----------------------------------------------
  if (

    alignmentLevel === "strong"

    && contradictionCount <= 1

    && frictionCount <= 2

  ) {

    return "coherent";
  }


  // ----------------------------------------------
  // Fragmented
  // ----------------------------------------------
  if (

    contradictionCount >= 3

    || frictionCount >= 4

  ) {

    return "fragmented";
  }


  // ----------------------------------------------
  // Transitional
  // ----------------------------------------------
  if (

    alignmentLevel === "emerging"

  ) {

    return "transitional";
  }


  return "mixed";
}


// --------------------------------------------------
// Determine Sustainability Risk
// --------------------------------------------------
function determineSustainabilityRisk({

  friction = {},

  capacity = {}

}) {

  const overloadLevel =
    friction?.overloadLevel
    || "moderate";

  const overallCapacity =
    capacity?.overallCapacity
    || "moderate";


  // ----------------------------------------------
  // High Risk
  // ----------------------------------------------
  if (

    overloadLevel === "high"

    || overallCapacity === "low"

  ) {

    return "high";
  }


  // ----------------------------------------------
  // Moderate Risk
  // ----------------------------------------------
  if (

    overloadLevel === "moderate"

    || overallCapacity === "moderate"

  ) {

    return "moderate";
  }


  return "stable";
}


// --------------------------------------------------
// Determine Readiness
// --------------------------------------------------
function determineReadiness({

  strengths = {},

  friction = {},

  capacity = {},

  contradictions = {},

  alignment = {}

}) {

  const strengthCount =
    strengths?.detected
      ?.length || 0;

  const contradictionCount =
    contradictions?.themes
      ?.length || 0;

  const alignmentLevel =
    alignment?.overallAlignment
    || "mixed";

  const capacityLevel =
    capacity?.overallCapacity
    || "moderate";


  // ----------------------------------------------
  // Ready
  // ----------------------------------------------
  if (

    strengthCount >= 4

    && alignmentLevel === "strong"

    && capacityLevel !== "low"

    && contradictionCount <= 1

  ) {

    return "ready";
  }


  // ----------------------------------------------
  // Stabilizing
  // ----------------------------------------------
  if (

    strengthCount >= 3

    && capacityLevel !== "low"

  ) {

    return "stabilizing";
  }


  // ----------------------------------------------
  // Developing
  // ----------------------------------------------
  if (

    strengthCount >= 2

  ) {

    return "developing";
  }


  return "emerging";
}


// --------------------------------------------------
// Rank Themes
// --------------------------------------------------
function rankThemes(themes = []) {

  const counts = {};


  for (
    const theme
    of themes
  ) {

    counts[theme] =
      (counts[theme] || 0) + 1;
  }


  return Object.entries(counts)

    .sort((a, b) => b[1] - a[1])

    .map(([theme]) => theme);
}


// --------------------------------------------------
// Utility — Unique Values
// --------------------------------------------------
function unique(arr = []) {

  return [...new Set(arr)];
}
