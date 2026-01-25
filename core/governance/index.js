// core/governance/index.js
// TRUE V3 — Governance Boundary (ES Module)

import { StageTransitionMap } from "./stageTransitionMap.js";
import { TargetCriteria } from "./target.js";
import { canExitStage } from "./stageExitEvaluator.js";
import { resolveStage } from "./resolveStage.js";
import { validateGovernance } from "./validateGovernance.js";

// Validate once at startup
validateGovernance();

export {
  StageTransitionMap,
  TargetCriteria,
  canExitStage,
  resolveStage
};
