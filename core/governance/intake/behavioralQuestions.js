// core/intake/behavioralQuestions.js
// TRUE AI — Behavioral Reflection Questions

// --------------------------------------------------
// BEHAVIORAL Questions
// --------------------------------------------------
// Purpose:
// Help participants recognize:
//
// - behavioral tendencies
// - coping patterns
// - consistency patterns
// - stress responses
// - decision tendencies
// - relational habits
// - behavioral friction
//
// These questions are NOT intended to:
// - diagnose
// - label
// - categorize personality
//
// They exist to support:
// awareness + alignment.
//
// The focus is pattern recognition,
// not judgment.
// --------------------------------------------------


export const behavioralQuestions = [

  // ----------------------------------------------
  // Consistency
  // ----------------------------------------------
  {
    id: "follow_through_patterns",

    category: "consistency",

    type: "scale",

    prompt:
      "How consistently do you follow through on things that genuinely matter to you?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Very inconsistently",
      maxLabel: "Very consistently"
    },

    required: true
  },


  // ----------------------------------------------
  // Decision-making
  // ----------------------------------------------
  {
    id: "decision_patterns",

    category: "decision_making",

    type: "multi_select",

    prompt:
      "When making important decisions, what do you tend to struggle with most?",

    options: [
      "Fear of making the wrong choice",
      "Overthinking",
      "Seeking too much external validation",
      "Avoiding decisions entirely",
      "Acting too quickly",
      "Feeling emotionally overwhelmed",
      "Trying to satisfy everyone",
      "Second-guessing myself",
      "Difficulty prioritizing",
      "Fear of disappointing others"
    ],

    maxSelections: 3,

    required: false
  },


  // ----------------------------------------------
  // Stress response
  // ----------------------------------------------
  {
    id: "stress_response",

    category: "stress_patterns",

    type: "multi_select",

    prompt:
      "When under stress or pressure, what responses feel most familiar to you?",

    options: [
      "Withdrawal",
      "Overworking",
      "People-pleasing",
      "Emotional shutdown",
      "Overcommitting",
      "Avoidance",
      "Perfectionism",
      "Irritability",
      "Difficulty resting",
      "Escapism",
      "Overthinking",
      "Loss of motivation",
      "Trying to control everything"
    ],

    maxSelections: 4,

    required: true
  },


  // ----------------------------------------------
  // Boundaries
  // ----------------------------------------------
  {
    id: "boundary_patterns",

    category: "boundaries",

    type: "scale",

    prompt:
      "How comfortable are you setting boundaries that protect your energy, time, or well-being?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Very uncomfortable",
      maxLabel: "Very comfortable"
    },

    required: true
  },


  // ----------------------------------------------
  // Behavioral awareness
  // ----------------------------------------------
  {
    id: "behavioral_awareness",

    category: "self_awareness",

    type: "long_text",

    prompt:
      "Are there any behaviors or habits you feel are no longer serving you?",

    placeholder:
      "This could include reactions, routines, coping strategies, communication patterns, or ways of responding to pressure.",

    required: false
  },


  // ----------------------------------------------
  // Relational tendencies
  // ----------------------------------------------
  {
    id: "relational_patterns",

    category: "relationships",

    type: "multi_select",

    prompt:
      "Which relational patterns feel most familiar to you?",

    options: [
      "Taking on too much responsibility",
      "Avoiding conflict",
      "Difficulty asking for help",
      "Over-accommodating others",
      "Keeping emotions private",
      "Trying to fix problems for others",
      "Fear of disappointing people",
      "Difficulty trusting others",
      "Feeling responsible for others' emotions",
      "Difficulty expressing needs"
    ],

    maxSelections: 4,

    required: false
  },


  // ----------------------------------------------
  // Rest patterns
  // ----------------------------------------------
  {
    id: "rest_patterns",

    category: "rest",

    type: "scale",

    prompt:
      "How easy is it for you to rest without guilt or pressure to stay productive?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Very difficult",
      maxLabel: "Very easy"
    },

    required: true
  },


  // ----------------------------------------------
  // Adaptability
  // ----------------------------------------------
  {
    id: "adaptability_patterns",

    category: "adaptability",

    type: "long_text",

    prompt:
      "How do you typically respond when life changes unexpectedly?",

    placeholder:
      "You may notice emotional responses, coping strategies, thought patterns, or behavioral shifts.",

    required: false
  },


  // ----------------------------------------------
  // Internal pressure
  // ----------------------------------------------
  {
    id: "internal_pressure",

    category: "pressure",

    type: "multi_select",

    prompt:
      "Which internal pressures do you experience most often?",

    options: [
      "Needing to do more",
      "Fear of falling behind",
      "Fear of failure",
      "Pressure to appear capable",
      "Pressure to be productive",
      "Pressure to stay in control",
      "Pressure to help everyone",
      "Pressure to meet expectations",
      "Pressure to succeed quickly",
      "Pressure to avoid mistakes"
    ],

    maxSelections: 4,

    required: false
  },


  // ----------------------------------------------
  // Behavioral reflection
  // ----------------------------------------------
  {
    id: "behavioral_growth",

    category: "growth",

    type: "long_text",

    prompt:
      "What behavioral changes do you think would create the most meaningful improvement in your life right now?",

    placeholder:
      "You do not need a perfect answer. Focus on what feels honest or noticeable.",

    required: false
  }
];


// --------------------------------------------------
// Optional Helper
// --------------------------------------------------
export function getBehavioralQuestionById(id) {

  return behavioralQuestions.find(
    (question) => question.id === id
  );
}
