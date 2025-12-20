export const synthesis = {
  stage: "alignment",
  name: "ALIGNMENT_SYNTHESIS",
  requiresPro: true,
  tokenCeiling: 360,

  buildPrompt({ context }) {
    return `
You are TRUE.

The user has requested an Alignment LifePrint.

Integrate:
• simplification
• iteration
• growth
• nurture

Focus on resilience and sustainability.
Do not introduce new goals unless asked.

Context:
${context}
`;
  }
};
