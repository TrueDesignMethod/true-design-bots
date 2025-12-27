// api/chat/router.js

const modules = require("../../modules/index.js").default;

/**
 * detectStage
 * Conservative default, explicit forward jumps allowed
 */
function detectStage({ input = "", explicitStage = null }) {
  const text = input.toLowerCase();

  // Explicit override always wins
  if (explicitStage) {
    return explicitStage.toLowerCase();
  }

  // PLANNING — immediate forward motion
  if (
    text.includes("plan") ||
    text.includes("steps") ||
    text.includes("how do i") ||
    text.includes("what should i do") ||
    text.includes("give me a plan")
  ) {
    return "planning";
  }

  // ALIGNMENT — sustainability / overload signals
  if (
    text.includes("burnt out") ||
    text.includes("burned out") ||
    text.includes("overwhelmed") ||
    text.includes("can't keep up") ||
    text.includes("too much") ||
    text.includes("balance") ||
    text.includes("sustainable") ||
    text.includes("afraid i won't stick")
  ) {
    return "alignment";
  }

  // Default
  return "discovery";
}

/**
 * detectIntent
 * Lightweight, optional
 */
function detectIntent(input = "") {
  const text = input.toLowerCase();

  if (text.includes("important") || text.includes("why")) return "values";
  if (text.includes("pattern") || text.includes("habit")) return "patterns";
  if (text.includes("reframe")) return "reframe";

  if (text.includes("prioritize")) return "prioritize";
  if (text.includes("refine")) return "refine";
  if (text.includes("7 day")) return "7day";
  if (text.includes("30 day")) return "30day";
  if (text.includes("90 day")) return "90day";

  if (text.includes("simplify")) return "simplify";
  if (text.includes("grow")) return "grow";
  if (text.includes("nurture")) return "nurture";

  return null;
}

/**
 * selectModule
 */
function selectModule(stage, intent) {
  const stageModules = modules[stage];

  if (!stageModules) {
    throw new Error(`Unknown stage "${stage}"`);
  }

  if (stage === "discovery") {
    if (intent === "values") return stageModules.target;
    if (intent === "patterns") return stageModules.reflect;
    if (intent === "reframe") return stageModules.update;
    return stageModules.target;
  }

  if (stage === "planning") {
    if (intent === "prioritize") return stageModules.goalPrioritization;
    if (intent === "refine") return stageModules.goalRefinement;
    if (intent === "7day") return stageModules.plan7;
    if (intent === "30day") return stageModules.plan30;
    if (intent === "90day") return stageModules.plan90;
    return stageModules.goalPrioritization;
  }

  if (stage === "alignment") {
    if (intent === "simplify") return stageModules.simplify;
    if (intent === "grow") return stageModules.grow;
    if (intent === "nurture") return stageModules.nurture;
    return stageModules.simplify;
  }

  throw new Error(`Unhandled stage "${stage}"`);
}

/**
 * decideModel
 */
function decideModel(module) {
  if (module?.requiresPro === true) return "PRO";
  return "CHEAP";
}

module.exports = {
  detectStage,
  detectIntent,
  selectModule,
  decideModel
};
