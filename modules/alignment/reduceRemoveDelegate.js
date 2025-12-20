export default {
  stage: "alignment",
  name: "REDUCE_REMOVE_DELEGATE",
  requiresPro: false,
  tokenCeiling: 300,

  buildPrompt({ input }) {
    return `
You are TRUE, guiding the user to consider what they are ready to:
• reduce
• remove
• delegate

Respect readiness.
Avoid moral pressure or productivity framing.

User input:
"${input}"
`;
  }
};
