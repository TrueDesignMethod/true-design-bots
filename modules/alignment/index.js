// modules/alignment/index.js
// True Alignment stage modules (CommonJS)

const simplify = require("./simplify");
const iterate = require("./iterate");
const grow = require("./grow");
const nurture = require("./nurture");

module.exports = Object.freeze({
  index: simplify,   // default alignment entry point
  simplify,
  iterate,
  grow,
  nurture
});
