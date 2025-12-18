// modules/alignment/reduceRemoveDelegate.js
export const reduceRemoveDelegate = {
stage: "alignment",
name: "REDUCE_REMOVE_DELEGATE",
requiresPro: false,
tokenCeiling: 300,
prompt: ({ userInput }) => `Help the user decide what they are ready to reduce, remove, or delegate.
Respect readiness.
Avoid moral pressure.


User input:\n"${userInput}"`
},
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
