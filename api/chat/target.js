/**
 * TARGET — Truth & Readiness Gatekeeping Table
 * Defines what must be proven before advancing stages
 */

export const TARGET = Object.freeze({
  exitCriteria: {
    // --------------------------------------------------
    // DISCOVERY → SUSTAINMENT
    // --------------------------------------------------
    discovery: {
      intent: "User understands themselves well enough to act without self-betrayal",
      required: [
        {
          id: "values_articulated",
          description: "User has articulated their core values in their own words",
          proof: {
            type: "presence"
          }
        },
        {
          id: "values_prioritized",
          description: "User has identified which values are non-negotiable right now",
          proof: {
            type: "nonEmptyArray"
          }
        },
        {
          id: "pattern_identified",
          description: "User has identified at least one recurring internal or behavioral pattern",
          proof: {
            type: "presence"
          }
        },
        {
          id: "energy_drains_logged",
          description: "User has identified activities or contexts that reliably drain energy",
          proof: {
            type: "nonEmptyArray"
          }
        },
        {
          id: "energy_gains_logged",
          description: "User has identified activities or contexts that restore energy",
          proof: {
            type: "nonEmptyArray"
          }
        },
        {
          id: "self_blame_released",
          description: "User acknowledges that past friction reflects system mismatch, not personal failure",
          proof: {
            type: "booleanTrue"
          }
        }
      ]
    },

    // --------------------------------------------------
    // SUSTAINMENT → ALIGNMENT
    // --------------------------------------------------
    sustainment: {
      intent: "User can act consistently without excessive cognitive or emotional load",
      required: [
        {
          id: "minimum_system_defined",
          description: "User has defined a minimum viable system they can sustain",
          proof: {
            type: "presence"
          }
        },
        {
          id: "decision_rules_set",
          description: "User has established at least one clear decision rule to reduce friction",
          proof: {
            type: "nonEmptyArray"
          }
        },
        {
          id: "capacity_respected",
          description: "User has explicitly adjusted expectations to match real capacity",
          proof: {
            type: "booleanTrue"
          }
        },
        {
          id: "execution_attempts_logged",
          description: "User has tested their system in real conditions",
          proof: {
            type: "minCount",
            min: 1
          }
        },
        {
          id: "evaluation_completed",
          description: "User has evaluated outcomes without self-judgment",
          proof: {
            type: "booleanTrue"
          }
        }
      ]
    },

    // --------------------------------------------------
    // ALIGNMENT (Cyclical — no final exit)
    // --------------------------------------------------
    alignment: {
      intent: "User can iteratively simplify, adapt, and grow without burnout",
      required: [
        {
          id: "complexity_reduced",
          description: "User has intentionally removed at least one unnecessary obligation or system",
          proof: {
            type: "nonEmptyArray"
          }
        },
        {
          id: "signals_tracked",
          description: "User is tracking internal or external signals to guide iteration",
          proof: {
            type: "nonEmptyArray"
          }
        },
        {
          id: "growth_goal_redefined",
          description: "User has redefined growth in sustainable, non-extractive terms",
          proof: {
            type: "presence"
          }
        },
        {
          id: "rest_and_repair_included",
          description: "User has explicitly included rest or repair in their system",
          proof: {
            type: "booleanTrue"
          }
        }
      ],
      terminal: false
    }
  }
});
