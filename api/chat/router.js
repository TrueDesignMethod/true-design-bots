import { modules } from "../../modules/index.js";
import { MCL } from "./mcl.js";

/**
 * detectStage
 * Stage detection is conservative.
 * When uncertain, default backward to Discovery.
 */
export function detectStage({ input, explicitStage }) {
  if (explicitStage === "planning") return "planning";
  if (explicitStage === "alignment") return "alignment";

  if (/plan|steps|execute|next/i.test(input)) {
    return "planning";
  }

  if (/burnout|sustain|simplify|tired|overloaded/i.test(input)) {
    return "alignment";
  }

  return "discovery";
}

/**
 * selectModule
 * Modules are selected by intent, not by user instruction.
 */
export function selectModule(stage, intent) {
  const stageModules = modules[stage];

  if (!stageModules) {
    throw new Error(`Unknown stage: ${stage}`);
  }

  // Explicit mappings (extend safely)
  if (stage === "discovery") {
    if (intent === "values") return stageModules.target;
    if (intent === "patterns") return stageModules.reflect;
    if (intent === "reframe") return stageModules.update;
    return stageModules.reflect;
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
    if (intent === "nurture") return stageModules.nurture;
    if (intent === "grow") return stageModules.grow;
    return stageModules.simplify;
  }
}

/**
 * decideModel
 * Defaults to cheap.
 * Pro allowed only for synthesis or integration.
 */
export function decideModel(moduleMeta) {
  if (
    moduleMeta.type === "synthesis" &&
    MCL.modelPolicy.allowProOnlyIf.includes("synthesis")
  ) {
    return "PRO";
  }

  return "CHEAP";
}
