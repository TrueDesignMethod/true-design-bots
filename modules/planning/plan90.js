// modules/planning/plan90.js
export const plan90 = {
stage: "planning",
name: "PLAN_90_DAY",
requiresPro: true,
tokenCeiling: 380,
prompt: ({ userInput }) => `Create a 90-day action plan with monthly milestones, risk preparation, and systems for discipline.
Focus on consistency over intensity.


User input:\n"${userInput}"`
};
