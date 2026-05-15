// api/chat/router.js
// TRUE AI — Discovery State Router

const STATES = {
  TARGET: "target",
  REFLECT: "reflect",
  UPGRADE: "upgrade"
};


// ----------------------------------
// Detect Discovery State
// ----------------------------------
export function resolveDiscoveryState({
  input = "",
  sessionState = {},
  participantProfile = {}
}) {

  const text = input.toLowerCase();

  // ----------------------------------
  // TARGET indicators
  // ----------------------------------
  const targetSignals = [
    "i want",
    "my goal",
    "i hope",
    "i wish",
    "i dream",
    "i'm trying",
    "i value",
    "my future",
    "i need direction",
    "what do i want"
  ];

  // ----------------------------------
  // REFLECT indicators
  // ----------------------------------
  const reflectSignals = [
    "i feel stuck",
    "i keep",
    "i struggle",
    "i always",
    "i never",
    "i'm overwhelmed",
    "i'm exhausted",
    "i don't know why",
    "i feel disconnected",
    "something feels off"
  ];

  // ----------------------------------
  // UPGRADE indicators
  // ----------------------------------
  const upgradeSignals = [
    "how do i change",
    "what should i do",
    "how can i improve",
    "next step",
    "move forward",
    "what needs to change",
    "how do i start",
    "what can i work on"
  ];


  // ----------------------------------
  // Count signal matches
  // ----------------------------------
  const targetScore = countSignals(text, targetSignals);

  const reflectScore = countSignals(text, reflectSignals);

  const upgradeScore = countSignals(text, upgradeSignals);


  // ----------------------------------
  // Existing session continuity
  // ----------------------------------
  const previousState =
    sessionState.discoveryState || null;


  // ----------------------------------
  // Preserve conversational continuity
  // ----------------------------------
  if (
    previousState &&
    Math.max(targetScore, reflectScore, upgradeScore) === 0
  ) {
    return previousState;
  }


  // ----------------------------------
  // Resolve dominant state
  // ----------------------------------
  const highest = Math.max(
    targetScore,
    reflectScore,
    upgradeScore
  );

  if (highest === 0) {
    return STATES.REFLECT;
  }

  if (highest === targetScore) {
    return STATES.TARGET;
  }

  if (highest === upgradeScore) {
    return STATES.UPGRADE;
  }

  return STATES.REFLECT;
}


// ----------------------------------
// Utility
// ----------------------------------
function countSignals(text, signals) {
  return signals.reduce((count, signal) => {
    return text.includes(signal)
      ? count + 1
      : count;
  }, 0);
}


export { STATES };
