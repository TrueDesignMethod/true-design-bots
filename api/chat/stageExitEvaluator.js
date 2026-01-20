/**
 * Stage Exit Evaluator
 * Determines whether a user may advance stages or elements
 * based on explicit, provable completion criteria
 */

import { TARGET } from "./target.js";

export function evaluateStageExit({
  stage,
  progressData = {},
  strict = true
}) {
  const criteria = TARGET.exitCriteria?.[stage];

  if (!criteria) {
    return {
      eligible: false,
      reason: `No exit criteria defined for stage "${stage}"`,
      missing: []
    };
  }

  const missing = [];

  for (const requirement of criteria.required) {
    const result = evaluateRequirement(requirement, progressData);

    if (!result.passed) {
      missing.push({
        id: requirement.id,
        description: requirement.description,
        reason: result.reason
      });
    }
  }

  return {
    eligible: missing.length === 0,
    stage,
    missing,
    signal: missing.length === 0
      ? "exit_approved"
      : strict
        ? "exit_blocked"
        : "exit_deferred"
  };
}

/**
 * Requirement-level evaluator
 * Each requirement defines its own proof condition
 */
function evaluateRequirement(requirement, progressData) {
  const { id, proof } = requirement;

  switch (proof.type) {
    case "presence":
      return {
        passed: Boolean(progressData[id]),
        reason: progressData[id]
          ? null
          : "Required data not present"
      };

    case "nonEmptyArray":
      return {
        passed: Array.isArray(progressData[id]) && progressData[id].length > 0,
        reason: "Expected at least one entry"
      };

    case "booleanTrue":
      return {
        passed: progressData[id] === true,
        reason: "Required confirmation not acknowledged"
      };

    case "minCount":
      return {
        passed: Array.isArray(progressData[id]) &&
          progressData[id].length >= proof.min,
        reason: `Requires at least ${proof.min} entries`
      };

    case "validator":
      return {
        passed: typeof proof.validate === "function"
          ? proof.validate(progressData)
          : false,
        reason: "Custom validator failed"
      };

    default:
      return {
        passed: false,
        reason: `Unknown proof type "${proof.type}"`
      };
  }
}
