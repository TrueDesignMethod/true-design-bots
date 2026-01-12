// api/chat/router.js
// TRUE V2 - Router / Module Selector

const modules = require("../../modules/index.js");

/**
 * detectStage
 * Used only as a fallback if:
 * - No current session stage
 * - No declared stage from client
 * - Legacy/malformed request
 */
function detectStage({ input = "", explicitStage = null }) {
  if (explicitStage) return explicitStage.toLowerCase();

  const t = input.toLowerCase();

  // ALIGNMENT cues
  if (
    t.includes("burnout") ||
    t.includes("overwhelmed") ||
    t.includes("can't sustain") ||
    t.includes("balance")
  ) {
    return "alignment";
  }

  // PLANNING cues
  if (
    t.includes("plan") ||
    t.includes("next step") ||
    t.includes("execute")
  ) {
    return "planning";
  }

  // Default fallback
  return "discovery";
}

/**
 * detectIntent
 * Lightweight, stage-agnostic signal detection
 */
function detectIntent(input = "") {
  const t = input.toLowerCase();

  // DISCOVERY
  if (t.includes("why")) return "target";
  if (t.includes("pattern")) return "reflect";
  if (t.includes("upgrade")) return "upgrade";

  // PLANNING
  if (t.includes("execute")) return "execute";
  if (t.includes("discipline")) return "discipline";
  if (t.includes("evaluate")) return "evaluate";
  if (t.includes("7")) return "plan7";
  if (t.includes("30")) return "plan30";
  if (t.includes("90")) return "plan90";

  // ALIGNMENT
  if (t.includes("simplify")) return "simplify";
  if (t.includes("iterate")) return "iterate";
  if (t.includes("grow")) return "grow";
  if (t.includes("nurture")) return "nurture";

  return null;
}

/**
 * selectModule
 * Returns the module to use given stage + intent
 */
function selectModule(stage, intent) {
  const stageSet = modules[stage];

  if (!stageSet) {
    throw new Error(`Unknown stage "${stage}"`);
  }

  // ---------------- DISCOVERY ----------------
  if (stage === "discovery") {
    if (intent === "target") return stageSet.target;
    if (intent === "reflect") return stageSet.reflect;
    if (intent === "upgrade") return stageSet.upgrade;
    return stageSet.index; // Default discovery entry
  }

  // ---------------- PLANNING ----------------
  if (stage === "planning") {
    if (intent === "execute") return stageSet.execute;
    if (intent === "discipline") return stageSet.discipline;
    if (intent === "evaluate") return stageSet.evaluate;
    if (intent === "plan7") return stageSet.plan7;
    if (intent === "plan30") return stageSet.plan30;
    if (intent === "plan90") return stageSet.plan90;
    return stageSet.index; // DEFAULT: entry.js
  }

  // ---------------- ALIGNMENT ----------------
  if (stage === "alignment") {
    if (intent === "simplify") return stageSet.simplify;
    if (intent === "iterate") return stageSet.iterate;
    if (intent === "grow") return stageSet.grow;
    if (intent === "nurture") return stageSet.nurture;
    return stageSet.simplify; // Default alignment entry
  }

  throw new Error(`Unhandled stage "${stage}"`);
}

/**
 * decideModel
 * Module-driven model selection
 */
function decideModel(module) {
  return module?.requiresPro ? "PRO" : "CHEAP";
}

module.exports = {
  detectStage,
  detectIntent,
  selectModule,
  decideModel
};
