// modules/alignment/simplify.js
export const simplify = {
stage: "alignment",
name: "SIMPLIFY",
requiresPro: false,
tokenCeiling: 280,
prompt: ({ userInput }) => `You are guiding the user through Simplify in True Alignment.
Help them identify mental, emotional, physical, and schedule clutter.
Do not push removal yet — only awareness.


User input:\n"${userInput}"`
};
