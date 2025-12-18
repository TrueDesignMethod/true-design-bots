// modules/alignment/nurture.js
export const nurture = {
  stage: "alignment",
  name: "NURTURE",
  requiresPro: false,
  tokenCeiling: 300,
  prompt: ({ userInput }) => `Guide the user to nurture themselves and their environment.
Encourage reflection on support systems, self-care, and alignment.
Do not prescribe actions.

User input:\n"${userInput}"`,
  outputContract: {
    nurtureActions: "3–5 items",
    reflection: "1–2 sentences"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
