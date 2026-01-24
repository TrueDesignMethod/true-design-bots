// core/governance/stageExitEvaluator.js
// TRUE V3 — Stage Exit Evaluator
// Evaluates exit readiness strictly against TargetCriteria

const { TargetCriteria } = require("./target");

/**
 * Validates a single criterion against provided evidence
 */
function evaluateCriterion(criterion, evidence) {
  const value = evidence[criterion.key];

  switch (criterion.type) {
    case "boolean":
      return value === true;

    // Future-proofing hooks
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

    default:
      return false;
  }
}

/**
 * Determines whether a stage can be exited
 */
function canExitStage({ stage, targetStage, evidence = {} }) {
  const stageConfig = TargetCriteria[stage];

  // Unknown stage → deny
  if (!stageConfig) return false;

  // Terminal stages cannot be exited
  if (stageConfig.isTerminal) return false;

  // Target stage must be allowed
  if (
    targetStage &&
    !stageConfig.allowedTransitions.includes(targetStage)
  ) {
    return false;
  }

  // All exit criteria must pass
  return stageConfig.exitCriteria.every((criterion) =>
    evaluateCriterion(criterion, evidence)
  );
}

module.exports = {
  canExitStage
};
