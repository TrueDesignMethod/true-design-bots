// modules/planning/plan7.js
export const plan7 = {
stage: "planning",
name: "PLAN_7_DAY",
requiresPro: true,
tokenCeiling: 340,
prompt: ({ userInput }) => `Create a 7-day action plan that includes exactly:
3 actions, 1 habit, 1 obstacle strategy, and 1 reflection question.
Keep it realistic and supportive.


User input:\n"${userInput}"`
};
