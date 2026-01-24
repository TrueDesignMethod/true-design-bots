// core/governance/stageExitEvaluator.js
// TRUE V3 — Stage Exit Evaluator
// Enforces Truth & Readiness Gatekeeping defined in target.js

const { TargetCriteria } = require("./target");

/**
 * Evaluates whether a user can exit a given stage
 * based on explicit criteria defined in target.js
 */
function canExitStage({ stage, targetStage, evidence = {} }) {
  if (!stage) return false;

  const stageDefinition = TargetCriteria[stage];

  // Guardrail 1: Stage must exist
  if (!stageDefinition) {
    return false;
  }

  // Guardrail 2: Stage must be allowed to exit
  if (stageDefinition.isTerminal) {
    return false;
  }

  // Guardrail 3: Target stage must be valid (if specified)
  if (
    targetStage &&
    Array.isArray(stageDefinition.allowedTransitions) &&
    !stageDefinition.allowedTransitions.includes(targetStage)
  ) {
    return false;
  }

  const requiredCriteria = stageDefinition.exitCriteria || [];

  // Guardrail 4: No criteria = no exit
  if (requiredCriteria.length === 0) {
    return false;
  }

  // Evaluate all exit criteria
  return requiredCriteria.every((criterion) => {
    const value = evidence[criterion.key];

    // Simple boolean criteria
    if (criterion.type === "boolean") {
      return Boolean(value) === true;
    }

    // Function-based criteria (future expansion)
    if (criterion.type === "function" && typeof criterion.evaluate === "function") {
      return criterion.evaluate(evidence);
    }

    // Scored criteria (future expansion)
    if (criterion.type === "score") {
      return typeof value === "number" && value >= criterion.minimum;
    }

    // Unknown criterion type → fail safely
    return false;
  });
}

module.exports = {
  canExitStage
};
