// core/interpreter/contradictionDetector.js
// TRUE AI — Relational Symbolic Tension Detector
//
// PURPOSE
// --------------------------------------------------
// Detect:
// - competing needs
// - value-behavior tension
// - goal-capacity mismatch
// - internal conflict
// - identity-environment strain
// - unsustainable expectations
//
// WITHOUT LLM DEPENDENCE.
//
// This detector is NOT:
// - psychoanalysis
// - diagnosis
// - moral judgment
// - hypocrisy detection
//
// Contradictions are treated as:
// - human complexity
// - adaptive tension
// - competing realities
// - relational strain
//
// The goal is to surface:
// symbolic tension patterns
// gently and transparently.
// --------------------------------------------------


// --------------------------------------------------
// Main Contradiction Detection
// --------------------------------------------------
export async function detectContradictions({

  input = "",

  participantProfile = {}

}) {

  const text =
    input.toLowerCase();


  // ----------------------------------------------
  // Extract Participant Context
  // ----------------------------------------------
  const {

    values = [],

    goals = [],

    strengths = [],

    frictionThemes = []

  } = participantProfile;


  // ----------------------------------------------
  // State Containers
  // ----------------------------------------------
  const themes = [];

  const valueBehaviorTension = [];

  const goalCapacityMismatch = [];

  const identityEnvironmentConflict = [];

  const competingPriorities = [];

  const hiddenPressures = [];

  const unresolvedTensions = [];

  const detectedContradictions = [];


  // ------------------------------------------------
  // CONTRADICTION RULE SETS
  // ------------------------------------------------

  const contradictionRules = [

    // --------------------------------------------
    // Peace vs Overwork
    // --------------------------------------------
    {
      name:
        "peace_vs_overwork",

      desires: [

        "peace",

        "rest",

        "balance",

        "slow down"
      ],

      behaviors: [

        "always working",

        "never stop",

        "constantly busy",

        "too much",

        "can't keep up"
      ],

      tension:
        "desire for peace conflicting with chronic overextension",

      category:
        "goalCapacityMismatch"
    },


    // --------------------------------------------
    // Boundaries vs Overcommitment
    // --------------------------------------------
    {
      name:
        "boundaries_vs_overcommitment",

      desires: [

        "need boundaries",

        "need space",

        "need rest"
      ],

      behaviors: [

        "say yes too often",

        "overcommit",

        "carry too much",

        "take on everything"
      ],

      tension:
        "boundary needs conflicting with overextension patterns",

      category:
        "valueBehaviorTension"
    },


    // --------------------------------------------
    // Authenticity vs External Expectations
    // --------------------------------------------
    {
      name:
        "authenticity_vs_expectation",

      desires: [

        "be myself",

        "feel authentic",

        "want meaning"
      ],

      behaviors: [

        "what people expect",

        "supposed to",

        "family expectations",

        "need to prove myself"
      ],

      tension:
        "internal authenticity conflicting with external pressure",

      category:
        "identityEnvironmentConflict"
    },


    // --------------------------------------------
    // Recovery vs Performance Pressure
    // --------------------------------------------
    {
      name:
        "recovery_vs_performance",

      desires: [

        "need recovery",

        "need rest",

        "emotionally exhausted"
      ],

      behaviors: [

        "can't slow down",

        "always performing",

        "people depend on me",

        "can't fail"
      ],

      tension:
        "recovery needs conflicting with performance pressure",

      category:
        "goalCapacityMismatch"
    },


    // --------------------------------------------
    // Direction vs Fear
    // --------------------------------------------
    {
      name:
        "direction_vs_fear",

      desires: [

        "want to move forward",

        "want change",

        "want growth"
      ],

      behaviors: [

        "stuck",

        "conflicted",

        "uncertain",

        "torn between"
      ],

      tension:
        "desire for movement conflicting with uncertainty or fear",

      category:
        "competingPriorities"
    }
  ];


  // ------------------------------------------------
  // Evaluate Rules
  // ------------------------------------------------
  for (
    const rule
    of contradictionRules
  ) {

    const desireMatched =
      containsAny(
        text,
        rule.desires
      );

    const behaviorMatched =
      containsAny(
        text,
        rule.behaviors
      );


    // --------------------------------------------
    // Contradiction Detected
    // --------------------------------------------
    if (
      desireMatched &&
      behaviorMatched
    ) {

      detectedContradictions.push(
        rule.name
      );

      themes.push(
        rule.name.replaceAll(
          "_",
          " "
        )
      );

      unresolvedTensions.push(
        rule.tension
      );


      // ------------------------------------------
      // Route Categories
      // ------------------------------------------
      routeContradiction({

        category:
          rule.category,

        tension:
          rule.tension,

        valueBehaviorTension,

        goalCapacityMismatch,

        identityEnvironmentConflict,

        competingPriorities
      });
    }
  }


  // ----------------------------------------------
  // Friction Integration
  // ----------------------------------------------
  if (
    frictionThemes.length >= 3
  ) {

    hiddenPressures.push(
      "multiple simultaneous pressures"
    );
  }


  // ----------------------------------------------
  // Strength-Based Mitigation
  // ----------------------------------------------
  if (
    strengths.length >= 3
  ) {

    hiddenPressures.push(
      "existing reflective capacity present"
    );
  }


  // ----------------------------------------------
  // Build Reflective Summary
  // ----------------------------------------------
  const reflectiveSummary =
    buildReflectiveSummary({

      detectedContradictions,

      unresolvedTensions
    });


  // ----------------------------------------------
  // Return Structured Contradictions
  // ----------------------------------------------
  return {

    themes:
      unique(themes),

    valueBehaviorTension:
      unique(valueBehaviorTension),

    goalCapacityMismatch:
      unique(goalCapacityMismatch),

    identityEnvironmentConflict:
      unique(identityEnvironmentConflict),

    competingPriorities:
      unique(competingPriorities),

    hiddenPressures:
      unique(hiddenPressures),

    unresolvedTensions:
      unique(unresolvedTensions),

    reflectiveSummary
  };
}


// --------------------------------------------------
// Route Contradictions
// --------------------------------------------------
function routeContradiction({

  category,

  tension,

  valueBehaviorTension,

  goalCapacityMismatch,

  identityEnvironmentConflict,

  competingPriorities

}) {

  // ----------------------------------------------
  // Value vs Behavior
  // ----------------------------------------------
  if (
    category === "valueBehaviorTension"
  ) {

    valueBehaviorTension.push(
      tension
    );
  }


  // ----------------------------------------------
  // Goal vs Capacity
  // ----------------------------------------------
  if (
    category === "goalCapacityMismatch"
  ) {

    goalCapacityMismatch.push(
      tension
    );
  }


  // ----------------------------------------------
  // Identity vs Environment
  // ----------------------------------------------
  if (
    category === "identityEnvironmentConflict"
  ) {

    identityEnvironmentConflict.push(
      tension
    );
  }


  // ----------------------------------------------
  // Competing Priorities
  // ----------------------------------------------
  if (
    category === "competingPriorities"
  ) {

    competingPriorities.push(
      tension
    );
  }
}


// --------------------------------------------------
// Reflective Summary Builder
// --------------------------------------------------
function buildReflectiveSummary({

  detectedContradictions = [],

  unresolvedTensions = []

}) {

  // ----------------------------------------------
  // No Significant Tension
  // ----------------------------------------------
  if (
    detectedContradictions.length === 0
  ) {

    return `
Some competing needs or internal tensions may still be emerging, though no major contradiction patterns were strongly detected yet.
`.trim();
  }


  // ----------------------------------------------
  // Construct Summary
  // ----------------------------------------------
  return `
Current reflection patterns suggest the presence of competing needs, pressures, or directional tensions.

This does not imply hypocrisy or failure.

Human beings frequently hold:
- conflicting responsibilities
- competing emotional needs
- survival adaptations
- overlapping priorities

These tensions may simply indicate areas where additional clarity, recovery, boundaries, or sustainable restructuring could be supportive.
`.trim();
}


// --------------------------------------------------
// Utility — Contains Any
// --------------------------------------------------
function containsAny(

  text = "",

  phrases = []

) {

  return phrases.some(

    phrase =>
      text.includes(
        phrase.toLowerCase()
      )
  );
}


// --------------------------------------------------
// Utility — Unique Values
// --------------------------------------------------
function unique(arr = []) {

  return [...new Set(arr)];
}
