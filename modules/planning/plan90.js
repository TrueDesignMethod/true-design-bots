// modules/planning/plan90.js
export const plan90 = {
  stage: "planning",
  name: "PLAN_90",
  requiresPro: false,
  tokenCeiling: 350,
  prompt: ({ userInput }) => `Guide the user to reflect on the next 90 days.
Support planning that respects values, sustainability, and human agency.
Do not enforce schedules; focus on clarity and reflection.

User input:\n"${userInput}"`,
  outputContract: {
    actions: "7–10 items",
    notes: "1–3 sentences"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
