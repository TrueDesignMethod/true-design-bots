// modules/index.js
// Central module registry + router for TRUE
// The client never selects modules — only stage + messages.
// Meaning is inferred here.

import discoveryModules from "./discovery/index.js";
import planningModules from "./planning/index.js";
import alignmentModules from "./alignment/index.js";

/**
 * Resolve which module set is active based on stage.
 */
function getModulesForStage(stage) {
  switch (stage) {
    case "Discovery":
      return discoveryModules;
    case "Planning":
      return planningModules;
    case "Alignment":
      return alignmentModules;
    default:
      return discoveryModules;
  }
}

/**
 * Very lightweight heuristic router.
 * This is NOT a rigid classifier — just a gentle guide.
 * You can later replace or enhance this with embeddings.
 */
function selectModule(modules, messages) {
  const lastUserMessage = [...messages]
    .reverse()
    .find(m => m.role === "user")?.content?.toLowerCase() || "";

  // Let modules self-declare relevance
  for (const mod of modules) {
    if (mod.match(lastUserMessage, messages)) {
      return mod;
    }
  }

  // Fallback: first module is always a safe reflective default
  return modules[0];
}

/**
 * Main entry point used by chat/index.js
 */
export async function runModule({ stage, messages, llm }) {
  const modules = getModulesForStage(stage);
  const module = selectModule(modules, messages);

  return module.run({ stage, messages, llm });
}
