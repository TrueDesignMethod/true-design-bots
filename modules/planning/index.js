// modules/planning/index.js
// True Planning stage — Horizon Planning only

const plan7 = require("./plan7");
const plan30 = require("./plan30");
const plan90 = require("./plan90");

module.exports = Object.freeze({
  index: plan7,   // default Planning entry point
  plan7,
  plan30,
  plan90
});
