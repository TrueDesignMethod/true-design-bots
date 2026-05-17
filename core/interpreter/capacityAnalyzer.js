// core/interpreter/capacityAnalyzer.js
// TRUE AI — Symbolic Capacity Analyzer
//
// PURPOSE
// --------------------------------------------------
// Estimate:
// - emotional bandwidth
// - cognitive load
// - recovery capacity
// - sustainability pressure
// - environmental strain
// - pacing needs
//
// WITHOUT LLM DEPENDENCE.
//
// This analyzer functions as a:
// symbolic state estimator
//
// using:
// - overload language
// - exhaustion indicators
// - pacing signals
// - fragmentation patterns
// - recovery awareness
//
// Capacity is treated as:
// contextual
// dynamic
// human
// environmentally influenced
//
// NOT:
// moral worth
// productivity
// discipline
// ambition
// --------------------------------------------------

import frictionWeights
  from "../../data/scoring/frictionWeights.json"
  assert { type: "json" };


// --------------------------------------------------
// Main Capacity Analysis
// --------------------------------------------------
export async function analyzeCapacity({

  input = "",

  participantProfile = {}

}) {

  const text =
    input.toLowerCase();


  // ----------------------------------------------
  // Extract Participant Context
  // ----------------------------------------------
  const {

    frictionThemes = [],

    strengths = []

  } = participantProfile;


  // ----------------------------------------------
  // State Containers
  // ----------------------------------------------
  let capacityScore = 0;

  const emotionalBandwidth = [];

  const cognitiveLoad = [];

  const environmentalStrain = [];

  const recoveryChallenges = [];

  const supportFactors = [];

  const sustainabilityConcerns = [];

  const pacingConsiderations = [];

  const detectedSignals = [];


  // ----------------------------------------------
  // Detect Overload Signals
  // ----------------------------------------------
  processCategory({

    text,

    category:
      frictionWeights.categories.overload,

    categoryName:
      "overload",

    detectedSignals,

    onMatch: () => {

      capacityScore += 3;

      emotionalBandwidth.push(
        "reduced emotional reserve"
      );

      cognitiveLoad.push(
        "ongoing pressure accumulation"
      );

      sustainabilityConcerns.push(
        "extended overload exposure"
      );
    }
  });


  // ----------------------------------------------
  // Detect Emotional Fatigue
  // ----------------------------------------------
  processCategory({

    text,

    category:
      frictionWeights.categories.emotional_fatigue,

    categoryName:
      "emotional_fatigue",

    detectedSignals,

    onMatch: () => {

      capacityScore += 4;

      emotionalBandwidth.push(
        "emotional depletion"
      );

      recoveryChallenges.push(
        "insufficient emotional recovery"
      );

      pacingConsiderations.push(
        "slower pacing may be supportive"
      );
    }
  });


  // ----------------------------------------------
  // Detect Boundary Erosion
  // ----------------------------------------------
  processCategory({

    text,

    category:
      frictionWeights.categories.boundary_erosion,

    categoryName:
      "boundary_erosion",

    detectedSignals,

    onMatch: () => {

      capacityScore += 2;

      sustainabilityConcerns.push(
        "overextension risk"
      );

      pacingConsiderations.push(
        "boundary reinforcement may help"
      );
    }
  });


  // ----------------------------------------------
  // Detect Identity Pressure
  // ----------------------------------------------
  processCategory({

    text,

    category:
      frictionWeights.categories.identity_pressure,

    categoryName:
      "identity_pressure",

    detectedSignals,

    onMatch: () => {

      capacityScore += 2;

      cognitiveLoad.push(
        "performance-related strain"
      );

      emotionalBandwidth.push(
        "persistent internal pressure"
      );
    }
  });


  // ----------------------------------------------
  // Detect Environmental Strain
  // ----------------------------------------------
  if (
    frictionThemes.length >= 3
  ) {

    environmentalStrain.push(
      "multiple active pressure sources"
    );

    capacityScore += 2;
  }


  // ----------------------------------------------
  // Detect Existing Strengths
  // ----------------------------------------------
  if (
    strengths.length >= 3
  ) {

    supportFactors.push(
      "existing internal resilience"
    );

    supportFactors.push(
      "reflective self-awareness"
    );
  }


  // ----------------------------------------------
  // Recovery Language Detection
  // ----------------------------------------------
  const recoveryIndicators = [

    "rest",

    "recover",

    "slow down",

    "space",

    "balance",

    "pause"
  ];


  for (
    const term
    of recoveryIndicators
  ) {

    if (
      text.includes(term)
    ) {

      recoveryChallenges.push(
        "recovery needs acknowledged"
      );

      pacingConsiderations.push(
        "restorative pacing awareness"
      );

      break;
    }
  }


  // ----------------------------------------------
  // Determine Overall Capacity
  // ----------------------------------------------
  let overallCapacity =
    "stable";


  if (capacityScore >= 10) {

    overallCapacity =
      "low";

  } else if (capacityScore >= 6) {

    overallCapacity =
      "moderate";

  } else if (

    supportFactors.length >= 2

  ) {

    overallCapacity =
      "supported";
  }


  // ----------------------------------------------
  // Build Reflective Summary
  // ----------------------------------------------
  const reflectiveSummary =
    buildReflectiveSummary({

      overallCapacity,

      detectedSignals,

      sustainabilityConcerns
    });


  // ----------------------------------------------
  // Return Structured Capacity
  // ----------------------------------------------
  return {

    overallCapacity,

    emotionalBandwidth:
      unique(emotionalBandwidth),

    cognitiveLoad:
      unique(cognitiveLoad),

    environmentalStrain:
      unique(environmentalStrain),

    recoveryChallenges:
      unique(recoveryChallenges),

    supportFactors:
      unique(supportFactors),

    sustainabilityConcerns:
      unique(sustainabilityConcerns),

    pacingConsiderations:
      unique(pacingConsiderations),

    reflectiveSummary,

    capacityScore
  };
}


// --------------------------------------------------
// Process Category
// --------------------------------------------------
function processCategory({

  text,

  category,

  categoryName,

  detectedSignals,

  onMatch

}) {

  if (!category) {
    return;
  }


  let matchedCount = 0;


  for (
    const signal
    of category.signals
  ) {

    for (
      const example
      of signal.examples
    ) {

      if (
        text.includes(
          example.toLowerCase()
        )
      ) {

        matchedCount++;

        detectedSignals.push({

          category:
            categoryName,

          signal:
            signal.name,

          matchedExample:
            example
        });
      }
    }
  }


  // ----------------------------------------------
  // Minimum Threshold
  // ----------------------------------------------
  if (matchedCount >= 1) {

    onMatch();
  }
}


// --------------------------------------------------
// Reflective Summary Builder
// --------------------------------------------------
function buildReflectiveSummary({

  overallCapacity,

  detectedSignals = [],

  sustainabilityConcerns = []

}) {

  // ----------------------------------------------
  // Supported
  // ----------------------------------------------
  if (
    overallCapacity === "supported"
  ) {

    return `
Current reflection patterns suggest the presence of several supportive internal resources and some awareness of sustainable pacing.

This does not eliminate challenge or strain, though it may indicate that meaningful support structures or adaptive capacities are present.
`.trim();
  }


  // ----------------------------------------------
  // Low Capacity
  // ----------------------------------------------
  if (
    overallCapacity === "low"
  ) {

    return `
Current reflection patterns suggest significant pressure on emotional or cognitive capacity.

This does not imply weakness or failure.

Instead, it may indicate that current responsibilities, emotional demands, or environmental pressures are exceeding what feels sustainably manageable right now.
`.trim();
  }


  // ----------------------------------------------
  // Moderate Capacity
  // ----------------------------------------------
  if (
    overallCapacity === "moderate"
  ) {

    return `
Current reflection patterns suggest a mixture of functioning capacity and ongoing strain.

Some areas may still feel manageable, while others may benefit from additional recovery, pacing, support, or boundary protection.
`.trim();
  }


  // ----------------------------------------------
  // Stable Capacity
  // ----------------------------------------------
  return `
Current reflection patterns suggest relatively stable capacity overall, though some sustainability considerations or pressure points may still be present.

Human capacity naturally fluctuates across seasons, environments, and responsibilities.
`.trim();
}


// --------------------------------------------------
// Utility — Unique Values
// --------------------------------------------------
function unique(arr = []) {

  return [...new Set(arr)];
}
