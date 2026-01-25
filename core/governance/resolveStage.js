// core/governance/resolveStage.js
// TRUE V3 — Stage Resolution with Guardrails (ES Module)

import { StageTransitionMap } from "./stageTransitionMap.js";
import { canExitStage } from "./stageExitEvaluator.js";

export function resolveStage({ currentStage, requestedStage, evidence }) {
  if (!requestedStage || requestedStage === currentStage) {
    return currentStage;
  }

  const map = StageTransitionMap[currentStage];
  if (!map) return currentStage;

  // Guardrail 1: Transition must be explicitly allowed
  if (!map.allowedTransitions.includes(requestedStage)) {
    return currentStage;
  }

  // Guardrail 2: Exit criteria must be met
  const allowed = canExitStage({
    stage: currentStage,
    targetStage: requestedStage,
    evidence
  });

  if (!allowed) {
    return currentStage;
  }

  return requestedStage;
}
