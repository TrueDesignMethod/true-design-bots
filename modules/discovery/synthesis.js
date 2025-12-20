// modules/discovery/synthesis.js
export const discoverySynthesis = {
stage: "discovery",
name: "DISCOVERY_SYNTHESIS",
requiresPro: true,
tokenCeiling: 380,
prompt: ({ context }) => `The user has requested a Discovery Synthesis.
Integrate prior insights into a clear, compassionate Starting Point Snapshot using the user’s own language wherever possible.
Do not add new analysis.
Do not transition into planning unless invited.


Context:\n${context}`,
outputContract: {
values: true,
motivations: true,
strengthsWeaknesses: true,
emergingGoals: "1–3",
obstacles: true,
resources: true,
newStory: true,
snapshot: "2–3 lines"
},
 buildPrompt({ input, messages }) {
  return `
User said:
"${input}"

Respond according to this module's purpose.
`;
}
