// modules/planning/goalPrioritization.js
export const goalPrioritization = {
  stage: "planning",
  name: "GOAL_PRIORITIZATION",
  requiresPro: false,
  tokenCeiling: 300,
  prompt: ({ userInput }) => `You are guiding the user through Goal Prioritization in True Planning.
Help them rank and select goals based on alignment with their values and clarity of purpose.
Do not prescribe exact actions. Keep reflection humane and bounded.

User input:\n"${userInput}"`,
  outputContract: {
    rankedGoals: "3–5 items",
    rationale: "1–2 sentences"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
