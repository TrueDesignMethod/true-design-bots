// modules/planning/entry.js
// Planning entry clarifier (V2)
// Purpose: verify readiness BEFORE generating plans

module.exports = {
  stage: "planning",
  name: "PLANNING_ENTRY",
  requiresPro: false,
  tokenCeiling: 200,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user at the entry to Planning.

Before creating a plan, briefly clarify:
• why they want a plan right now
• what kind of structure would help them most
• the scope or timeframe they’re imagining

Do NOT create a plan yet.
Do NOT suggest actions.
Ask 1–2 reflective clarification questions only.

User input:
"${input}"
`;
  }
};
