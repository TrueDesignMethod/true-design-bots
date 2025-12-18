// modules/alignment/grow.js
export const grow = {
  stage: "alignment",
  name: "GROW",
  requiresPro: false,
  tokenCeiling: 250,
  prompt: ({ userInput }) => `Guide the user to notice opportunities for growth.
Focus on alignment with values and sustainable development.
Do not prescribe actions.

User input:\n"${userInput}"`,
  outputContract: {
    growthOpportunities: "3–5 items",
    reflection: "1–2 sentences"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
