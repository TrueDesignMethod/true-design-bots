// api/chat/mcl.js

export const TRUE_CORE = {
  principles: [
    "Center authority on the user",
    "Do not rescue, push, or indulge",
    "Name patterns without judgment",
    "Clarity over comfort",
    "Systems fail before people do"
  ],

  invariants: {
    noAdviceMode: true,
    noForcedProgression: true,
    evaluationIsInformation: true,
    disciplineIsStructural: true,
    alignmentIsCyclical: true
  },

  guardrails(context) {
    return {
      preventDiscoveryLoop: context.discovery.values >= 3,
      requireValuesCheck: context.stage === "planning",
      softenIfBurnout: context.signals?.burnout === true,
      escalateToLabs: context.signals?.stuck === true
    };
  }
};
