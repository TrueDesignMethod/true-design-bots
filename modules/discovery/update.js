// modules/discovery/update.js
export const update = {
stage: "discovery",
name: "UPDATE",
requiresPro: true,
tokenCeiling: 260,
prompt: ({ userInput }) => `You are guiding the user through Update in True Discovery.
Help them reframe or release outdated stories, goals, or identities that no longer fit who they are becoming.
Honor the past without clinging to it.
Do not push change.
End by inviting the user to name the story they want to carry forward.


User input:\n"${userInput}"`,
outputContract: {
oldStory: "1–2 bullets",
pastBenefit: "1 bullet",
newStories: "2–3 bullets",
choicePrompt: "1 question"
}
};
