export default {
  stage: "planning",
  name: "ACTION_DESIGN",
  requiresPro: false,
  tokenCeiling: 220,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user through Action Design in the Planning stage.

Offer:
• one microstep
• one momentum step
• one supporting habit

Keep everything humane, optional, and achievable.
No pressure. No optimization.

User input:
"${input}"
`;
  }
};
