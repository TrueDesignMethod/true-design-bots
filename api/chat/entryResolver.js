// api/chat/entryResolver.js

const STAGES = ["discovery", "planning", "alignment"];

/**
 * resolveEntryStage
 * Single-responsibility: determine initial stage
 * Executes once per session or on explicit reset
 */
function resolveEntryStage({ declaredStage }) {
  if (declaredStage && STAGES.includes(declaredStage)) {
    return declaredStage;
  }

  // Safe, humane default
  return "discovery";
}

module.exports = {
  resolveEntryStage
};
