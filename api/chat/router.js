// api/chat/router.js
// TRUE V3 — Router / Module Selector
// Enforces stage authority, section-level intent only, no silent advancement

const modules = require("../../modules/index.js");

/**
 * detectStage (V3)
 * Used ONLY as a hard fallback.
 * TRUE V3 assumes all users begin in Discovery.
 */
function detectStage() {
  return "discovery";
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
 * selectModule (V3)
 * Strictly stage-locked.
 * Exit criteria enforcement happens upstream.
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

    // Default: Discovery always begins at TARGET
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

    // Default: Sustainment begins with EXECUTE
    return stageSet.execute;
  }

  // ───────────── ALIGNMENT ─────────────
  if (stage === "alignment") {
    if (intent === "simplify") return stageSet.simplify;
    if (intent === "iterate") return stageSet.iterate;
    if (intent === "grow") return stageSet.grow;
    if (intent === "nurture") return stageSet.nurture;

    // Default: Alignment begins with SIMPLIFY
    return stageSet.simplify;
  }

  throw new Error(`Unhandled stage "${stage}"`);
}

/**
 * decideModel (V3)
 * Model choice is module-driven and MCL-compliant
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
