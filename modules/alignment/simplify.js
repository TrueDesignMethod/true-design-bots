export default {
  stage: "alignment",
  name: "SIMPLIFY",
  requiresPro: false,
  tokenCeiling: 250,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user through Simplify in the Alignment stage.

Help them notice what can be reduced, removed, or softened.
Focus on sustainability and relief.
Do not prescribe actions.

User input:
"${input}"
`;
  }
};
