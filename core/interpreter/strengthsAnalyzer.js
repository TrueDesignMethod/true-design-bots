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


  // ----------------------------------------------
  // Score strength categories
  // ----------------------------------------------
  for (
    const [strength, config]
    of Object.entries(strengthsWeights)
  ) {

    let score = 0;


    for (
      const keyword
      of config.keywords
    ) {

      if (
        text.includes(
          keyword.toLowerCase()
        )
      ) {

        score += (
          config.weight || 1
        );
      }
    }


    if (score > 0) {

      scores[strength] = score;

      detected.push(strength);
    }
  }


  // ----------------------------------------------
  // Normalize
  // ----------------------------------------------
  const ranked =
    Object.entries(scores)

      .sort((a, b) => b[1] - a[1])

      .map(([name]) => name);


  // ----------------------------------------------
  // Return structured result
  // ----------------------------------------------
  return {

    detected:
      ranked.slice(0, 5),

    scores,

    confidence:
      ranked.length >= 3
        ? "moderate"
        : "emerging"
  };
}
