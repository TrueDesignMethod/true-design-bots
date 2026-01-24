
// api/chat/stageExitEvaluator.js
// TRUE V3 — Stage Exit Evaluator
// Determines whether a user has met exit criteria for a stage

function canExitStage({ stage, targetStage, evidence = {} }) {
  switch (stage) {
    case "discovery":
      return Boolean(
        evidence.targetDefined &&
        evidence.patternsObserved &&
        evidence.valuesNamed
      );

    case "sustainment":
      return Boolean(
        evidence.systemTested &&
        evidence.frictionObserved &&
        evidence.selfBlameAbsent
      );

    case "alignment":
      // Alignment is cyclical — it does not "complete"
      return false;

    default:
      return false;
  }
}

module.exports = {
  canExitStage
};
