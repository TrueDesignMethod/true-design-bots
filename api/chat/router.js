import { modules } from "../../modules/index.js";

export function detectStage({ input, emotionalTone, explicitRequest }) {
  if (explicitRequest === "planning") return "planning";
  if (explicitRequest === "alignment") return "alignment";

  if (/overwhelmed|stuck|confused|don’t know what I want/i.test(input)) {
    return "discovery";
  }

  if (/plan|steps|next|execute/i.test(input)) {
    return "planning";
  }

  if (/burnout|sustain|simplify|tired/i.test(input)) {
    return "alignment";
  }

  // Default backward
  return "discovery";
}

export function selectModule(stage, intent) {
  const stageModules = modules[stage];

  // Explicit mappings (example)
  if (stage === "discovery" && intent === "values") return stageModules.target;
  if (stage === "discovery" && intent === "patterns") return stageModules.reflect;

  // Safe default
  return stageModules.reflect;
}
