export default {
  stage: "alignment",
  name: "GROW",
  requiresPro: false,
  tokenCeiling: 250,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user through Grow in the Alignment stage.

Help the user notice opportunities for growth that feel sustainable and aligned.
Focus on expansion without pressure.
Do not prescribe actions.

User input:
"${input}"
`;
  }
};
