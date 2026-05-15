// core/intake/targetQuestions.js
// TRUE AI — TARGET Intake Questions

// --------------------------------------------------
// TARGET Questions
// --------------------------------------------------
// Purpose:
// Help participants clarify:
//
// - values
// - direction
// - desired future
// - fulfillment
// - motivations
// - priorities
//
// These questions are intentionally:
// - reflective
// - non-performative
// - non-judgmental
// - open-ended
//
// The goal is clarity,
// not optimization.
// --------------------------------------------------


export const targetQuestions = [

  // ----------------------------------------------
  // Direction
  // ----------------------------------------------
  {
    id: "desired_future",

    category: "direction",

    type: "long_text",

    prompt:
      "What kind of life are you trying to create for yourself?",

    placeholder:
      "Describe the kind of life that feels meaningful, sustainable, or aligned to you.",

    required: true
  },


  // ----------------------------------------------
  // Fulfillment
  // ----------------------------------------------
  {
    id: "fulfillment_definition",

    category: "fulfillment",

    type: "long_text",

    prompt:
      "What does fulfillment currently mean to you?",

    placeholder:
      "This could include relationships, peace, contribution, creativity, stability, freedom, growth, or something else entirely.",

    required: true
  },


  // ----------------------------------------------
  // Values
  // ----------------------------------------------
  {
    id: "core_values",

    category: "values",

    type: "multi_select",

    prompt:
      "Which values feel most important to you right now?",

    options: [
      "Stability",
      "Freedom",
      "Peace",
      "Contribution",
      "Creativity",
      "Growth",
      "Security",
      "Connection",
      "Purpose",
      "Independence",
      "Belonging",
      "Adventure",
      "Faith",
      "Family",
      "Learning",
      "Recognition",
      "Rest",
      "Service",
      "Leadership",
      "Authenticity"
    ],

    maxSelections: 5,

    required: true
  },


  // ----------------------------------------------
  // Expansion
  // ----------------------------------------------
  {
    id: "desired_more",

    category: "expansion",

    type: "long_text",

    prompt:
      "What would you like more of in your life?",

    placeholder:
      "This could include emotional states, experiences, relationships, opportunities, or ways of living.",

    required: false
  },


  // ----------------------------------------------
  // Reduction
  // ----------------------------------------------
  {
    id: "desired_less",

    category: "reduction",

    type: "long_text",

    prompt:
      "What would you like less of in your life?",

    placeholder:
      "This could include pressure, confusion, overwhelm, conflict, obligation, instability, or anything else that feels draining.",

    required: false
  },


  // ----------------------------------------------
  // Internal motivation
  // ----------------------------------------------
  {
    id: "motivation_source",

    category: "motivation",

    type: "long_text",

    prompt:
      "What motivates you to pursue change or growth right now?",

    placeholder:
      "You do not need a perfect answer. This is about noticing what feels meaningful or important to you.",

    required: false
  },


  // ----------------------------------------------
  // Identity alignment
  // ----------------------------------------------
  {
    id: "identity_alignment",

    category: "identity",

    type: "scale",

    prompt:
      "How aligned does your current life feel with who you believe you are becoming?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Not aligned",
      maxLabel: "Deeply aligned"
    },

    required: true
  },


  // ----------------------------------------------
  // Desired emotional state
  // ----------------------------------------------
  {
    id: "desired_emotional_state",

    category: "emotional_direction",

    type: "multi_select",

    prompt:
      "Which emotional states would you like to experience more consistently?",

    options: [
      "Calm",
      "Confidence",
      "Purpose",
      "Joy",
      "Security",
      "Clarity",
      "Peace",
      "Energy",
      "Focus",
      "Connection",
      "Self-trust",
      "Hope",
      "Freedom",
      "Belonging",
      "Stability"
    ],

    maxSelections: 4,

    required: false
  },


  // ----------------------------------------------
  // Future tension
  // ----------------------------------------------
  {
    id: "future_tension",

    category: "tension",

    type: "long_text",

    prompt:
      "What feels most uncertain or difficult about moving toward the life you want?",

    placeholder:
      "This could include fears, limitations, responsibilities, uncertainty, or internal tension.",

    required: false
  }
];


// --------------------------------------------------
// Optional Helper
// --------------------------------------------------
export function getTargetQuestionById(id) {

  return targetQuestions.find(
    (question) => question.id === id
  );
}
