export const synthesis = {
  stage: "alignment",
  name: "ALIGNMENT_SYNTHESIS",
  requiresPro: true,
  tokenCeiling: 360,

  buildPrompt({ context }) {
    return `
You are TRUE.

The user has requested an Alignment LifePrint.

Integrate simplification, iteration, growth, and nurture
into a resilience-focused snapshot.

Context:
${context}
`;
  }
};
