// modules/alignment/index.js
// Exports all Alignment modules for TRUE

import { simplify } from "./simplify.js";
import { reduceRemoveDelegate } from "./reduceRemoveDelegate.js";
import { iterate } from "./iterate.js";
import { grow } from "./grow.js";
import { nurture } from "./nurture.js";
import { synthesis } from "./synthesis.js";

const modules = { simplify, reduceRemoveDelegate, iterate, grow, nurture, synthesis };

for (const key in modules) {
  if (!modules[key].buildPrompt) {
    modules[key].buildPrompt = ({ input, messages }) =>
      modules[key].prompt({ userInput: input, messages });
  }
}

export { simplify, reduceRemoveDelegate, iterate, grow, nurture, synthesis };
export default modules;
