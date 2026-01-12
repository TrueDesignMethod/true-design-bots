// modules/planning/index.js
// True Planning stage modules (CommonJS)

const execute = require("./execute");
const discipline = require("./discipline");
const evaluate = require("./evaluate");
const plan7 = require("./plan7");
const plan30 = require("./plan30");
const plan90 = require("./plan90");
const entry = require("./entry");

module.exports = Object.freeze({
  index: entry,    // ⬅ planning now enters through clarification
  entry,
  execute,
  discipline,
  evaluate,
  plan7,
  plan30,
  plan90
});
