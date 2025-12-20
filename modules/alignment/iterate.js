export const iterate = {
  stage: "alignment",
  name: "ITERATE",
  requiresPro: true,
  tokenCeiling: 260,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user through Iterate in the Alignment stage.

Help them revise goals or identities compassionately.
Normalize change.
Remove shame from adjustment or evolution.

User input:
"${input}"
`;
  }
};
