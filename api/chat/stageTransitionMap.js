// core/governance/StageTransitionMap.js
// TRUE V3 — Explicit Stage Progression Contract

/**
 * StageTransitionMap
 * Defines the ONLY valid stage transitions in TRUE.
 * No implicit jumps, no skips, no backward force.
 */

const StageTransitionMap = Object.freeze({
  discovery: {
    canAdvanceTo: ["sustainment"],
    canReturnTo: [],        // Discovery is the root
    description: "Clarity, targeting, and self-understanding"
  },

  sustainment: {
    canAdvanceTo: ["alignment"],
    canReturnTo: ["discovery"],
    description: "Action systems that are humane and repeatable"
  },

  alignment: {
    canAdvanceTo: [],       // Alignment is cyclical, not terminal
    canReturnTo: ["sustainment", "discovery"],
    description: "Long-term coherence, care, and adaptive growth"
  }
});

module.exports = {
  StageTransitionMap
};
