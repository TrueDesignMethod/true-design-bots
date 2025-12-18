// modules/alignment/synthesis.js
export const alignmentSynthesis = {
stage: "alignment",
name: "ALIGNMENT_SYNTHESIS",
requiresPro: true,
tokenCeiling: 360,
prompt: ({ context }) => `The user has requested an Alignment LifePrint.
Integrate simplification, iteration, growth, and nurture into a resilience-focused snapshot.
Do not introduce new goals unless asked.


Context:\n${context}`
};
