// core/governance/index.js
// TRUE V3 — Governance Boundary

const { StageTransitionMap } = require("./stageTransitionMap");
const { TargetCriteria } = require("./target");
const { canExitStage } = require("./stageExitEvaluator");
const { resolveStage } = require("./resolveStage");
const { validateGovernance } = require("./validateGovernance");

// Validate once at startup
validateGovernance();

module.exports = {
  StageTransitionMap,
  TargetCriteria,
  canExitStage,
  resolveStage
};
