// core/governance/validateDiscovery.js
// TRUE AI — Discovery Validation

import { DISCOVERY_STATES }
  from "./resolveDiscoveryState.js";


// --------------------------------------------------
// Validate Discovery Input
// --------------------------------------------------
export function validateDiscovery({

  input = "",

  discoveryState,

  participantProfile = {}

}) {

  const errors = [];

  const warnings = [];


  // ----------------------------------------------
  // Validate input presence
  // ----------------------------------------------
  if (
    !input ||
    typeof input !== "string" ||
    input.trim().length === 0
  ) {

    errors.push(
      "Participant input is required."
    );
  }


  // ----------------------------------------------
  // Validate Discovery state
  // ----------------------------------------------
  const validStates =
    Object.values(DISCOVERY_STATES);

  if (
    !validStates.includes(discoveryState)
  ) {

    errors.push(
      "Invalid Discovery state."
    );
  }


  // ----------------------------------------------
  // Validate input length
  // ----------------------------------------------
  if (input.length > 5000) {

    warnings.push(
      "Input exceeds recommended reflective length."
    );
  }


  // ----------------------------------------------
  // Detect escalation-sensitive language
  // ----------------------------------------------
  const escalationSignals = [
    "i want to disappear",
    "i can't do this anymore",
    "i want to hurt myself",
    "i want to die",
    "everyone would be better without me"
  ];

  const normalizedInput =
    input.toLowerCase();

  const requiresEscalation =
    escalationSignals.some((signal) =>
      normalizedInput.includes(signal)
    );


  // ----------------------------------------------
  // Detect emotional overload intensity
  // ----------------------------------------------
  const overloadSignals = [
    "completely exhausted",
    "burned out",
    "can't function",
    "overwhelmed all the time",
    "falling apart"
  ];

  const overloadDetected =
    overloadSignals.some((signal) =>
      normalizedInput.includes(signal)
    );


  // ----------------------------------------------
  // Detect excessive dependency language
  // ----------------------------------------------
  const dependencySignals = [
    "tell me who i am",
    "make my decisions",
    "fix my life",
    "you know me better than i do"
  ];

  const dependencyDetected =
    dependencySignals.some((signal) =>
      normalizedInput.includes(signal)
    );


  // ----------------------------------------------
  // Dependency warning
  // ----------------------------------------------
  if (dependencyDetected) {

    warnings.push(
      "Participant may be seeking excessive external authority."
    );
  }


  // ----------------------------------------------
  // Build validation response
  // ----------------------------------------------
  return {

    valid: errors.length === 0,

    errors,

    warnings,

    flags: {

      requiresEscalation,

      overloadDetected,

      dependencyDetected
    }
  };
}
