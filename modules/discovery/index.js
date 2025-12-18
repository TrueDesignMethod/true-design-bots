// modules/discovery/index.js
// Exports all Discovery modules for TRUE

import { target } from "./target.js";
import { reflect } from "./reflect.js";
import { update } from "./update.js";
import { synthesis } from "./synthesis.js";

// Ensure each module has a buildPrompt method
const modules = { target, reflect, update, synthesis };

for (const key in modules) {
  if (!modules[key].buildPrompt) {
    modules[key].buildPrompt = ({ input, messages }) =>
      modules[key].prompt({ userInput: input, messages });
  }
}

export { target, reflect, update, synthesis };
export default modules;
