// core/interpreter/alignmentAnalyzer.js
// TRUE AI — Symbolic Alignment Analyzer
//
// PURPOSE
// --------------------------------------------------
// Detect:
// - alignment between values + behavior
// - alignment between goals + capacity
// - internal coherence
// - tension patterns
// - sustainable congruence
//
// WITHOUT LLM DEPENDENCE.
//
// This analyzer uses:
// - symbolic scoring
// - contextual pattern detection
// - relational interpretation
// - emotionally safe heuristics
//
// Alignment is NOT:
// - moral worth
// - identity definition
// - optimization status
//
// It is:
// - directional coherence
// - sustainable congruence
// - relational harmony
// --------------------------------------------------

import alignmentWeights
  from "../../data/scoring/alignmentWeights.json"
  assert { type: "json" };


// --------------------------------------------------
// Main Alignment Analysis
// --------------------------------------------------
export async function analyzeAlignment({

  input = "",

  participantProfile = {}

}) {

  const text =
    input.toLowerCase();


  // ----------------------------------------------
  // Extract participant context
  // ----------------------------------------------
  const {

    values = [],

    goals = [],

    frictionThemes = [],

    strengths = []

  } = participantProfile;


  // ----------------------------------------------
  // State Containers
  // ----------------------------------------------
  const scores = {};

  const alignedAreas = [];

  const misalignedAreas = [];

  const tensions = [];

  const supportivePatterns = [];

  const matchedSignals = {};


  // ----------------------------------------------
  // Process Alignment Categories
  // ----------------------------------------------
  for (

    const [

      categoryName,

      category

    ] of Object.entries(
      alignmentWeights.categories
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
      if (
        signalMatched
      ) {

        matchedSignals[
          signal.name
        ] = true;
      }
    }


    // --------------------------------------------
    // Threshold Filtering
    // --------------------------------------------
    const threshold =
      alignmentWeights
        ?.alignment_constraints
        ?.minimum_signal_threshold
      || 1;


    if (
      categoryMatches.length >= threshold
    ) {

      scores[categoryName] =
        categoryScore;


      // ------------------------------------------
      // Categorize Alignment Themes
      // ------------------------------------------
      categorizeAlignment({

        categoryName,

        alignedAreas,

        misalignedAreas,

        tensions,

        supportivePatterns
      });
    }
  }


  // ----------------------------------------------
  // Integrate Known Friction
  // ----------------------------------------------
  if (
    frictionThemes.length >= 3
  ) {

    tensions.push(
      "multiple active friction patterns"
    );
  }


  // ----------------------------------------------
  // Integrate Known Strengths
  // ----------------------------------------------
  if (
    strengths.length >= 3
  ) {

    supportivePatterns.push(
      "existing internal resources"
    );
  }


  // ----------------------------------------------
  // Determine Overall Alignment
  // ----------------------------------------------
  const totalScore =
    Object.values(scores)

      .reduce(
        (sum, score) => sum + score,
        0
      );


  let overallAlignment =
    "mixed";


  if (totalScore >= 14) {

    overallAlignment =
      "strong";

  } else if (totalScore >= 9) {

    overallAlignment =
      "emerging";

  } else if (totalScore <= 4) {

    overallAlignment =
      "low";
  }


  // ----------------------------------------------
  // Build Reflective Summary
  // ----------------------------------------------
  const reflectiveSummary =
    buildReflectiveSummary({

      overallAlignment,

      alignedAreas,

      tensions
    });


  // ----------------------------------------------
  // Return Structured Alignment
  // ----------------------------------------------
  return {

    overallAlignment,

    alignedAreas:
      unique(alignedAreas),

    misalignedAreas:
      unique(misalignedAreas),

    tensions:
      unique(tensions),

    supportivePatterns:
      unique(supportivePatterns),

    reflectiveSummary,

    scores
  };
}


// --------------------------------------------------
// Categorize Alignment
// --------------------------------------------------
function categorizeAlignment({

  categoryName,

  alignedAreas,

  misalignedAreas,

  tensions,

  supportivePatterns

}) {

  // ----------------------------------------------
  // Value Congruence
  // ----------------------------------------------
  if (
    categoryName === "value_congruence"
  ) {

    alignedAreas.push(
      "values and direction"
    );

    supportivePatterns.push(
      "internal coherence"
    );
  }


  // ----------------------------------------------
  // Sustainable Movement
  // ----------------------------------------------
  if (
    categoryName === "sustainable_movement"
  ) {

    alignedAreas.push(
      "capacity-aware pacing"
    );

    supportivePatterns.push(
      "sustainable engagement"
    );
  }


  // ----------------------------------------------
  // Relational Alignment
  // ----------------------------------------------
  if (
    categoryName === "relational_alignment"
  ) {

    alignedAreas.push(
      "relational awareness"
    );
  }


  // ----------------------------------------------
  // Internal Conflict
  // ----------------------------------------------
  if (
    categoryName === "internal_conflict"
  ) {

    tensions.push(
      "competing internal needs"
    );

    misalignedAreas.push(
      "directional coherence"
    );
  }


  // ----------------------------------------------
  // Overextension
  // ----------------------------------------------
  if (
    categoryName === "overextension"
  ) {

    tensions.push(
      "capacity strain"
    );

    misalignedAreas.push(
      "sustainability"
    );
  }


  // ----------------------------------------------
  // Identity Pressure
  // ----------------------------------------------
  if (
    categoryName === "identity_pressure"
  ) {

    tensions.push(
      "conditional self-pressure"
    );

    misalignedAreas.push(
      "self-worth stability"
    );
  }
}


// --------------------------------------------------
// Reflective Summary Builder
// --------------------------------------------------
function buildReflectiveSummary({

  overallAlignment,

  alignedAreas = [],

  tensions = []

}) {

  // ----------------------------------------------
  // Strong Alignment
  // ----------------------------------------------
  if (
    overallAlignment === "strong"
  ) {

    return `
Current reflection patterns suggest a relatively strong degree of internal coherence between values, direction, and sustainable movement.

This does not imply perfection or certainty, but it may indicate that several areas of life are currently moving in a direction that feels meaningful or supportive.
`.trim();
  }


  // ----------------------------------------------
  // Emerging Alignment
  // ----------------------------------------------
  if (
    overallAlignment === "emerging"
  ) {

    return `
Several reflective patterns suggest emerging alignment between personal values, emotional needs, and current direction.

Some tension may still exist, though there are also indications of meaningful movement toward greater coherence and sustainability.
`.trim();
  }


  // ----------------------------------------------
  // Low Alignment
  // ----------------------------------------------
  if (
    overallAlignment === "low"
  ) {

    return `
Current reflection patterns suggest possible strain between internal needs, responsibilities, direction, or emotional capacity.

This does not imply failure or dysfunction. Instead, it may indicate that additional reflection, recovery, or recalibration could be supportive.
`.trim();
  }


  // ----------------------------------------------
  // Mixed Alignment
  // ----------------------------------------------
  return `
Current reflection patterns suggest a mixture of alignment and tension.

Some areas may feel supportive or meaningful, while others may involve strain, uncertainty, or competing demands.

This reflects normal human complexity rather than personal failure.
`.trim();
}


// --------------------------------------------------
// Utility — Unique Values
// --------------------------------------------------
function unique(arr = []) {

  return [...new Set(arr)];
}
