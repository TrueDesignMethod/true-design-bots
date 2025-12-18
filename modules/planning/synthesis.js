// modules/planning/synthesis.js
export const planningSynthesis = {
stage: "planning",
name: "PLANNING_SYNTHESIS",
requiresPro: true,
tokenCeiling: 360,
prompt: ({ context }) => `The user has requested a Planning LifePrint.
Summarize goals, actions, habits, obstacles, and systems using the user’s language.
Do not advance into Alignment unless invited.


Context:\n${context}`
};
