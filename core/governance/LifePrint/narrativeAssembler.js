// core/lifeprint/narrativeAssembler.js

import { printableTemplate }
  from "./templates/printableTemplate.js";


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

  const narrative =
    printableTemplate({

      summary,

      strengths,

      friction,

      upgrades,

      momentum
    });


  return {

    generatedAt:
      new Date().toISOString(),

    version:
      "TRUE_DISCOVERY_V1",

    narrative:
      narrative.trim()
  };
}
