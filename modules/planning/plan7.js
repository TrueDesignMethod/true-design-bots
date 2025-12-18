// modules/planning/plan7.js
export const plan7 = {
  stage: "planning",
  name: "PLAN_7",
  requiresPro: false,
  tokenCeiling: 300,
  prompt: ({ userInput }) => `Guide the user to reflect on the next 7 days.
Identify gentle, bounded actions that feel aligned, without enforcing strict schedules.
Support clarity and choice.

User input:\n"${userInput}"`,
  outputContract: {
    actions: "3–5 items",
    notes: "1–2 sentences"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
