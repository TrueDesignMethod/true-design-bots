// modules/alignment/nurture.js
export const nurture = {
stage: "alignment",
name: "NURTURE",
requiresPro: true,
tokenCeiling: 320,
prompt: ({ userInput }) => `You are guiding the user through Nurture in True Alignment.
Offer personalized rituals and recovery strategies based on energy, values, obstacles, and personality.
Focus on restoration, not optimization.


User input:\n"${userInput}"`
};
