export default {
  stage: "planning",
  name: "PLAN_90",
  requiresPro: false,
  tokenCeiling: 350,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user to reflect on the next 90 days.

Support planning that respects:
• values
• sustainability
• evolving capacity

Do not enforce schedules.
Focus on clarity, not control.

User input:
"${input}"
`;
  }
};
