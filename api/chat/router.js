// api/chat/router.js
// TRUE V3 — Router / Module Selector
// Stage authority enforced via exit criteria

const modules = require("../../modules/index.js");
const { canExitStage } = require("../../core/governance/stageExitEvaluator");

/**
 * detectStage (V3)
 * TRUE V3 assumes all users begin in Discovery.
 * Stage progression requires explicit proof.
 */
function detectStage({ currentStage }) {
  return currentStage || "discovery";
}

/**
 * detectIntent (V3)
 * Detects SECTION-LEVEL intent only.
 * Does NOT imply readiness or progression.
 */
function detectIntent(input = "") {
  const t = input.toLowerCase();

  // ───────────── DISCOVERY ─────────────
  if (t.includes("why") || t.includes("focus")) return "target";
  if (t.includes("pattern") || t.includes("notice")) return "reflect";
  if (t.includes("value") || t.includes("reframe")) return "upgrade";

  // ─────────── SUSTAINMENT ─────────────
  if (t.includes("execute") || t.includes("act")) return "execute";
  if (t.includes("discipline") || t.includes("system")) return "discipline";
  if (t.includes("evaluate") || t.includes("review")) return "evaluate";
  if (t.includes("7")) return "plan7";
  if (t.includes("30")) return "plan30";
  if (t.includes("90")) return "plan90";

  // ───────────── ALIGNMENT ─────────────
  if (t.includes("simplify") || t.includes("less")) return "simplify";
  if (t.includes("iterate") || t.includes("adjust")) return "iterate";
  if (t.includes("grow") || t.includes("evolve")) return "grow";
  if (t.includes("nurture") || t.includes("care")) return "nurture";

  return null;
}

/**
 * resolveStage (V3)
 * Determines whether the user may advance stages.
 * No implicit forward motion allowed.
 */
function resolveStage({ currentStage, requestedStage, evidence }) {
  // Same stage → always allowed
  if (!requestedStage || requestedStage === currentStage) {
    return currentStage;
  }

  // Ask governance layer if exit is permitted
  const allowed = canExitStage({
    stage: currentStage,
    evidence
  });

  if (!allowed) {
    // Guardrail: block advancement silently
    return currentStage;
  }

  return requestedStage;
}

/**
 * selectModule (V3)
 * Strictly stage-locked.
 */
function selectModule(stage, intent) {
  const stageSet = modules[stage];

  if (!stageSet) {
    throw new Error(`Unknown stage "${stage}"`);
  }

  // ───────────── DISCOVERY ─────────────
  if (stage === "discovery") {
    if (intent === "target") return stageSet.target;
    if (intent === "reflect") return stageSet.reflect;
    if (intent === "upgrade") return stageSet.upgrade;
    return stageSet.target;
  }

  // ─────────── SUSTAINMENT ─────────────
  if (stage === "sustainment") {
    if (intent === "execute") return stageSet.execute;
    if (intent === "discipline") return stageSet.discipline;
    if (intent === "evaluate") return stageSet.evaluate;
    if (intent === "plan7") return stageSet.plan7;
    if (intent === "plan30") return stageSet.plan30;
    if (intent === "plan90") return stageSet.plan90;
    return stageSet.execute;
  }

  // ───────────── ALIGNMENT ─────────────
  if (stage === "alignment") {
    if (intent === "simplify") return stageSet.simplify;
    if (intent === "iterate") return stageSet.iterate;
    if (intent === "grow") return stageSet.grow;
    if (intent === "nurture") return stageSet.nurture;
    return stageSet.simplify;
  }

  throw new Error(`Unhandled stage "${stage}"`);
}

/**
 * decideModel (V3)
 * Module-driven and MCL-compliant
 */
function decideModel(module) {
  return module?.requiresPro ? "PRO" : "CHEAP";
}

module.exports = {
  detectStage,
  detectIntent,
  resolveStage,
  selectModule,
  decideModel
};
const { StageTransitionMap } = require("../../core/governance/StageTransitionMap");
const { canExitStage } = require("../../core/governance/stageExitEvaluator");

function resolveStage({ currentStage, requestedStage, evidence }) {
  if (!requestedStage || requestedStage === currentStage) {
    return currentStage;
  }

  const map = StageTransitionMap[currentStage];

  if (!map) return currentStage;

  // Guardrail 1: Is this transition even allowed?
  if (!map.canAdvanceTo.includes(requestedStage)) {
    return currentStage;
  }

  // Guardrail 2: Has exit been earned?
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
