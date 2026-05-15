// core/intake/reflectQuestions.js
// TRUE AI — REFLECT Intake Questions

// --------------------------------------------------
// REFLECT Questions
// --------------------------------------------------
// Purpose:
// Help participants examine:
//
// - current reality
// - emotional patterns
// - friction
// - overwhelm
// - recurring experiences
// - behavioral tendencies
// - alignment gaps
//
// These questions are intentionally:
// - reflective
// - emotionally safe
// - non-shaming
// - grounded in awareness
//
// The goal is not self-criticism.
// The goal is clarity.
// --------------------------------------------------


export const reflectQuestions = [

  // ----------------------------------------------
  // Current emotional state
  // ----------------------------------------------
  {
    id: "current_emotional_state",

    category: "emotional_awareness",

    type: "multi_select",

    prompt:
      "Which emotional states have felt most present in your life recently?",

    options: [
      "Overwhelmed",
      "Disconnected",
      "Calm",
      "Hopeful",
      "Restless",
      "Focused",
      "Anxious",
      "Motivated",
      "Exhausted",
      "Confused",
      "Grounded",
      "Frustrated",
      "Stuck",
      "Content",
      "Uncertain",
      "Resentful",
      "Inspired",
      "Emotionally numb"
    ],

    maxSelections: 5,

    required: true
  },


  // ----------------------------------------------
  // Current friction
  // ----------------------------------------------
  {
    id: "current_friction",

    category: "friction",

    type: "long_text",

    prompt:
      "What currently feels most difficult, draining, or misaligned in your life?",

    placeholder:
      "This could involve responsibilities, relationships, expectations, emotional patterns, environments, or internal tension.",

    required: true
  },


  // ----------------------------------------------
  // Recurring patterns
  // ----------------------------------------------
  {
    id: "recurring_patterns",

    category: "patterns",

    type: "long_text",

    prompt:
      "Are there any patterns or experiences that seem to repeat in your life?",

    placeholder:
      "You may notice recurring emotions, habits, conflicts, reactions, cycles, or ways of responding to pressure.",

    required: false
  },


  // ----------------------------------------------
  // Energy awareness
  // ----------------------------------------------
  {
    id: "energy_drain",

    category: "capacity",

    type: "multi_select",

    prompt:
      "What tends to drain your energy most consistently?",

    options: [
      "Overcommitment",
      "Conflict",
      "Uncertainty",
      "People-pleasing",
      "Financial stress",
      "Decision fatigue",
      "Lack of structure",
      "Isolation",
      "Constant responsibility",
      "Workload",
      "Emotional labor",
      "Lack of rest",
      "Caretaking",
      "Perfectionism",
      "Unclear expectations"
    ],

    maxSelections: 4,

    required: false
  },


  // ----------------------------------------------
  // Alignment awareness
  // ----------------------------------------------
  {
    id: "alignment_gap",

    category: "alignment",

    type: "scale",

    prompt:
      "How aligned does your current life feel with your deeper values and priorities?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Deeply misaligned",
      maxLabel: "Strongly aligned"
    },

    required: true
  },


  // ----------------------------------------------
  // Strength awareness
  // ----------------------------------------------
  {
    id: "current_strengths",

    category: "strengths",

    type: "long_text",

    prompt:
      "What strengths or qualities have helped you navigate difficult seasons in the past?",

    placeholder:
      "These may include emotional strengths, practical skills, relational strengths, or internal qualities.",

    required: false
  },


  // ----------------------------------------------
  // Avoidance awareness
  // ----------------------------------------------
  {
    id: "avoidance_patterns",

    category: "avoidance",

    type: "long_text",

    prompt:
      "Is there anything you feel yourself avoiding, postponing, or struggling to face right now?",

    placeholder:
      "This may involve conversations, decisions, emotions, responsibilities, or changes.",

    required: false
  },


  // ----------------------------------------------
  // External pressure
  // ----------------------------------------------
  {
    id: "external_pressure",

    category: "pressure",

    type: "long_text",

    prompt:
      "What expectations or pressures feel most present in your life right now?",

    placeholder:
      "These pressures may come from yourself, relationships, work, family, culture, finances, or other responsibilities.",

    required: false
  },


  // ----------------------------------------------
  // Self-trust
  // ----------------------------------------------
  {
    id: "self_trust",

    category: "self_trust",

    type: "scale",

    prompt:
      "How much do you currently trust yourself to make aligned decisions?",

    scale: {
      min: 1,
      max: 10,
      minLabel: "Very little self-trust",
      maxLabel: "Strong self-trust"
    },

    required: true
  },


  // ----------------------------------------------
  // Reflection awareness
  // ----------------------------------------------
  {
    id: "inner_awareness",

    category: "awareness",

    type: "long_text",

    prompt:
      "What do you think your current life may be trying to show or teach you?",

    placeholder:
      "There is no right answer. This is simply an opportunity to reflect on what feels important or noticeable right now.",

    required: false
  }
];


// --------------------------------------------------
// Optional Helper
// --------------------------------------------------
export function getReflectQuestionById(id) {

  return reflectQuestions.find(
    (question) => question.id === id
  );
}
