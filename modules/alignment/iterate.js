// modules/alignment/iterate.js
export const iterate = {
stage: "alignment",
name: "ITERATE",
requiresPro: true,
tokenCeiling: 260,
prompt: ({ userInput }) => `You are guiding the user through Iterate in True Alignment.
Help them revise goals compassionately as they evolve.
Remove shame from change.


User input:\n"${userInput}"`
},
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
