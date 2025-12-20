// modules/discovery/reflect.js
export const reflect = {
  stage: "discovery",
  name: "REFLECT",
  requiresPro: false,
  tokenCeiling: 280,
  prompt: ({ userInput }) => `You are guiding the user through Reflect in True Discovery.
Help them notice patterns in their behaviors, habits, and thinking without judgment.
Encourage insights to emerge naturally. Do not suggest plans or actions.
Invite them to notice what feels significant right now.

User input:\n"${userInput}"`,
  outputContract: {
    patternSummary: "2–3 sentences",
    insightBullets: "3–5 bullets",
    reflectionPrompt: "1 question"
  },
 buildPrompt({ input, messages }) {
  return `
User said:
"${input}"

Respond according to this module's purpose.
`;
}
