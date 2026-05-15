// public/lifeprintRenderer.js
// TRUE AI — LifePrint Renderer


// --------------------------------------------------
// Purpose
// --------------------------------------------------
// Handles rendering completed LifePrint data
// into the LifePrint UI.
//
// This renderer intentionally:
// - focuses only on presentation
// - does NOT analyze participants
// - does NOT generate interpretation
//
// Responsibilities:
// - populate HTML sections
// - render highlights
// - render momentum cards
// - render metadata
// --------------------------------------------------


// --------------------------------------------------
// Main Renderer
// --------------------------------------------------

export function renderLifePrint({

  summary = {},

  strengths = {},

  friction = {},

  upgrades = {},

  momentum = {}

} = {}) {

  renderSummary(summary);

  renderStrengths(strengths);

  renderFriction(friction);

  renderUpgrades(upgrades);

  renderMomentum(momentum);
}


// --------------------------------------------------
// Summary
// --------------------------------------------------

function renderSummary(
  summary = {}
) {

  setText(

    "summary-title",

    summary.title ||

    "Current Alignment Landscape"
  );

  setHTML(

    "summary-body",

    formatNarrative(
      summary.narrative
    )
  );
}


// --------------------------------------------------
// Strengths
// --------------------------------------------------

function renderStrengths(
  strengths = {}
) {

  setText(

    "strengths-title",

    strengths.title ||

    "Supportive Internal Resources"
  );

  setHTML(

    "strengths-body",

    formatNarrative(
      strengths.narrative
    )
  );

  renderHighlights({

    containerId:
      "strengths-highlights",

    items:
      strengths.highlights || []
  });
}


// --------------------------------------------------
// Friction
// --------------------------------------------------

function renderFriction(
  friction = {}
) {

  setText(

    "friction-title",

    friction.title ||

    "Sustainability & Emotional Load"
  );

  setHTML(

    "friction-body",

    formatNarrative(
      friction.narrative
    )
  );

  renderHighlights({

    containerId:
      "friction-highlights",

    items:
      friction.highlights || []
  });
}


// --------------------------------------------------
// Upgrades
// --------------------------------------------------

function renderUpgrades(
  upgrades = {}
) {

  setText(

    "upgrade-title",

    upgrades.title ||

    "Sustainable Movement Opportunities"
  );

  setHTML(

    "upgrade-body",

    formatNarrative(
      upgrades.narrative
    )
  );

  renderHighlights({

    containerId:
      "upgrade-highlights",

    items:
      upgrades.priorities || []
  });
}


// --------------------------------------------------
// Momentum
// --------------------------------------------------

function renderMomentum(
  momentum = {}
) {

  const container =
    document.getElementById(
      "momentum-grid"
    );

  if (!container) return;

  container.innerHTML = "";


  const steps =
    momentum.steps || [];


  steps.forEach((step) => {

    const card =
      document.createElement("div");

    card.className =
      "momentum-card";

    card.innerHTML = `

      <h3>
        ${escapeHTML(
          step.title || "Momentum Step"
        )}
      </h3>

      <p>
        ${escapeHTML(
          step.description || ""
        )}
      </p>

    `;

    container.appendChild(card);
  });
}


// --------------------------------------------------
// Render Highlight Pills
// --------------------------------------------------

function renderHighlights({

  containerId,

  items = []

}) {

  const container =
    document.getElementById(
      containerId
    );

  if (!container) return;

  container.innerHTML = "";


  items.forEach((item) => {

    const el =
      document.createElement("div");

    el.className =
      "highlight-item";

    el.textContent =
      item;

    container.appendChild(el);
  });
}


// --------------------------------------------------
// Format Narrative
// --------------------------------------------------

function formatNarrative(
  narrative = ""
) {

  if (!narrative) return "";

  return narrative

    .split("\n\n")

    .map((paragraph) => `

      <p>
        ${escapeHTML(paragraph)}
      </p>

    `)

    .join("");
}


// --------------------------------------------------
// Set Text
// --------------------------------------------------

function setText(
  id,
  value
) {

  const element =
    document.getElementById(id);

  if (!element) return;

  element.textContent =
    value;
}


// --------------------------------------------------
// Set HTML
// --------------------------------------------------

function setHTML(
  id,
  value
) {

  const element =
    document.getElementById(id);

  if (!element) return;

  element.innerHTML =
    value;
}


// --------------------------------------------------
// Escape HTML
// --------------------------------------------------

function escapeHTML(
  value = ""
) {

  return value

    .replace(/&/g, "&amp;")

    .replace(/</g, "&lt;")

    .replace(/>/g, "&gt;")

    .replace(/\"/g, "&quot;")

    .replace(/'/g, "&#039;");
}
