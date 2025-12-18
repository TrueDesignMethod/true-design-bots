// modules/planning/index.js
// Exports all Planning modules for TRUE

import { goalPrioritization } from "./goalPrioritization.js";
import { goalRefinement } from "./goalRefinement.js";
import { actionDesign } from "./actionDesign.js";
import { obstacleMapping } from "./obstacleMapping.js";
import { plan7 } from "./plan7.js";
import { plan30 } from "./plan30.js";
import { plan90 } from "./plan90.js";
import { synthesis } from "./synthesis.js";

const modules = {
  goalPrioritization,
  goalRefinement,
  actionDesign,
  obstacleMapping,
  plan7,
  plan30,
  plan90,
  synthesis,
};

for (const key in modules) {
  if (!modules[key].buildPrompt) {
    modules[key].buildPrompt = ({ input, messages }) =>
      modules[key].prompt({ userInput: input, messages });
  }
}

export {
  goalPrioritization,
  goalRefinement,
  actionDesign,
  obstacleMapping,
  plan7,
  plan30,
  plan90,
  synthesis,
};
export default modules;
