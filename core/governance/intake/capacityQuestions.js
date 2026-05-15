// core/intake/capacityQuestions.js
// TRUE AI — Capacity Reflection Questions

// --------------------------------------------------
// CAPACITY Questions
// --------------------------------------------------
// Purpose:
// Help participants recognize:
//
// - emotional bandwidth
// - cognitive load
// - recovery capacity
// - environmental strain
// - support availability
// - sustainability limits
//
// These questions are intentionally:
// - non-shaming
// - grounding
// - realistic
// - sustainability-oriented
//
// Capacity is NOT treated as:
// - worth
// - ambition
// - potential
//
// The goal is to help participants
// understand what they can realistically
// sustain right now.
// --------------------------------------------------


export const capacityQuestions = [

  // ----------------------------------------------
  // Emotional bandwidth
  // ----------------------------------------------
  {
    id: "emotional_bandwidth",

    category: "emotional_capacity",

    type: "scale",

    prompt:
      "How emotionally supported and resourced do you currently feel?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Very depleted",
      maxLabel: "Very supported"
    },

    required: true
  },


  // ----------------------------------------------
  // Cognitive load
  // ----------------------------------------------
  {
    id: "mental_load",

    category: "cognitive_load",

    type: "multi_select",

    prompt:
      "What currently occupies most of your mental energy?",

    options: [
      "Financial stress",
      "Caretaking responsibilities",
      "Work demands",
      "Emotional stress",
      "Relationship tension",
      "Uncertainty about the future",
      "Health concerns",
      "Decision fatigue",
      "Constant responsibility",
      "Academic pressure",
      "Family expectations",
      "Burnout",
      "Lack of rest",
      "Feeling behind in life",
      "Trying to hold everything together"
    ],

    maxSelections: 5,

    required: true
  },


  // ----------------------------------------------
  // Recovery ability
  // ----------------------------------------------
  {
    id: "recovery_patterns",

    category: "recovery",

    type: "long_text",

    prompt:
      "What currently helps you recover emotionally, mentally, or physically when life becomes heavy?",

    placeholder:
      "This could include rest, solitude, relationships, creativity, movement, spirituality, routines, or anything else that helps restore you.",

    required: false
  },


  // ----------------------------------------------
  // Rest sustainability
  // ----------------------------------------------
  {
    id: "rest_sufficiency",

    category: "rest",

    type: "scale",

    prompt:
      "How sustainable does your current pace of life feel?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Completely unsustainable",
      maxLabel: "Very sustainable"
    },

    required: true
  },


  // ----------------------------------------------
  // Support systems
  // ----------------------------------------------
  {
    id: "support_systems",

    category: "support",

    type: "multi_select",

    prompt:
      "Which forms of support feel genuinely available to you right now?",

    options: [
      "Emotional support",
      "Practical support",
      "Financial support",
      "Community",
      "Friendships",
      "Family support",
      "Mentorship",
      "Professional support",
      "Faith or spiritual support",
      "Personal solitude",
      "Healthy routines",
      "Very little support currently"
    ],

    maxSelections: 5,

    required: false
  },


  // ----------------------------------------------
  // Overextension awareness
  // ----------------------------------------------
  {
    id: "overextension_patterns",

    category: "overload",

    type: "long_text",

    prompt:
      "Where do you feel most overextended, stretched thin, or emotionally overloaded right now?",

    placeholder:
      "This may involve work, relationships, caregiving, expectations, emotional labor, or internal pressure.",

    required: true
  },


  // ----------------------------------------------
  // Time pressure
  // ----------------------------------------------
  {
    id: "time_pressure",

    category: "time_capacity",

    type: "scale",

    prompt:
      "How much spaciousness do you currently feel in your life?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "No spaciousness",
      maxLabel: "A healthy sense of space"
    },

    required: true
  },


  // ----------------------------------------------
  // Environmental strain
  // ----------------------------------------------
  {
    id: "environmental_strain",

    category: "environment",

    type: "multi_select",

    prompt:
      "Which external conditions are affecting your capacity most right now?",

    options: [
      "Financial instability",
      "Work environment",
      "Family dynamics",
      "Health challenges",
      "Lack of privacy",
      "Unpredictability",
      "Relationship stress",
      "Living situation",
      "Lack of support",
      "Overstimulation",
      "Community isolation",
      "Transportation or logistics",
      "Excessive responsibility"
    ],

    maxSelections: 4,

    required: false
  },


  // ----------------------------------------------
  // Capacity honesty
  // ----------------------------------------------
  {
    id: "capacity_honesty",

    category: "self_awareness",

    type: "long_text",

    prompt:
      "What do you think your current capacity realistically allows for right now?",

    placeholder:
      "This is not about limitation or failure. It is about honest awareness of what feels sustainable in this season of life.",

    required: false
  },


  // ----------------------------------------------
  // Load reduction awareness
  // ----------------------------------------------
  {
    id: "load_reduction",

    category: "load",

    type: "long_text",

    prompt:
      "If one responsibility, expectation, or pressure became lighter, what would create the biggest sense of relief?",

    placeholder:
      "You do not need to know how to change it yet. Simply notice what feels heaviest.",

    required: false
  }
];


// --------------------------------------------------
// Optional Helper
// --------------------------------------------------
export function getCapacityQuestionById(id) {

  return capacityQuestions.find(
    (question) => question.id === id
  );
}
