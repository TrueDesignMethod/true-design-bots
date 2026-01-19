// modules/sustainment/index.js
// True Sustainment stage modules

const execute = require("./execute");
const discipline = require("./discipline");
const evaluate = require("./evaluate");

module.exports = Object.freeze({
  index: execute,   // default Sustainment entry point
  execute,
  discipline,
  evaluate
});
