// public/intakeFlow.js
// TRUE AI — Discovery Intake Flow


// --------------------------------------------------
// Purpose
// --------------------------------------------------
// Handles:
// - intake form extraction
// - lightweight validation
// - intake normalization
// - Discovery session preparation
//
// This file intentionally does NOT:
// - analyze participants
// - generate LifePrints
// - interpret psychology
//
// It only prepares structured intake data
// for the Discovery system.
// --------------------------------------------------


import {
  createSession
} from "/js/sessions.js";


// --------------------------------------------------
// Intake State
// --------------------------------------------------

let currentIntake = null;

let currentSession = null;


// --------------------------------------------------
// Initialize Intake Flow
// --------------------------------------------------

export function initIntakeFlow({

  formId = "discovery-intake-form",

  onComplete = null

} = {}) {

  const form =
    document.getElementById(formId);

  if (!form) {

    console.error(
      "TRUE AI intake form not found."
    );

    return;
  }


  form.addEventListener(

    "submit",

    async (event) => {

      event.preventDefault();


      // ------------------------------------------
      // Extract
      // ------------------------------------------
      const intake =
        extractIntakeData();


      // ------------------------------------------
      // Validate
      // ------------------------------------------
      const validation =
        validateIntake(intake);

      if (!validation.valid) {

        alert(validation.message);

        return;
      }


      // ------------------------------------------
      // Normalize
      // ------------------------------------------
      const normalized =
        normalizeIntake(intake);

      currentIntake =
        normalized;


      // ------------------------------------------
      // Create Session
      // ------------------------------------------
      currentSession =
        await createSession({

          title:
            generateSessionTitle(
              normalized
            ),

          phase:
            "TARGET"
        });


      // ------------------------------------------
      // Complete Callback
      // ------------------------------------------
      if (onComplete) {

        onComplete({

          intake:
            normalized,

          session:
            currentSession
        });
      }
    }
  );
}


// --------------------------------------------------
// Extract Intake
// --------------------------------------------------

export function extractIntakeData() {

  return {

    currentFocus:
      getFieldValue(
        "current-focus"
      ),

    desiredDirection:
      getFieldValue(
        "desired-direction"
      ),

    currentFriction:
      getFieldValue(
        "current-friction"
      ),

    supportiveStrengths:
      getFieldValue(
        "supportive-strengths"
      )
  };
}


// --------------------------------------------------
// Normalize Intake
// --------------------------------------------------

export function normalizeIntake(
  intake = {}
) {

  return {

    createdAt:
      new Date().toISOString(),

    discoveryPhase:
      "TARGET",

    participantInput: {

      currentFocus:
        sanitizeText(
          intake.currentFocus
        ),

      desiredDirection:
        sanitizeText(
          intake.desiredDirection
        ),

      currentFriction:
        sanitizeText(
          intake.currentFriction
        ),

      supportiveStrengths:
        sanitizeText(
          intake.supportiveStrengths
        )
    }
  };
}


// --------------------------------------------------
// Validate Intake
// --------------------------------------------------

export function validateIntake(
  intake = {}
) {

  const totalLength =

    (
      intake.currentFocus || ""
    ).trim().length +

    (
      intake.desiredDirection || ""
    ).trim().length +

    (
      intake.currentFriction || ""
    ).trim().length;


  // ----------------------------------------------
  // Minimal reflection requirement
  // ----------------------------------------------
  if (totalLength < 40) {

    return {

      valid: false,

      message:
`Please share a little more reflection before beginning Discovery.`
    };
  }


  return {
    valid: true
  };
}


// --------------------------------------------------
// Session Title Generator
// --------------------------------------------------

function generateSessionTitle(
  intake = {}
) {

  const focus =
    intake?.participantInput
      ?.currentFocus || "";

  if (!focus) {
    return "Discovery Session";
  }


  // ----------------------------------------------
  // Use first sentence fragment
  // ----------------------------------------------
  const cleaned =

    focus
      .split(".")[0]
      .trim()
      .slice(0, 42);

  return cleaned || "Discovery Session";
}


// --------------------------------------------------
// Helpers
// --------------------------------------------------

function getFieldValue(id) {

  const element =
    document.getElementById(id);

  return (
    element?.value || ""
  ).trim();
}


function sanitizeText(
  text = ""
) {

  return text

    .replace(/\s+/g, " ")

    .trim();
}


// --------------------------------------------------
// Get Current Intake
// --------------------------------------------------

export function getCurrentIntake() {
  return currentIntake;
}


// --------------------------------------------------
// Get Current Session
// --------------------------------------------------

export function getCurrentSession() {
  return currentSession;
}
