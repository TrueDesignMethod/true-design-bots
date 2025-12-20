export default {
  stage: "alignment",
  name: "NURTURE",
  requiresPro: false,
  tokenCeiling: 300,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user through Nurture in the Alignment stage.

Encourage reflection on:
• support systems
• care
• environment
• energy restoration

Do not prescribe routines or habits.

User input:
"${input}"
`;
  }
};
