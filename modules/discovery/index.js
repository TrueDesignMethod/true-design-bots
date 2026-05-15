// modules/discovery/index.js
// TRUE AI — Discovery Module Exports

// --------------------------------------------------
// DISCOVERY INDEX
// --------------------------------------------------
// Purpose:
// Central export surface for all Discovery modules.
//
// This file exists to:
// - simplify imports
// - centralize module access
// - improve maintainability
// - reduce deep import chains
//
// It does NOT:
// - contain business logic
// - perform orchestration
// - generate interpretation
//
// Its responsibility is ONLY:
// organized module exports.
// --------------------------------------------------


// --------------------------------------------------
// TARGET Module
// --------------------------------------------------
export {

  targetModule,

  getTargetQuestions,

  buildTargetReflection,

  evaluateTargetCompletion,

  getNextTargetStep

} from "./target.js";


// --------------------------------------------------
// REFLECT Module
// --------------------------------------------------
export {

  reflectModule,

  getReflectQuestions,

  buildReflectReflection,

  evaluateReflectCompletion,

  getNextReflectStep

} from "./reflect.js";


// --------------------------------------------------
// UPGRADE Module
// --------------------------------------------------
export {

  upgradeModule,

  getUpgradeQuestions,

  buildUpgradeReflection,

  evaluateUpgradeCompletion,

  getNextUpgradeStep

} from "./upgrade.js";


// --------------------------------------------------
// Discovery Orchestrator
// --------------------------------------------------
export {

  DISCOVERY_STATES,

  resolveDiscoveryState,

  advanceDiscoveryState,

  isDiscoveryComplete

} from "./orchestrator.js";
