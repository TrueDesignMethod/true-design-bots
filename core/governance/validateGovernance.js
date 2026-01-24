// core/governance/validateGovernance.js

const { StageTransitionMap } = require("./stageTransitionMap");
const { TARGET } = require("./target");

function validateGovernance() {
  Object.keys(TARGET.exitCriteria).forEach(stage => {
    if (!StageTransitionMap[stage]) {
      throw new Error(`TARGET references unknown stage: ${stage}`);
    }
  });

  Object.entries(StageTransitionMap).forEach(([stage, config]) => {
    config.allowedTransitions.forEach(next => {
      if (!TARGET.exitCriteria[next]) {
        throw new Error(`Transition to undefined TARGET stage: ${stage} → ${next}`);
      }
    });
  });
}

module.exports = { validateGovernance };
