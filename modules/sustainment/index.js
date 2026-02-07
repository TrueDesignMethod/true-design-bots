// modules/sustainment/index.js
// True Sustainment stage modules (ES Module)

import execute from "./execute.js";
import discipline from "./discipline.js";
import evaluate from "./evaluate.js";
import plan7 from "./plan7.js";
import plan30 from "./plan30.js";
import plan90 from "./plan90.js";

const sustainment = Object.freeze({
  index: execute,   // default Sustainment entry point
  execute,
  discipline,
  evaluate,
  plan7,
  plan30,
  plan90
});

export default sustainment;
