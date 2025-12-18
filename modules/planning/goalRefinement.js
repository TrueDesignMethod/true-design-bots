// modules/planning/goalRefinement.js
export const goalRefinement = {
  stage: "planning",
  name: "GOAL_REFINEMENT",
  requiresPro: false,
  tokenCeiling: 300,
  prompt: ({ userInput }) => `You are guiding the user through Goal Refinement in True Planning.
Help them clarify the scope and intent of each goal, making it actionable and humane.
Do not create schedules. Encourage reflection and conscious adjustments.

User input:\n"${userInput}"`,
  outputContract: {
    refinedGoals: "3–5 items",
    clarificationNotes: "1–2 sentences"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
