// api/discovery/generateLifePrint.js
// TRUE AI — LifePrint Generator

import { generateSummary }
  from "../../core/lifeprint/generateSummary.js";

import { generateStrengths }
  from "../../core/lifeprint/generateStrengths.js";

import { generateFriction }
  from "../../core/lifeprint/generateFriction.js";

import { generateUpgradePath }
  from "../../core/lifeprint/generateUpgradePath.js";

import { generateMomentumSteps }
  from "../../core/lifeprint/generateMomentumSteps.js";

import { narrativeAssembler }
  from "../../core/lifeprint/narrativeAssembler.js";


// --------------------------------------------------
// Generate Complete LifePrint
// --------------------------------------------------
export async function generateLifePrint({

  participantProfile = {},

  synthesis = {},

  strengths = {},

  friction = {},

  contradictions = {},

  upgrades = {},

  capacity = {},

  llm
}) {

  // ------------------------------------------------
  // Generate sections
  // ------------------------------------------------
  const summary =
    await generateSummary({
      participantProfile,
      synthesis,
      llm
    });


  const strengthsSection =
    await generateStrengths({
      strengths,
      participantProfile,
      llm
    });


  const frictionSection =
    await generateFriction({
      friction,
      contradictions,
      capacity,
      llm
    });


  const upgradeSection =
    await generateUpgradePath({
      upgrades,
      strengths,
      friction,
      llm
    });


  const momentumSection =
    await generateMomentumSteps({
      synthesis,
      upgrades,
      capacity,
      llm
    });


  // ------------------------------------------------
  // Assemble final LifePrint
  // ------------------------------------------------
  const assembledLifePrint =
    await narrativeAssembler({

      summary,

      strengths: strengthsSection,

      friction: frictionSection,

      upgrades: upgradeSection,

      momentum: momentumSection
    });


  // ------------------------------------------------
  // Metadata
  // ------------------------------------------------
  const metadata = {
    generatedAt: new Date().toISOString(),

    version: "1.0.0",

    framework: "TRUE Discovery"
  };


  // ------------------------------------------------
  // Final Return Object
  // ------------------------------------------------
  return {

    metadata,

    sections: {

      summary,

      strengths: strengthsSection,

      friction: frictionSection,

      upgrades: upgradeSection,

      momentum: momentumSection
    },

    fullNarrative: assembledLifePrint
  };
}
