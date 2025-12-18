// modules/alignment/simplify.js
export const simplify = {
  stage: "alignment",
  name: "SIMPLIFY",
  requiresPro: false,
  tokenCeiling: 250,
  prompt: ({ userInput }) => `Guide the user to notice what can be simplified, reduced, or delegated.
Focus on reflection, awareness, and long-term sustainability.
Do not prescribe actions.

User input:\n"${userInput}"`,
  outputContract: {
    simplifications: "3–5 items",
    insight: "1–2 sentences"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
