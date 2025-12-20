import { modules } from "../../modules/index.js";
import { MCL } from "./mcl.js";

/**
 * detectStage
 * Stage detection is conservative. Defaults to Discovery.
 */
export function detectStage({ input, explicitStage }) {
  const stage = explicitStage?.toLowerCase();

  if (stage === "planning") return "planning";
  if (stage === "alignment") return "alignment";
  if (stage === "discovery") return "discovery";

  if (/plan|steps|execute|next/i.test(input)) return "planning";
  if (/burnout|sustain|simplify|tired|overloaded/i.test(input)) return "alignment";

  return "discovery";
}


/**
 * detectIntent
 * Simple keyword-based intent detection.
 */
export function detectIntent(input) {
  if (/value|important|meaning|desire|motivation/i.test(input)) return "values";
  if (/pattern|habit|routine|behavior/i.test(input)) return "patterns";
  if (/reframe|perspective|update/i.test(input)) return "reframe";
  if (/prioritize/i.test(input)) return "prioritize";
  if (/refine/i.test(input)) return "refine";
  if (/7 ?day/i.test(input)) return "7day";
  if (/30 ?day/i.test(input)) return "30day";
  if (/90 ?day/i.test(input)) return "90day";
  if (/simplify/i.test(input)) return "simplify";
  if (/grow/i.test(input)) return "grow";
  if (/nurture/i.test(input)) return "nurture";

  return null;
}

/**
 * selectModule
 * Modules are selected by stage + intent.
 */
export function selectModule(stage, intent) {
  const stageModules = modules[stage];

  if (!stageModules) throw new Error(`Unknown stage: ${stage}`);

  if (stage === "discovery") {
    if (intent === "values") return stageModules.target;
    if (intent === "patterns") return stageModules.reflect;
    if (intent === "reframe") return stageModules.update;
    return stageModules.reflect; // fallback
  }

  if (stage === "planning") {
    if (intent === "prioritize") return stageModules.goalPrioritization;
    if (intent === "refine") return stageModules.goalRefinement;
    if (intent === "7day") return stageModules.plan7;
    if (intent === "30day") return stageModules.plan30;
    if (intent === "90day") return stageModules.plan90;
    return stageModules.goalPrioritization; // fallback
  }

  if (stage === "alignment") {
    if (intent === "simplify") return stageModules.simplify;
    if (intent === "grow") return stageModules.grow;
    if (intent === "nurture") return stageModules.nurture;
    return stageModules.simplify; // fallback
  }

  return null;
}

/**
 * decideModel
 * Defaults to CHEAP; Pro only for synthesis/integration.
 */
export function decideModel(module) {
  if (
    module.type === "synthesis" &&
    MCL.modelPolicy.allowProOnlyIf.includes("synthesis")
  ) return "PRO";

  return "CHEAP";
}
