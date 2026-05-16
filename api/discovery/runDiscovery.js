// api/discovery/runDiscovery.js
// TRUE AI — Discovery Orchestrator

import { STATES } from "../chat/router.js";

import {
  addToHistory,
  updateDiscoveryState,
  updateParticipantProfile
} from "../chat/sessionManager.js";

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
// Main Discovery Orchestrator
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

      discoveryState
    });


  // ----------------------------------------------
  // Conversational Reflection
  // ----------------------------------------------
  const response =
    await llm({

      prompt: reflectivePrompt,

      maxTokens: 250,

      model: "gpt-4o-mini"
    });


  // ----------------------------------------------
  // Lightweight Parallel Analysis
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
  // Upgrade Analysis
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
  // Determine LifePrint Readiness
  // ----------------------------------------------
  const shouldGenerateLifeprint =
    evaluateLifeprintReadiness({

      synthesis,

      participantProfile,

      discoveryState
    });


  // ----------------------------------------------
  // Deferred LifePrint Generation
  // ----------------------------------------------
  let lifeprint = null;


  if (shouldGenerateLifeprint) {

    // ------------------------------------------
    // Generate Sections In Parallel
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

  participantProfile,

  discoveryState

}) {

  // ----------------------------------------------
  // Require Upgrade Phase
  // ----------------------------------------------
  if (discoveryState !== STATES.UPGRADE) {
    return false;
  }


  // ----------------------------------------------
  // Require Meaningful Synthesis
  // ----------------------------------------------
  if (
    synthesis?.readinessLevel !== "ready"
  ) {
    return false;
  }


  // ----------------------------------------------
  // Require Sufficient Reflection
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

  discoveryState

}) {

  const basePrompt = `
You are TRUE AI.

You are a reflective intelligence system designed to help participants better understand themselves with clarity, emotional safety, and agency.

Do not diagnose.
Do not pressure.
Do not over-motivate.
Do not use exaggerated self-help language.

Respond calmly, thoughtfully, and reflectively.

Focus on helping the participant notice:
- patterns
- tensions
- values
- possibilities
- emotional themes
- internal contradictions

Keep responses conversational, grounded, and emotionally steady.
`;


  // TARGET
  if (discoveryState === STATES.TARGET) {

    return `
${basePrompt}

The participant is currently in the TARGET phase.

Help clarify:
- values
- fulfillment
- direction
- priorities
- desires
- meaningful goals

Participant Input:
"${input}"
`;
  }


  // UPGRADE
  if (discoveryState === STATES.UPGRADE) {

    return `
${basePrompt}

The participant is currently in the UPGRADE phase.

Help identify:
- sustainable next steps
- growth opportunities
- supportive adjustments
- strengths already present
- possible friction patterns

Avoid urgency and optimization framing.

Participant Input:
"${input}"
`;
  }


  // REFLECT
  return `
${basePrompt}

The participant is currently in the REFLECT phase.

Help explore:
- emotional patterns
- overwhelm
- friction
- contradictions
- recurring experiences
- alignment

Respond with curiosity and steadiness.

Participant Input:
"${input}"
`;
}
