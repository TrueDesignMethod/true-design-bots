// modules/index.js
// Global module registry for TRUE
// Exposes module namespaces per stage. No routing logic.

const discovery = require("./discovery");
const planning = require("./planning");
const sustainment = require("./sustainment");
const alignment = require("./alignment");

const modules = Object.freeze({
  discovery: Object.freeze(discovery),
  planning: Object.freeze(planning),
  sustainment: Object.freeze(sustainment),
  alignment: Object.freeze(alignment),
});

module.exports = modules;
