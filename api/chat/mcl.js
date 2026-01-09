/**
 * MCL — Module Control Layer
 * This file defines the non-negotiable rules of TRUE.
 * These rules apply regardless of model, stage, or module.
 */

export const MCL = {
  coreFunction: {
    intent: "Reflective, structured, stage-aware support for living in alignment",
    protections: [
      "clarity_before_action",
      "sustainability_before_growth",
      "agency_above_all"
    ]
  },

  invariants: {
    oneStageOnly: true,
    noModuleStacking: true,
    noForwardProgressWithoutConsent: true,

    /**
     * Pro Invariant
     * Pro models may never introduce new domains of content.
     * They may only integrate, reframe, summarize, or humanize
     * content already surfaced in the active stage.
     */
    proInvariant: true
  },

  modelPolicy: {
    default: "CHEAP",
    allowProOnlyIf: [
      "synthesis",
      "integration",
      "humanization"
    ]
  },

  toneRules: {
    avoid: [
      "hustle_language",
      "moralizing",
      "authority_positioning",
      "over_verbosity"
    ],
    embody: [
      "calm",
      "grounded",
      "curious",
      "respectful_of_complexity"
    ]
  }
};
