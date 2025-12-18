# TRUE Design Method

## A Stage-Aware Reflective Intelligence

TRUE is not a chatbot, a coach, or a productivity tool.

TRUE is a **stage-aware reflective intelligence** designed to help humans move through life **with clarity, sustainability, and agency** — without coercion, urgency, or performative growth.

This repository documents the **philosophy, architecture, invariants, and engineering trail** of the TRUE system so that future builders, collaborators, and auditors can understand *why* it works the way it does — not just *how*.

---

## Core Philosophy

TRUE is built on four non-negotiable principles:

1. **Clarity before action**
   No planning, execution, or optimization occurs until meaning is clear.

2. **Sustainability before growth**
   Expansion is never pursued at the cost of burnout, fragmentation, or identity erosion.

3. **Agency above all**
   TRUE does not fix people, decide for them, or push outcomes. It reflects and structures.

4. **One stage at a time**
   Humans cannot meaningfully discover, plan, and sustain simultaneously.

TRUE responds to *intent*, not performance.

---

## Stages of TRUE

TRUE operates in **exactly one stage at a time**.

### 1. Discovery — *Understanding before doing*

Purpose: Clarify values, patterns, desires, tensions, and direction.

Modules:

* target
* reflect
* update
* synthesis

### 2. Planning — *Designing action without overwhelm*

Purpose: Translate clarity into **bounded, humane plans**.

Modules:

* goalPrioritization
* goalRefinement
* actionDesign
* obstacleMapping
* plan7
* plan30
* plan90
* synthesis

### 3. Alignment — *Sustaining life over time*

Purpose: Reduce friction, prevent burnout, and support long-term coherence.

Modules:

* simplify
* reduceRemoveDelegate
* iterate
* grow
* nurture
* synthesis

TRUE will **never skip forward** without explicit consent.

---

## Architectural Invariants (MCL)

The TRUE Core Logic (MCL) enforces system-wide rules:

### Stage Invariants

* Only one stage may be active at a time
* No module stacking
* No forward progression without consent

### Pro Model Invariant

> **No Pro call may introduce new content domains.**
> Pro may only integrate, reframe, humanize, or synthesize content already surfaced.

This protects:

* User agency
* Cost discipline
* Meaning integrity

---

## Model Philosophy (Not “AI Usage”)

TRUE does not sell or explain itself in terms of tokens, models, or intelligence tiers.

Internally, models are treated as:

* **CHEAP** → exploratory, generative, reflective
* **PRO** → integrative, synthesizing, humanizing

Externally, this maps to:

* *Seasons* of reflection
* *Depth* of integration
* *Continuity* of insight

Not power. Not speed.

---

## Soft Caps as Seasons

TRUE does not impose hard limits.

Instead, it uses **seasonal soft caps**:

* Discovery seasons naturally conclude when clarity stabilizes
* Planning seasons end when a plan is formed
* Alignment seasons cycle as life evolves

When a season ends, TRUE reflects it back — it does not block the user.

---

## System Authority Boundaries

TRUE enforces a strict separation of concerns:

### Client (UI)

* Collects user input
* Displays responses
* Never decides meaning, stage, or module

### Server

* Detects stage
* Selects module
* Enforces invariants
* Decides model tier

### Modules

* Contain all meaning
* Build prompts
* Define scope and tone

### LLM Layer

* Writes only within constraints
* Never decides structure or direction

> **The client never decides meaning.**

---

## Repository Structure

```
truedesignmethod/
├── api/
│   └── chat/
│       ├── index.js        # Orchestration entry point
│       ├── router.js       # Stage + module selection
│       ├── mcl.js          # TRUE invariants
│       └── llm.js          # Model wrappers
│
├── modules/
│   ├── discovery/
│   ├── planning/
│   ├── alignment/
│   └── index.js            # Stage registry
│
├── prompts/
│   └── system.txt          # Minimal TRUE system prompt
│
├── public/
│   ├── index.html
│   └── send.js
│
├── README.md
└── package.json
```

---

## Why This System Exists

TRUE was created to solve a specific failure mode of modern tools:

* Too fast
* Too performative
* Too outcome-driven
* Too exhausting

TRUE is intentionally **calm, slow, and bounded**.

It is designed for people who:

* Think deeply
* Hold many possibilities
* Burn out easily under pressure
* Need structure without domination

---

## What TRUE Is Not

* Not therapy
* Not coaching
* Not productivity software
* Not optimization
* Not hustle

TRUE is **a mirror with structure**.

---

## Future-Proofing Notes

This architecture supports future additions without breaking philosophy:

* Memory (reflective only, not predictive)
* Exports (LifePrints)
* Human facilitation
* Offline reflection modes

Any future feature must pass this test:

> Does it increase clarity, sustainability, and agency — without pressure?

If not, it does not belong.

---

## Final Statement

TRUE is designed to be trusted.

Not because it is powerful —
But because it **knows what it refuses to do**.

That restraint is the system.
