// modules/planning/plan30.js
export const plan30 = {
stage: "planning",
name: "PLAN_30_DAY",
requiresPro: true,
tokenCeiling: 420,
prompt: ({ userInput }) => `Create a 30-day action plan focused on momentum and sustainability.
Include habits, reflections, emotional maintenance, and progress markers.
Avoid pressure or rigidity.


User input:\n"${userInput}"`
};
