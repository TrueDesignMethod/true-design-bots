// core/governance/stageTransitionMap.js
// TRUE V3 — Explicit Stage Transition Contract
// Defines the ONLY legal stage transitions in the system

/**
 * StageTransitionMap
 * - No implicit jumps
 * - No undefined exits
 * - All movement must be explicitly allowed
 */

export const StageTransitionMap = Object.freeze({
  discovery: {
    allowedTransitions: ["sustainment"],
    description: "Clarity, targeting, and self-understanding"
  },

  sustainment: {
    allowedTransitions: ["alignment", "discovery"],
    description: "Action systems that are humane and repeatable"
  },

  alignment: {
    allowedTransitions: ["sustainment", "discovery"],
    description: "Long-term coherence, care, and adaptive growth"
  }
});
