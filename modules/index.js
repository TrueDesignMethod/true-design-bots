// modules/index.js
// Global module registry for TRUE
// This file exposes what modules exist per stage.
// No logic. No routing. No inference.

import * as discovery from "./discovery/index.js";
import * as planning from "./planning/index.js";
import * as alignment from "./alignment/index.js";

const modules = {
  Discovery: discovery,
  Planning: planning,
  Alignment: alignment,
};

/**
 * getStageModules(stage)
 * Returns the module namespace for a given stage.
 */
export function getStageModules(stage) {
  return modules[stage] || null;
}

/**
 * listStages()
 * Returns supported stages.
 */
export function listStages() {
  return Object.keys(modules);
}

/**
 * listModules(stage)
 * Returns available module names for a stage.
 */
export function listModules(stage) {
  return modules[stage] ? Object.keys(modules[stage]) : [];
}

export default modules;
