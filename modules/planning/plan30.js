// modules/planning/plan30.js
export const plan30 = {
  stage: "planning",
  name: "PLAN_30",
  requiresPro: false,
  tokenCeiling: 300,
  prompt: ({ userInput }) => `Guide the user to reflect on the next 30 days.
Encourage them to consider priorities and alignment without pressure.
Invite awareness of constraints and support clarity.

User input:\n"${userInput}"`,
  outputContract: {
    actions: "5–7 items",
    notes: "1–2 sentences"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
