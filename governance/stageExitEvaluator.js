// core/governance/stageExitEvaluator.js
// TRUE V3 — Stage Exit Evaluator (ES Module)
// Evaluates exit readiness strictly against TargetCriteria

import { TargetCriteria } from "./target.js";

/**
 * Validates a single criterion against provided evidence
 */
function evaluateCriterion(criterion, evidence) {
  // Use 'id' instead of 'key' to match your TargetCriteria structure
  const value = evidence[criterion.id];

  switch (criterion.proof.type) {
    case "booleanTrue":
      return value === true;

    case "number":
      return typeof value === "number";

    case "string":
      return typeof value === "string" && value.length > 0;

    case "array":
      return Array.isArray(value) && value.length > 0;

    case "custom":
      if (typeof criterion.validate === "function") {
        return criterion.validate(value, evidence);
      }
      return false;

    case "presence":
      return value !== undefined && value !== null;

    case "nonEmptyArray":
      return Array.isArray(value) && value.length > 0;

    case "minCount":
      return Array.isArray(value) && value.length >= (criterion.proof.min || 1);

    default:
      return false;
  }
}

/**
 * Determines whether a stage can be exited
 */
export function canExitStage({ stage, targetStage, evidence = {} }) {
  const stageConfig = TargetCriteria.exitCriteria[stage];

  // Unknown stage → deny
  if (!stageConfig) return false;

  // Terminal stages cannot be exited
  if (stageConfig.terminal) return false;

  // Target stage must be allowed
  if (
    targetStage &&
    !TargetCriteria.exitCriteria[targetStage]
  ) {
    return false;
  }

  // All exit criteria must pass
  return stageConfig.required.every((criterion) =>
    evaluateCriterion(criterion, evidence)
  );
}
