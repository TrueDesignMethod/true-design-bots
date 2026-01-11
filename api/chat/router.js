// api/chat/router.js

const modules = require("../../modules/index.js").default;

/**
 * detectStage
 * Conservative, clarity-first, no forced acceleration
 */
function detectStage({ input = "", explicitStage = null }) {
  if (explicitStage) return explicitStage.toLowerCase();

  const t = input.toLowerCase();

  if (
    t.includes("burnout") ||
    t.includes("overwhelmed") ||
    t.includes("can't sustain") ||
    t.includes("balance")
  ) {
    return "alignment";
  }

  if (
    t.includes("plan") ||
    t.includes("next step") ||
    t.includes("execute")
  ) {
    return "planning";
  }

  return "discovery";
}

/**
 * detectIntent
 * Stage-agnostic signal detection only
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
 * Explicit, stage-safe, philosophy-encoded
 */
function selectModule(stage, intent) {
  const stageSet = modules[stage];

  if (!stageSet) {
    throw new Error(`Unknown stage "${stage}"`);
  }

  // DISCOVERY
  if (stage === "discovery") {
    if (intent === "target") return stageSet.target;
    if (intent === "reflect") return stageSet.reflect;
    if (intent === "upgrade") return stageSet.upgrade;
    return stageSet.index;
  }

  // PLANNING
  if (stage === "planning") {
    if (intent === "execute") return stageSet.execute;
    if (intent === "discipline") return stageSet.discipline;
    if (intent === "evaluate") return stageSet.evaluate;
    if (intent === "plan7") return stageSet.plan7;
    if (intent === "plan30") return stageSet.plan30;
    if (intent === "plan90") return stageSet.plan90;
    return stageSet.execute;
  }

  // ALIGNMENT
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
 * decideModel
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
