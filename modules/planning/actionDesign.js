// modules/planning/actionDesign.js
export const actionDesign = {
stage: "planning",
name: "ACTION_DESIGN",
requiresPro: false,
tokenCeiling: 200,
prompt: ({ userInput }) => `You are guiding the user through Action Design in True Planning.
Provide one microstep, one momentum step, and one supporting habit toward their goal.
Keep it simple and achievable.
Avoid overwhelm and pressure.


User input:\n"${userInput}"`
};
