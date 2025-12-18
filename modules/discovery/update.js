// modules/discovery/update.js
export const update = {
  stage: "discovery",
  name: "UPDATE",
  requiresPro: false,
  tokenCeiling: 280,
  prompt: ({ userInput }) => `You are guiding the user through Update in True Discovery.
Help them reframe thoughts, tensions, or challenges they are noticing.
Encourage gentle shifts in perspective without prescribing solutions.
End by inviting the user to notice any new clarity or insights.

User input:\n"${userInput}"`,
  outputContract: {
    reframedThoughts: "2–4 bullets",
    insightSummary: "1–2 sentences",
    reflectionQuestion: "1 question"
  },
  buildPrompt({ input, messages }) {
    return this.prompt({ userInput: input });
  }
};
