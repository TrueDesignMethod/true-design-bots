// modules/discovery/index.js
// Discovery stage modules (CommonJS)

const target = require("./target");
const reflect = require("./reflect");
const upgrade = require("./upgrade");

module.exports = Object.freeze({
  index: target,     // default discovery entry point
  target,
  reflect,
  upgrade
});
