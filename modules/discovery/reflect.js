// modules/discovery/reflect.js
export const reflect = {
stage: "discovery",
name: "REFLECT",
requiresPro: false,
tokenCeiling: 320,
prompt: ({ userInput }) => `You are guiding the user through Reflect in True Discovery.
Help them examine their current life context, emotional patterns, beliefs, strengths, and friction points.
Name patterns gently and neutrally.
Do not offer solutions or action steps.
End with reflective questions that deepen awareness, not urgency.


User input:\n"${userInput}"`,
outputContract: {
acknowledge: "1–2 lines",
strengths: "2–3 bullets",
patterns: "2–4 bullets",
questions: "1–2 questions"
}
};
