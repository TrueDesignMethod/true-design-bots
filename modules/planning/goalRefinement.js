export default {
  stage: "planning",
  name: "GOAL_REFINEMENT",
  requiresPro: false,
  tokenCeiling: 300,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user through Goal Refinement in the Planning stage.

Help clarify the scope and intent of each goal.
Make goals more humane, realistic, and aligned.
Do not create schedules or enforce productivity framing.

User input:
"${input}"
`;
  }
};
