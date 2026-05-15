// core/governance/resolveDiscoveryState.js
// TRUE AI — Discovery State Resolution

export const DISCOVERY_STATES = {
  TARGET: "target",
  REFLECT: "reflect",
  UPGRADE: "upgrade"
};


// --------------------------------------------------
// Resolve Discovery State
// --------------------------------------------------
export function resolveDiscoveryState({

  input = "",

  sessionState = {},

  participantProfile = {}

}) {

  const normalizedInput =
    input.toLowerCase().trim();


  // ------------------------------------------------
  // Previous conversational continuity
  // ------------------------------------------------
  const previousState =
    sessionState.discoveryState || null;


  // ------------------------------------------------
  // TARGET signals
  // ------------------------------------------------
  const targetSignals = [
    "i want",
    "i hope",
    "i dream",
    "my goal",
    "my future",
    "i value",
    "i care about",
    "i wish",
    "i'm trying to",
    "i want my life",
    "i need direction",
    "what do i want",
    "what matters to me"
  ];


  // ------------------------------------------------
  // REFLECT signals
  // ------------------------------------------------
  const reflectSignals = [
    "i feel stuck",
    "i keep",
    "i struggle",
    "i always",
    "i never",
    "i'm overwhelmed",
    "i feel exhausted",
    "i don't know why",
    "something feels off",
    "i feel disconnected",
    "i'm burned out",
    "i feel lost",
    "i don't feel aligned"
  ];


  // ------------------------------------------------
  // UPGRADE signals
  // ------------------------------------------------
  const upgradeSignals = [
    "how do i change",
    "what should i do",
    "how do i improve",
    "what can i work on",
    "how do i move forward",
    "next step",
    "how do i start",
    "what needs to change",
    "what should change",
    "how can i grow",
    "how can i improve"
  ];


  // ------------------------------------------------
  // Count signals
  // ------------------------------------------------
  const targetScore =
    countSignals(
      normalizedInput,
      targetSignals
    );

  const reflectScore =
    countSignals(
      normalizedInput,
      reflectSignals
    );

  const upgradeScore =
    countSignals(
      normalizedInput,
      upgradeSignals
    );


  // ------------------------------------------------
  // Preserve continuity when unclear
  // ------------------------------------------------
  const highestScore = Math.max(
    targetScore,
    reflectScore,
    upgradeScore
  );


  // If no strong signals exist,
  // preserve current state if available
  if (highestScore === 0 && previousState) {
    return previousState;
  }


  // ------------------------------------------------
  // Default reflective state
  // ------------------------------------------------
  if (highestScore === 0) {
    return DISCOVERY_STATES.REFLECT;
  }


  // ------------------------------------------------
  // Resolve dominant state
  // ------------------------------------------------
  if (highestScore === targetScore) {
    return DISCOVERY_STATES.TARGET;
  }

  if (highestScore === upgradeScore) {
    return DISCOVERY_STATES.UPGRADE;
  }

  return DISCOVERY_STATES.REFLECT;
}


// --------------------------------------------------
// Utility — Count signal matches
// --------------------------------------------------
function countSignals(
  text,
  signals = []
) {

  return signals.reduce(
    (count, signal) => {

      if (text.includes(signal)) {
        return count + 1;
      }

      return count;

    },
    0
  );
}
