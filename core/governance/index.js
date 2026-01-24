// core/governance/index.js
// TRUE V3 — Governance Boundary

const { StageTransitionMap } = require("./stageTransitionMap");
const { TargetCriteria } = require("./target");
const { canExitStage } = require("./stageExitEvaluator");
const { validateGovernance } = require("./validateGovernance");

// Run once at boot
validateGovernance();

module.exports = {
  StageTransitionMap,
  TargetCriteria,
  canExitStage
};
