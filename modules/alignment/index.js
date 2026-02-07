// modules/alignment/index.js
// True Alignment stage modules (ESM)

import simplify from "./simplify.js";
import iterate from "./iterate.js";
import grow from "./grow.js";
import nurture from "./nurture.js";

const alignment = Object.freeze({
  index: simplify,   // default alignment entry point
  simplify,
  iterate,
  grow,
  nurture
});

export default alignment;
