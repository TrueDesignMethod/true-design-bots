// modules/alignment/grow.js
export const grow = {
stage: "alignment",
name: "GROW",
requiresPro: false,
tokenCeiling: 260,
prompt: ({ userInput }) => `Help the user identify what is supporting their growth and define a 90-day growth theme.
Encourage expansion without burnout.


User input:\n"${userInput}"`
};
