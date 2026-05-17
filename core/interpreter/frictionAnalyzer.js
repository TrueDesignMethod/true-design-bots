// core/interpreter/frictionAnalyzer.js
// TRUE AI — Symbolic Friction Analyzer
//
// PURPOSE
// --------------------------------------------------
// Detect:
// - overload
// - emotional strain
// - sustainability pressure
// - misalignment
// - boundary erosion
// - uncertainty
//
// WITHOUT LLM DEPENDENCE.
//
// This analyzer uses:
// - weighted symbolic scoring
// - contextual signal matching
// - emotional safety constraints
// - structured interpretation
//
// This is NOT:
// - diagnosis
// - pathology
// - moral judgment
// --------------------------------------------------

import frictionWeights
  from "../../data/scoring/frictionWeights.json"
  assert { type: "json" };


// --------------------------------------------------
// Main Friction Analysis
// --------------------------------------------------
export async function analyzeFriction({

  input = "",

  participantProfile = {}

}) {

  const text =
    input.toLowerCase();


  // ----------------------------------------------
  // State Containers
  // ----------------------------------------------
  const scores = {};

  const matchedSignals = {};

  const themes = [];

  const overloadAreas = [];

  const behavioralFriction = [];

  const environmentalFriction = [];

  const emotionalStrain = [];

  const sustainabilityRisks = [];


  // ----------------------------------------------
  // Process Categories
  // ----------------------------------------------
  for (

    const [

      categoryName,

      category

    ] of Object.entries(
      frictionWeights.categories
    )

  ) {

    let categoryScore =
      category.baseWeight || 1;

    const categoryMatches = [];


    // --------------------------------------------
    // Process Signals
    // --------------------------------------------
    for (
      const signal
      of category.signals
    ) {

      let signalMatched = false;


      // ------------------------------------------
      // Match Examples
      // ------------------------------------------
      for (
        const example
        of signal.examples
      ) {

        if (
          text.includes(
            example.toLowerCase()
          )
        ) {

          signalMatched = true;

          categoryScore +=
            signal.weight || 1;

          categoryMatches.push({

            signal:
              signal.name,

            matchedExample:
              example
          });
        }
      }


      // ------------------------------------------
      // Track matched signals
      // ------------------------------------------
      if (signalMatched) {

        matchedSignals[
          signal.name
        ] = true;
      }
    }


    // --------------------------------------------
    // Threshold Requirement
    // --------------------------------------------
    const threshold =
      frictionWeights
        ?.friction_constraints
        ?.minimum_signal_threshold
      || 1;


    if (
      categoryMatches.length >= threshold
    ) {

      themes.push(categoryName);

      scores[categoryName] =
        categoryScore;


      // ------------------------------------------
      // Route themes into reflective groupings
      // ------------------------------------------
      categorizeFriction({

        categoryName,

        overloadAreas,

        behavioralFriction,

        environmentalFriction,

        emotionalStrain,

        sustainabilityRisks
      });
    }
  }


  // ----------------------------------------------
  // Determine Overload Level
  // ----------------------------------------------
  const totalScore =
    Object.values(scores)

      .reduce(
        (sum, score) => sum + score,
        0
      );


  let overloadLevel =
    "low";

  if (totalScore >= 12) {

    overloadLevel = "high";

  } else if (totalScore >= 6) {

    overloadLevel = "moderate";
  }


  // ----------------------------------------------
  // Ranked Themes
  // ----------------------------------------------
  const rankedThemes =
    Object.entries(scores)

      .sort(
        (a, b) => b[1] - a[1]
      )

      .map(([name]) => name);


  // ----------------------------------------------
  // Reflective Summary
  // ----------------------------------------------
  const reflectiveSummary =
    buildReflectiveSummary({

      rankedThemes,

      overloadLevel
    });


  // ----------------------------------------------
  // Return Structured Output
  // ----------------------------------------------
  return {

    themes:
      rankedThemes,

    overloadAreas,

    behavioralFriction,

    environmentalFriction,

    emotionalStrain,

    sustainabilityRisks,

    overloadLevel,

    reflectiveSummary,

    scores
  };
}


// --------------------------------------------------
// Categorize Friction
// --------------------------------------------------
function categorizeFriction({

  categoryName,

  overloadAreas,

  behavioralFriction,

  environmentalFriction,

  emotionalStrain,

  sustainabilityRisks

}) {

  // ----------------------------------------------
  // Overload
  // ----------------------------------------------
  if (
    categoryName === "overload"
  ) {

    overloadAreas.push(
      "capacity strain"
    );

    sustainabilityRisks.push(
      "insufficient recovery"
    );
  }


  // ----------------------------------------------
  // Misalignment
  // ----------------------------------------------
  if (
    categoryName === "misalignment"
  ) {

    behavioralFriction.push(
      "directional tension"
    );

    sustainabilityRisks.push(
      "value incongruence"
    );
  }


  // ----------------------------------------------
  // Boundary Erosion
  // ----------------------------------------------
  if (
    categoryName === "boundary_erosion"
  ) {

    behavioralFriction.push(
      "overextension"
    );

    emotionalStrain.push(
      "emotional carrying"
    );
  }


  // ----------------------------------------------
  // Identity Pressure
  // ----------------------------------------------
  if (
    categoryName === "identity_pressure"
  ) {

    emotionalStrain.push(
      "performance pressure"
    );

    sustainabilityRisks.push(
      "conditional self-worth"
    );
  }


  // ----------------------------------------------
  // Uncertainty
  // ----------------------------------------------
  if (
    categoryName === "uncertainty"
  ) {

    behavioralFriction.push(
      "internal conflict"
    );
  }


  // ----------------------------------------------
  // Emotional Fatigue
  // ----------------------------------------------
  if (
    categoryName === "emotional_fatigue"
  ) {

    emotionalStrain.push(
      "persistent depletion"
    );

    overloadAreas.push(
      "emotional exhaustion"
    );
  }
}


// --------------------------------------------------
// Reflective Summary Builder
// --------------------------------------------------
function buildReflectiveSummary({

  rankedThemes = [],

  overloadLevel = "moderate"

}) {

  // ----------------------------------------------
  // No Significant Friction
  // ----------------------------------------------
  if (
    rankedThemes.length === 0
  ) {

    return `
Some areas of strain or tension may still be emerging, though no dominant friction patterns were strongly detected yet.
`.trim();
  }


  // ----------------------------------------------
  // Construct reflective summary
  // ----------------------------------------------
  const primaryTheme =
    rankedThemes[0]

      ?.replaceAll("_", " ");


  return `
Current reflection patterns suggest possible tension around ${primaryTheme}.

This does not imply failure or dysfunction.

Instead, it may indicate areas where:
- recovery
- boundaries
- pacing
- alignment
- emotional support
- sustainable structure

could benefit from additional attention or reflection.

Current overload level appears ${overloadLevel}.
`.trim();
}
