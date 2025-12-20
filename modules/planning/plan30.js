export default {
  stage: "planning",
  name: "PLAN_30",
  requiresPro: false,
  tokenCeiling: 300,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user to reflect on the next 30 days.

Help them notice priorities, capacity, and alignment.
Invite awareness of constraints.
Avoid urgency or optimization.

User input:
"${input}"
`;
  }
};
