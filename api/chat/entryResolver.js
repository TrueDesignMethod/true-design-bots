// api/chat/entryResolver.js
// TRUE V2 — Entry Resolution Contract
// Resolves the active stage BEFORE routing/module selection

/**
 * resolveEntryStage
 *
 * Priority order:
 * 1. Explicit user-declared stage (declaredStage)
 * 2. Existing session stage
 * 3. Consent-approved stage transition
 * 4. Fallback (null → router may detectStage)
 *
 * This function NEVER guesses silently.
 * It either resolves cleanly or returns null.
 */
function resolveEntryStage({
  declaredStage = null,
  sessionStage = null,
  messages = [],
  consent = false
}) {
  // Normalize
  const normalize = s =>
    typeof s === "string" ? s.toLowerCase() : null;

  const declared = normalize(declaredStage);
  const session = normalize(sessionStage);

  // 1. Explicit declaration always wins
  if (declared) {
    return declared;
  }

  // 2. Session continuity (default)
  if (session) {
    return session;
  }

  // 3. Consent-based stage change
  if (consent) {
    const proposed = getProposedStage(messages);
    if (proposed) return proposed;
  }

  // 4. Unresolved → let router fallback decide
  return null;
}

/**
 * getProposedStage
 *
 * Looks for the most recent assistant-proposed stage change.
 * This assumes assistant messages may include:
 * { role: "assistant", suggestedStage: "planning" }
 */
function getProposedStage(messages = []) {
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (
      m.role === "assistant" &&
      typeof m.suggestedStage === "string"
    ) {
      return m.suggestedStage.toLowerCase();
    }
  }
  return null;
}

module.exports = {
  resolveEntryStage
};
