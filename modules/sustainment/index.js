// modules/sustainment/index.js
// True Sustainment stage modules (ES Module)

import execute from "./execute.js";
import discipline from "./discipline.js";
import evaluate from "./evaluate.js";

const sustainment = Object.freeze({
  index: execute,   // default Sustainment entry point
  execute,
  discipline,
  evaluate
});

export default sustainment;
