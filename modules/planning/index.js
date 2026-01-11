// modules/planning/index.js
// True Planning stage modules (CommonJS)

const execute = require("./execute");
const discipline = require("./discipline");
const evaluate = require("./evaluate");
const plan7 = require("./plan7");
const plan30 = require("./plan30");
const plan90 = require("./plan90");

module.exports = Object.freeze({
  index: execute,   // default planning entry point
  execute,
  discipline,
  evaluate,
  plan7,
  plan30,
  plan90
});
