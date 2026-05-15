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
  // Persist user message
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
  // Phase-specific reflection prompt
  // ----------------------------------------------
  const reflectivePrompt =
    buildReflectivePrompt({
      input,
      discoveryState
    });


  // ----------------------------------------------
  // Generate reflective conversational response
  // ----------------------------------------------
  const response = await llm({
    prompt: reflectivePrompt,
    maxTokens: 350
  });


  // ----------------------------------------------
  // Run analyzers
  // ----------------------------------------------
  const alignment =
    await analyzeAlignment({
      input,
      participantProfile,
      llm
    });

  const strengths =
    await analyzeStrengths({
      input,
      participantProfile,
      llm
    });

  const friction =
    await analyzeFriction({
      input,
      participantProfile,
      llm
    });

  const capacity =
    await analyzeCapacity({
      input,
      participantProfile,
      llm
    });

  const contradictions =
    await detectContradictions({
      input,
      participantProfile,
      llm
    });

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
  // Synthesize overall discovery state
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
  // Generate LifePrint sections
  // ----------------------------------------------
  const summary =
    await generateSummary({
      synthesis,
      llm
    });

  const strengthsSection =
    await generateStrengths({
      strengths,
      llm
    });

  const frictionSection =
    await generateFriction({
      friction,
      contradictions,
      llm
    });

  const upgradePath =
    await generateUpgradePath({
      upgrades,
      llm
    });

  const momentumSteps =
    await generateMomentumSteps({
      synthesis,
      upgrades,
      llm
    });


  // ----------------------------------------------
  // Assemble LifePrint
  // ----------------------------------------------
  const lifeprint =
    await narrativeAssembler({

      summary,

      strengths: strengthsSection,

      friction: frictionSection,

      upgrades: upgradePath,

      momentum: momentumSteps
    });


  // ----------------------------------------------
  // Update participant profile
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
  // Return structured output
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
Focus on helping the participant notice patterns, tensions, values, or possibilities.
`;


  // ----------------------------------------------
  // TARGET
  // ----------------------------------------------
  if (discoveryState === STATES.TARGET) {

    return `
${basePrompt}

The participant is currently in the TARGET phase.

Help them clarify:
- values
- desires
- direction
- fulfillment
- goals
- priorities

Encourage specificity and reflection without forcing certainty.

Participant Input:
"${input}"
`;
  }


  // ----------------------------------------------
  // UPGRADE
  // ----------------------------------------------
  if (discoveryState === STATES.UPGRADE) {

    return `
${basePrompt}

The participant is currently in the UPGRADE phase.

Help them identify:
- possible growth areas
- mindset shifts
- sustainable next steps
- strengths they may already possess
- patterns that may require attention

Avoid urgency or optimization language.

Participant Input:
"${input}"
`;
  }


  // ----------------------------------------------
  // REFLECT (default)
  // ----------------------------------------------
  return `
${basePrompt}

The participant is currently in the REFLECT phase.

Help them examine:
- emotional patterns
- friction
- overwhelm
- contradictions
- recurring experiences
- current life alignment

Respond with curiosity and emotional steadiness.

Participant Input:
"${input}"
`;
}
