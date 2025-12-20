export default {
  stage: "planning",
  name: "PLAN_7",
  requiresPro: false,
  tokenCeiling: 300,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user to reflect on the next 7 days.

Encourage gentle, bounded actions that feel aligned.
Avoid strict scheduling or pressure.
Support choice and clarity.

User input:
"${input}"
`;
  }
};
