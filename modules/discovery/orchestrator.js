// modules/discovery/orchestrator.js
// TRUE AI — Discovery Orchestrator

// --------------------------------------------------
// DISCOVERY ORCHESTRATOR
// --------------------------------------------------
// Purpose:
// Coordinate movement through the
// Discovery experience.
//
// The orchestrator manages:
//
// - TARGET
// - REFLECT
// - UPGRADE
//
// It determines:
// - current module
// - transition readiness
// - next recommended state
// - reflective progression
//
// This layer is intentionally:
// - lightweight
// - state-oriented
// - non-interpretive
//
// It should NOT:
// - generate psychological insight
// - perform synthesis
// - analyze participants
//
// Its role is ONLY:
// flow coordination.
// --------------------------------------------------


import {

  evaluateTargetCompletion,
  getNextTargetStep

} from "./target.js";


import {

  evaluateReflectCompletion,
  getNextReflectStep

} from "./reflect.js";


import {

  evaluateUpgradeCompletion,
  getNextUpgradeStep

} from "./upgrade.js";


// --------------------------------------------------
// Discovery States
// --------------------------------------------------
export const DISCOVERY_STATES = {

  TARGET:
    "TARGET",

  REFLECT:
    "REFLECT",

  UPGRADE:
    "UPGRADE",

  COMPLETE:
    "COMPLETE"
};


// --------------------------------------------------
// Resolve Current Discovery State
// --------------------------------------------------
export function resolveDiscoveryState({

  participantProfile = {}

}) {

  const currentState =
    participantProfile
      ?.currentDiscoveryState ||

    DISCOVERY_STATES.TARGET;


  switch (currentState) {

    case DISCOVERY_STATES.TARGET:

      return evaluateTargetState({
        participantProfile
      });


    case DISCOVERY_STATES.REFLECT:

      return evaluateReflectState({
        participantProfile
      });


    case DISCOVERY_STATES.UPGRADE:

      return evaluateUpgradeState({
        participantProfile
      });


    default:

      return {

        currentState:
          DISCOVERY_STATES.TARGET,

        nextState:
          DISCOVERY_STATES.TARGET,

        readinessLevel:
          "emerging",

        completed:
          false
      };
  }
}


// --------------------------------------------------
// TARGET State Evaluation
// --------------------------------------------------
function evaluateTargetState({

  participantProfile = {}

}) {

  const completion =
    evaluateTargetCompletion({
      participantProfile
    });


  const transition =
    getNextTargetStep({
      completion
    });


  return {

    currentState:
      DISCOVERY_STATES.TARGET,

    nextState:
      transition.nextState,

    readinessLevel:
      completion.readinessLevel,

    completed:
      completion.completed,

    missingAreas:
      completion.missingAreas,

    recommendation:
      transition.recommendation
  };
}


// --------------------------------------------------
// REFLECT State Evaluation
// --------------------------------------------------
function evaluateReflectState({

  participantProfile = {}

}) {

  const completion =
    evaluateReflectCompletion({
      participantProfile
    });


  const transition =
    getNextReflectStep({
      completion
    });


  return {

    currentState:
      DISCOVERY_STATES.REFLECT,

    nextState:
      transition.nextState,

    readinessLevel:
      completion.readinessLevel,

    completed:
      completion.completed,

    missingAreas:
      completion.missingAreas,

    recommendation:
      transition.recommendation
  };
}


// --------------------------------------------------
// UPGRADE State Evaluation
// --------------------------------------------------
function evaluateUpgradeState({

  participantProfile = {}

}) {

  const completion =
    evaluateUpgradeCompletion({
      participantProfile
    });


  const transition =
    getNextUpgradeStep({
      completion
    });


  return {

    currentState:
      DISCOVERY_STATES.UPGRADE,

    nextState:
      transition.nextState,

    readinessLevel:
      completion.readinessLevel,

    completed:
      completion.completed,

    missingAreas:
      completion.missingAreas,

    recommendation:
      transition.recommendation
  };
}


// --------------------------------------------------
// Advance Discovery State
// --------------------------------------------------
export function advanceDiscoveryState({

  participantProfile = {},

  orchestration = {}

}) {

  return {

    ...participantProfile,

    lastDiscoveryState:
      orchestration.currentState,

    currentDiscoveryState:
      orchestration.nextState,

    readinessLevel:
      orchestration.readinessLevel
  };
}


// --------------------------------------------------
// Check Discovery Completion
// --------------------------------------------------
export function isDiscoveryComplete({

  orchestration = {}

}) {

  return (
    orchestration.nextState ===
    DISCOVERY_STATES.COMPLETE
  );
}
