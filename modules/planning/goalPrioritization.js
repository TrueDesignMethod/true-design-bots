// modules/planning/goalPrioritization.js
export const goalPrioritization = {
stage: "planning",
name: "GOAL_PRIORITIZATION",
requiresPro: false,
tokenCeiling: 260,
prompt: ({ userInput }) => `You are guiding the user through Goal Prioritization in True Planning.
Help them select 1–3 goals that feel aligned and realistic for this cycle.
Emphasize clarity over quantity.
Do not introduce urgency or additional goals.
End by confirming why these goals matter now.


User input:\n"${userInput}"`
};
