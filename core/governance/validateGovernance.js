// core/governance/validateGovernance.js
// TRUE V3 — Governance Validator (ESM)

import { StageTransitionMap } from "./stageTransitionMap.js";
import { TARGET } from "./target.js";

export function validateGovernance() {
  // Check that all TARGET stages exist in StageTransitionMap
  Object.keys(TARGET.exitCriteria).forEach(stage => {
    if (!StageTransitionMap[stage]) {
      throw new Error(`TARGET references unknown stage: ${stage}`);
    }
  });

  // Check that all allowed transitions point to defined TARGET stages
  Object.entries(StageTransitionMap).forEach(([stage, config]) => {
    config.allowedTransitions.forEach(next => {
      if (!TARGET.exitCriteria[next]) {
        throw new Error(`Transition to undefined TARGET stage: ${stage} → ${next}`);
      }
    });
  });
}
