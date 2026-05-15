// core/lifeprint/narrativeAssembler.js
// TRUE AI — LifePrint Narrative Assembler

// --------------------------------------------------
// NARRATIVE ASSEMBLER
// --------------------------------------------------
// Purpose:
// Assemble all LifePrint sections into one
// coherent participant-facing narrative.
//
// This assembler is intentionally:
// - simple
// - readable
// - modular
// - presentation-focused
//
// It does NOT:
// - analyze participants
// - generate interpretation
// - create new insight
//
// Its only responsibility is:
// narrative organization + formatting.
// --------------------------------------------------


// --------------------------------------------------
// Main Narrative Assembler
// --------------------------------------------------
export async function narrativeAssembler({

  summary = {},

  strengths = {},

  friction = {},

  upgrades = {},

  momentum = {}

}) {

  // ----------------------------------------------
  // Build formatted narrative
  // ----------------------------------------------
  const assembledNarrative = `

# TRUE Discovery LifePrint

---

## ${summary.title || "Discovery Summary"}

${summary.narrative || ""}

---

## ${strengths.title || "Strength Architecture"}

${strengths.narrative || ""}

${renderHighlights(
  strengths.highlights,
  "Key Strength Themes"
)}

---

## ${friction.title || "Friction & Load Patterns"}

${friction.narrative || ""}

${renderHighlights(
  friction.highlights,
  "Key Friction Themes"
)}

---

## ${upgrades.title || "Upgrade Path"}

${upgrades.narrative || ""}

${renderList(
  upgrades.priorities,
  "Growth Priorities"
)}

${renderList(
  upgrades.experiments,
  "Supportive Experiments"
)}

---

## ${momentum.title || "Momentum Steps"}

${momentum.narrative || ""}

${renderList(
  momentum.steps,
  "Suggested Momentum Steps"
)}

${renderList(
  momentum.reminders,
  "Grounding Reminders"
)}

---

## Closing Reflection

Growth does not require becoming an entirely different person.

Often, meaningful change begins through:
- clearer awareness
- more sustainable pacing
- gentler honesty
- supportive boundaries
- reduced overload
- aligned movement

This LifePrint is not a final definition of who you are.

It is simply a reflective snapshot intended to help you better understand:
- what may currently support you
- what may currently strain you
- and what kinds of movement may feel more aligned and sustainable moving forward.

`;



  // ----------------------------------------------
  // Return structured narrative
  // ----------------------------------------------
  return {

    generatedAt:
      new Date().toISOString(),

    version:
      "TRUE_DISCOVERY_V1",

    narrative:
      assembledNarrative.trim()
  };
}


// --------------------------------------------------
// Render Bullet List
// --------------------------------------------------
function renderList(
  items = [],
  title = ""
) {

  if (!items || items.length === 0) {
    return "";
  }

  const formattedItems =
    items
      .map((item) => `- ${item}`)
      .join("\n");

  return `

### ${title}

${formattedItems}
`;
}


// --------------------------------------------------
// Render Highlights
// --------------------------------------------------
function renderHighlights(
  items = [],
  title = ""
) {

  if (!items || items.length === 0) {
    return "";
  }

  const formattedItems =
    items
      .slice(0, 6)
      .map((item) => `• ${item}`)
      .join("\n");

  return `

### ${title}

${formattedItems}
`;
}
