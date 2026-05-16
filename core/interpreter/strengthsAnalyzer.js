// core/interpreter/strengthsAnalyzer.js

import strengthsWeights
  from "../../data/scoring/strengthsWeights.json"
  assert { type: "json" };


export async function analyzeStrengths({

  input,

  participantProfile = {}

}) {

  const text =
    input.toLowerCase();

  const detected = [];

  const scores = {};

  const matchedSignals = {};


  // ----------------------------------------------
  // Process Categories
  // ----------------------------------------------
  for (
    const [categoryName, category]
    of Object.entries(
      strengthsWeights.categories
    )
  ) {

    let categoryScore =
      category.baseWeight || 1;

    const categoryMatches = [];


    // ------------------------------------------
    // Process Signals
    // ------------------------------------------
    for (
      const signal
      of category.signals
    ) {

      let signalMatched = false;


      // ----------------------------------------
      // Check Example Matches
      // ----------------------------------------
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


      // ----------------------------------------
      // Multi-signal support
      // ----------------------------------------
      if (
        signalMatched
      ) {

        matchedSignals[
          signal.name
        ] = true;
      }
    }


    // ------------------------------------------
    // Threshold Filtering
    // ------------------------------------------
    if (
      categoryMatches.length >=
      (
        strengthsWeights
          .strength_constraints
          ?.minimum_signal_threshold
        || 1
      )
    ) {

      detected.push(categoryName);

      scores[categoryName] =
        categoryScore;
    }
  }


  // ----------------------------------------------
  // Ranked Output
  // ----------------------------------------------
  const rankedStrengths =
    Object.entries(scores)

      .sort(
        (a, b) => b[1] - a[1]
      )

      .map(([name]) => name);


  // ----------------------------------------------
  // Return Structured Result
  // ----------------------------------------------
  return {

    detected:
      rankedStrengths,

    scores,

    confidence:
      rankedStrengths.length >= 3
        ? "moderate"
        : "emerging"
  };
}
