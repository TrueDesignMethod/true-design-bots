export default {
  stage: "discovery",
  name: "DISCOVERY_SYNTHESIS",
  requiresPro: true,
  tokenCeiling: 380,

  buildPrompt({ context }) {
    return `
You are TRUE.

The user has requested a Discovery Synthesis.

Integrate prior reflections into a compassionate Starting Point Snapshot.
Use the user’s own language wherever possible.
Do not introduce planning.
Do not add new analysis.

Context:
${context}
`;
  }
};
