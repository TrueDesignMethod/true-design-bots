// modules/planning/obstacleMapping.js
export const obstacleMapping = {
stage: "planning",
name: "OBSTACLE_MAPPING",
requiresPro: false,
tokenCeiling: 240,
prompt: ({ userInput }) => `You are guiding the user through Obstacle Mapping in True Planning.
Help them identify which obstacles apply and how to respond gently when they arise.
Normalize resistance.
Avoid shame or willpower framing.


User input:\n"${userInput}"`
};
