// core/intake/valuesQuestions.js
// TRUE AI — Values Reflection Questions

// --------------------------------------------------
// VALUES Questions
// --------------------------------------------------
// Purpose:
// Help participants clarify:
//
// - core values
// - internal priorities
// - sources of meaning
// - alignment tensions
// - inherited expectations
// - authentic direction
//
// These questions are intentionally:
// - reflective
// - non-performative
// - emotionally safe
// - identity-aware
//
// The goal is not to create
// rigid identity labels.
//
// The goal is to help participants
// better understand what genuinely
// matters to them.
// --------------------------------------------------


export const valuesQuestions = [

  // ----------------------------------------------
  // Core values selection
  // ----------------------------------------------
  {
    id: "core_values_selection",

    category: "core_values",

    type: "multi_select",

    prompt:
      "Which values currently feel most important to you?",

    options: [
      "Peace",
      "Freedom",
      "Security",
      "Stability",
      "Growth",
      "Contribution",
      "Creativity",
      "Authenticity",
      "Belonging",
      "Connection",
      "Family",
      "Faith",
      "Service",
      "Leadership",
      "Recognition",
      "Learning",
      "Rest",
      "Adventure",
      "Purpose",
      "Independence",
      "Compassion",
      "Integrity",
      "Curiosity",
      "Joy",
      "Wisdom"
    ],

    maxSelections: 6,

    required: true
  },


  // ----------------------------------------------
  // Meaning reflection
  // ----------------------------------------------
  {
    id: "meaning_sources",

    category: "meaning",

    type: "long_text",

    prompt:
      "What experiences, environments, or moments tend to make life feel most meaningful to you?",

    placeholder:
      "This could involve relationships, contribution, solitude, creativity, learning, spirituality, stability, nature, or something else entirely.",

    required: true
  },


  // ----------------------------------------------
  // Misalignment awareness
  // ----------------------------------------------
  {
    id: "value_misalignment",

    category: "alignment",

    type: "long_text",

    prompt:
      "Are there areas of your life that feel out of alignment with your values right now?",

    placeholder:
      "You may notice tension between what matters to you and how your time, energy, or responsibilities are currently structured.",

    required: false
  },


  // ----------------------------------------------
  // Inherited expectations
  // ----------------------------------------------
  {
    id: "inherited_expectations",

    category: "conditioning",

    type: "long_text",

    prompt:
      "Are there expectations, roles, or beliefs you feel you may have inherited rather than intentionally chosen?",

    placeholder:
      "These may come from family, culture, work, religion, relationships, or past experiences.",

    required: false
  },


  // ----------------------------------------------
  // Priority conflict
  // ----------------------------------------------
  {
    id: "priority_conflict",

    category: "tension",

    type: "multi_select",

    prompt:
      "Which tensions or conflicts feel most present in your life right now?",

    options: [
      "Stability vs freedom",
      "Rest vs productivity",
      "Security vs risk",
      "Responsibility vs personal fulfillment",
      "Belonging vs authenticity",
      "Service vs self-preservation",
      "Growth vs exhaustion",
      "Peace vs ambition",
      "Safety vs change",
      "Achievement vs sustainability",
      "External expectations vs internal truth"
    ],

    maxSelections: 3,

    required: false
  },


  // ----------------------------------------------
  // Internal resonance
  // ----------------------------------------------
  {
    id: "internal_resonance",

    category: "self_alignment",

    type: "scale",

    prompt:
      "How connected do you currently feel to your own inner priorities and values?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Very disconnected",
      maxLabel: "Deeply connected"
    },

    required: true
  },


  // ----------------------------------------------
  // Fulfillment awareness
  // ----------------------------------------------
  {
    id: "fulfillment_awareness",

    category: "fulfillment",

    type: "long_text",

    prompt:
      "What does a deeply fulfilling life look like to you beyond achievement or external success?",

    placeholder:
      "Focus less on status or productivity and more on what would feel emotionally meaningful, sustainable, or deeply aligned.",

    required: true
  },


  // ----------------------------------------------
  // Value expression
  // ----------------------------------------------
  {
    id: "value_expression",

    category: "expression",

    type: "long_text",

    prompt:
      "In what areas of your life do you currently feel most able to live in alignment with your values?",

    placeholder:
      "This may involve relationships, work, creativity, spirituality, routines, community, or personal choices.",

    required: false
  },


  // ----------------------------------------------
  // Unlived values
  // ----------------------------------------------
  {
    id: "unlived_values",

    category: "suppression",

    type: "long_text",

    prompt:
      "Are there values, desires, or parts of yourself you feel have been neglected, minimized, or set aside?",

    placeholder:
      "You do not need to fix or change anything right now. Simply notice what feels absent or underexpressed.",

    required: false
  },


  // ----------------------------------------------
  // Direction awareness
  // ----------------------------------------------
  {
    id: "direction_alignment",

    category: "direction",

    type: "scale",

    prompt:
      "How aligned does your current direction in life feel with what matters most to you?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Not aligned at all",
      maxLabel: "Strongly aligned"
    },

    required: true
  }
];


// --------------------------------------------------
// Optional Helper
// --------------------------------------------------
export function getValuesQuestionById(id) {

  return valuesQuestions.find(
    (question) => question.id === id
  );
}
