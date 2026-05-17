// api/discovery/runDiscovery.js
// TRUE AI — Symbolic Discovery Orchestrator

import { STATES }
  from "../chat/router.js";

import {

  addToHistory,

  updateDiscoveryState,

  updateParticipantProfile

} from "../chat/sessionManager.js";


// --------------------------------------------------
// Symbolic Interpreters
// --------------------------------------------------

import { analyzeAlignment }
  from "../../core/interpreter/alignmentAnalyzer.js";

import { analyzeStrengths }
  from "../../core/interpreter/strengthsAnalyzer.js";

import { analyzeFriction }
  from "../../core/interpreter/frictionAnalyzer.js";

import { analyzeCapacity }
  from "../../core/interpreter/capacityAnalyzer.js";

import { detectContradictions }
  from "../../core/interpreter/contradictionDetector.js";

import { analyzeUpgradeAreas }
  from "../../core/interpreter/upgradeAnalyzer.js";

import { synthesizeDiscovery }
  from "../../core/interpreter/synthesisEngine.js";


// --------------------------------------------------
// Narrative Generation
// --------------------------------------------------

import { generateSummary }
  from "../../core/lifeprint/generateSummary.js";

import { generateStrengths }
  from "../../core/lifeprint/generateStrengths.js";

import { generateFriction }
  from "../../core/lifeprint/generateFriction.js";

import { generateUpgradePath }
  from "../../core/lifeprint/generateUpgradePath.js";

import { generateMomentumSteps }
  from "../../core/lifeprint/generateMomentumSteps.js";

import { narrativeAssembler }
  from "../../core/lifeprint/narrativeAssembler.js";


// --------------------------------------------------
// Main Discovery Runner
// --------------------------------------------------
export async function runDiscovery({

  input,

  discoveryState,

  participantProfile = {},

  sessionId,

  llm

}) {

  // ----------------------------------------------
  // Persist User Input
  // ----------------------------------------------
  if (sessionId) {

    await addToHistory({

      sessionId,

      role: "user",

      content: input
    });

    await updateDiscoveryState(

      sessionId,

      discoveryState
    );
  }


  // ------------------------------------------------
  // SYMBOLIC ANALYSIS
  // ------------------------------------------------
  // NO LLM CALLS HERE
  // ------------------------------------------------

  const [

    alignment,

    strengths,

    friction,

    capacity,

    contradictions

  ] = await Promise.all([

    analyzeAlignment({

      input,

      participantProfile
    }),

    analyzeStrengths({

      input,

      participantProfile
    }),

    analyzeFriction({

      input,

      participantProfile
    }),

    analyzeCapacity({

      input,

      participantProfile
    }),

    detectContradictions({

      input,

      participantProfile
    })
  ]);


  // ------------------------------------------------
  // Upgrade Inference
  // ------------------------------------------------

  const upgrades =
    await analyzeUpgradeAreas({

      input,

      participantProfile,

      strengths,

      friction,

      contradictions
    });


  // ------------------------------------------------
  // Symbolic Synthesis
  // ------------------------------------------------

  const synthesis =
    await synthesizeDiscovery({

      alignment,

      strengths,

      friction,

      capacity,

      contradictions,

      upgrades
    });


  // ------------------------------------------------
  // Build Reflective Prompt
  // ------------------------------------------------
  // IMPORTANT:
  // LLM is now ONLY:
  // - conversational
  // - expressive
  // - reflective
  //
  // NOT interpretive.
  // ------------------------------------------------

  const reflectivePrompt =
    buildReflectivePrompt({

      input,

      discoveryState,

      synthesis
    });


  // ------------------------------------------------
  // Conversational Reflection
  // ------------------------------------------------

  const response =
    await llm({

      model: "gpt-4o-mini",

      prompt: reflectivePrompt,

      maxTokens: 220
    });


  // ------------------------------------------------
  // Determine LifePrint Readiness
  // ------------------------------------------------

  const shouldGenerateLifeprint =
    evaluateLifeprintReadiness({

      synthesis,

      discoveryState,

      participantProfile
    });


  // ------------------------------------------------
  // Deferred Narrative Generation
  // ------------------------------------------------

  let lifeprint = null;


  if (shouldGenerateLifeprint) {

    const [

      summary,

      strengthsSection,

      frictionSection,

      upgradePath,

      momentumSteps

    ] = await Promise.all([

      generateSummary({

        synthesis,

        llm
      }),

      generateStrengths({

        strengths,

        llm
      }),

      generateFriction({

        friction,

        contradictions,

        llm
      }),

      generateUpgradePath({

        upgrades,

        llm
      }),

      generateMomentumSteps({

        synthesis,

        upgrades,

        llm
      })
    ]);


    lifeprint =
      await narrativeAssembler({

        summary,

        strengths:
          strengthsSection,

        friction:
          frictionSection,

        upgrades:
          upgradePath,

        momentum:
          momentumSteps
      });
  }


  // ------------------------------------------------
  // Update Participant State
  // ------------------------------------------------

  const updatedProfile = {

    ...participantProfile,

    strengths:
      strengths?.detected || [],

    frictionThemes:
      friction?.themes || [],

    contradictionThemes:
      contradictions?.themes || [],

    readinessLevel:
      synthesis?.readinessLevel || "emerging",

    synthesisState:
      synthesis,

    lastDiscoveryState:
      discoveryState
  };


  // ------------------------------------------------
  // Persist Assistant Response
  // ------------------------------------------------

  if (sessionId) {

    await updateParticipantProfile(

      sessionId,

      updatedProfile
    );

    await addToHistory({

      sessionId,

      role: "assistant",

      content: response
    });
  }


  // ------------------------------------------------
  // Return Structured Output
  // ------------------------------------------------

  return {

    response,

    discoveryState,

    lifeprint,

    synthesis,

    strengthsDetected:
      strengths?.detected || [],

    frictionDetected:
      friction?.themes || [],

    readinessLevel:
      synthesis?.readinessLevel || "emerging"
  };
}


// --------------------------------------------------
// LifePrint Readiness Evaluation
// --------------------------------------------------
function evaluateLifeprintReadiness({

  synthesis,

  discoveryState,

  participantProfile

}) {

  if (
    discoveryState !== STATES.UPGRADE
  ) {

    return false;
  }


  if (
    synthesis?.readinessLevel !== "ready"
  ) {

    return false;
  }


  const strengths =
    participantProfile?.strengths || [];


  if (strengths.length < 3) {

    return false;
  }


  return true;
}


// --------------------------------------------------
// Reflective Prompt Builder
// --------------------------------------------------
function buildReflectivePrompt({

  input,

  discoveryState,

  synthesis

}) {

  return `
You are TRUE AI.

You are NOT:
- diagnosing
- coaching
- fixing
- transforming

You are calmly reflecting
the participant's symbolic state.

Use:
- grounded language
- emotional steadiness
- thoughtful reflection
- conversational clarity

Avoid:
- hype
- urgency
- optimization language
- exaggerated positivity
- self-help rhetoric

Current Symbolic State:
${JSON.stringify(synthesis, null, 2)}

Participant Input:
"${input}"

Respond naturally in 1-3 short paragraphs.
`;
}
