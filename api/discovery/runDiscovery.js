// api/discovery/runDiscovery.js
// TRUE AI — Optimized Discovery Orchestrator
//
// ARCHITECTURE GOALS
// --------------------------------------------------
// FAST conversational interaction
// lightweight local analysis
// deferred LifePrint generation
// minimal LLM usage
//
// LLM is ONLY used for:
// - conversational reflection
// - optional final LifePrint generation
//
// All analyzers should ideally become:
// - local scoring systems
// - heuristic interpreters
// - weighted pattern detectors
// --------------------------------------------------

import { STATES }
  from "../chat/router.js";

import {

  addToHistory,

  updateDiscoveryState,

  updateParticipantProfile

} from "../chat/sessionManager.js";


// --------------------------------------------------
// Lightweight Local Analyzers
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
// Deferred LifePrint Generation
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
  // Persist User Message
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


  // ----------------------------------------------
  // Build Reflective Prompt
  // ----------------------------------------------
  const reflectivePrompt =
    buildReflectivePrompt({

      input,

      discoveryState,

      participantProfile
    });


  // ----------------------------------------------
  // SINGLE Conversational LLM Call
  // ----------------------------------------------
  const response =
    await llm({

      model: "gpt-4o-mini",

      prompt: reflectivePrompt,

      maxTokens: 220
    });


  // ----------------------------------------------
  // Lightweight Local Analysis
  // ----------------------------------------------
  // These analyzers should NOT
  // make additional LLM calls.
  // They should rely on:
  // - heuristics
  // - scoring
  // - local interpretation
  // ----------------------------------------------
  const [

  alignment,

  strengths,

  friction,

  capacity,

  contradictions

] = await Promise.all([

  analyzeAlignment({

    input,

    participantProfile,

    llm
  }),

  analyzeStrengths({

    input,

    participantProfile,

    llm
  }),

  analyzeFriction({

    input,

    participantProfile,

    llm
  }),

  analyzeCapacity({

    input,

    participantProfile,

    llm
  }),

  detectContradictions({

    input,

    participantProfile,

    llm
  })
]);


  // ----------------------------------------------
  // Upgrade Areas
  // ----------------------------------------------
  const upgrades =
  await analyzeUpgradeAreas({

    input,

    participantProfile,

    strengths,

    friction,

    contradictions,

    llm
  });


  // ----------------------------------------------
  // Discovery Synthesis
  // ----------------------------------------------
  // This should ALSO become
  // mostly local logic over time.
  // ----------------------------------------------
  const synthesis =
    await synthesizeDiscovery({

      alignment,

      strengths,

      friction,

      capacity,

      contradictions,

      upgrades,

      llm
    });


  // ----------------------------------------------
  // Determine Readiness
  // ----------------------------------------------
  const shouldGenerateLifeprint =
    evaluateLifeprintReadiness({

      synthesis,

      discoveryState,

      participantProfile
    });


  // ----------------------------------------------
  // Deferred LifePrint
  // ----------------------------------------------
  let lifeprint = null;


  // ----------------------------------------------
  // Generate ONLY at milestone readiness
  // ----------------------------------------------
  if (shouldGenerateLifeprint) {

    // ------------------------------------------
    // Parallel Narrative Generation
    // ------------------------------------------
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


    // ------------------------------------------
    // Assemble Narrative
    // ------------------------------------------
    lifeprint =
      await narrativeAssembler({

        summary,

        strengths: strengthsSection,

        friction: frictionSection,

        upgrades: upgradePath,

        momentum: momentumSteps
      });
  }


  // ----------------------------------------------
  // Update Participant Profile
  // ----------------------------------------------
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

    lastDiscoveryState:
      discoveryState
  };


  // ----------------------------------------------
  // Persist Assistant Response
  // ----------------------------------------------
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


  // ----------------------------------------------
  // Return Structured Result
  // ----------------------------------------------
  return {

    response,

    discoveryState,

    lifeprint,

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

  // ----------------------------------------------
  // Require Upgrade Phase
  // ----------------------------------------------
  if (
    discoveryState !== STATES.UPGRADE
  ) {

    return false;
  }


  // ----------------------------------------------
  // Require Readiness
  // ----------------------------------------------
  if (
    synthesis?.readinessLevel !== "ready"
  ) {

    return false;
  }


  // ----------------------------------------------
  // Require Reflection Depth
  // ----------------------------------------------
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

  participantProfile

}) {

  const basePrompt = `
You are TRUE AI.

You are a calm reflective intelligence system.

Your purpose is to help participants:
- better understand themselves
- notice patterns
- identify tension
- clarify values
- explore sustainable movement

Avoid:
- diagnosis
- coaching hype
- forced positivity
- urgency
- optimization language
- exaggerated self-help tone

Respond conversationally.
Respond thoughtfully.
Respond clearly.
Keep responses emotionally grounded.
`;


  // ----------------------------------------------
  // TARGET
  // ----------------------------------------------
  if (
    discoveryState === STATES.TARGET
  ) {

    return `
${basePrompt}

The participant is currently in TARGET exploration.

Help them reflect on:
- values
- desires
- fulfillment
- direction
- priorities
- meaningful goals

Participant Input:
"${input}"
`;
  }


  // ----------------------------------------------
  // UPGRADE
  // ----------------------------------------------
  if (
    discoveryState === STATES.UPGRADE
  ) {

    return `
${basePrompt}

The participant is currently exploring sustainable growth.

Help them reflect on:
- small adjustments
- sustainable movement
- existing strengths
- emotional readiness
- realistic next steps

Avoid optimization framing.

Participant Input:
"${input}"
`;
  }


  // ----------------------------------------------
  // REFLECT
  // ----------------------------------------------
  return `
${basePrompt}

The participant is currently in reflective exploration.

Help them examine:
- emotional patterns
- recurring friction
- contradictions
- overwhelm
- alignment
- emotional needs

Respond with steadiness and curiosity.

Participant Input:
"${input}"
`;
}
