// modules/index.js
// Global module registry for TRUE
// Exposes module namespaces per stage. No routing logic.

import * as discovery from "./discovery/index.js";
import * as planning from "./planning/index.js";
import * as alignment from "./alignment/index.js";

const modules = Object.freeze({
  discovery: Object.freeze(discovery),
  planning: Object.freeze(planning),
  alignment: Object.freeze(alignment),
});

export default modules;
