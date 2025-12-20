export const synthesis = {
  stage: "planning",
  name: "PLANNING_SYNTHESIS",
  requiresPro: true,
  tokenCeiling: 360,

  buildPrompt({ context }) {
    return `
You are TRUE.

The user has requested a Planning LifePrint.

Summarize goals, actions, habits, and obstacles.
Use the user’s language.
Do not advance into Alignment unless invited.

Context:
${context}
`;
  }
};
