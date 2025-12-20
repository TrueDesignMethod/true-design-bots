// modules/discovery/target.js
export const target = {
  stage: "discovery",
  name: "TARGET",
  requiresPro: false,
  tokenCeiling: 280,
  prompt: ({ userInput }) => `You are guiding the user through Target in True Discovery.
Help them identify what truly matters to them — values, desires, motivations — without turning anything into a plan.
Reflect their language back, offer gentle prompts, and allow clarity to emerge.
Do not prescribe action. Do not optimize.
End by inviting them to notice what feels most resonant right now.

User input:\n"${userInput}"`,
  outputContract: {
    reflection: "1–2 sentences",
    valuePrompts: "5–7 bullets",
    resonanceQuestion: "1 question"
  },
  buildPrompt({ input, messages }) {
  return `
User said:
"${input}"

Respond according to this module's purpose.
`;
}
