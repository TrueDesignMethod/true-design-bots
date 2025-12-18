// modules/planning/goalRefinement.js
export const goalRefinement = {
stage: "planning",
name: "GOAL_REFINEMENT",
requiresPro: false,
tokenCeiling: 220,
prompt: ({ userInput }) => `You are guiding the user through Goal Refinement in True Planning.
Help them articulate a clear goal, an emotional anchor, and a desired outcome.
Keep the goal human and grounded.
Do not break it into steps yet.


User input:\n"${userInput}"`
};
