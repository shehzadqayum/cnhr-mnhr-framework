# CNHR-MNHR Framework

**A generalised analytical framework for rideshare driver economics, scheduling optimisation, and time-value analysis.**

Built on 735 trips across 13 weeks of verified London Uber data. Reduces the entire operational design to one control variable (δ), five equations, and one decision rule.

🔗 **Live dashboard:** [cnhr_dashboard.html](https://shehzadqayum.github.io/cnhr-mnhr-framework/dashboard/cnhr_dashboard.html)

---

## Current Operating Position

| Parameter | Value |
|-----------|-------|
| Pattern | **Mon–Thu on, Fri–Sun off, every week** |
| Working days per cycle | 12 / 21 (δ = 0.571) |
| Shift window | 04:00–14:00 |
| Target daily earnings | £203 |
| Monthly net income | £1,844 |
| CNHR(e) | £12.25/hr (+£0.04 above NLW) |
| τ (free hours per hour worked) | 1.55 |
| π marginal (price of a free hour) | £14.64 |
| Day 3 checkpoint | £608 |
| Fallback | d=13 if ρ < £203/day |
| Status | **Pending trial validation** |

📄 **Printable schedule:** [Work Schedule PDF](operational/Work_Schedule_21Day_Cycle.pdf)

---

## Architecture

The framework separates **measurement** from **application**. The core defines how to measure earnings. Applications consume those measurements to answer operational questions. Nothing flows backward.

```
CORE-001  (ρ, α, r, CNHR dynamics)
    │
    ├──▶ APP-001: Sustainable Operations Model
    │       δ, costs, patterns, monitoring
    │       │
    │       └──▶ APP-002: Value of Time Analysis
    │               τ, π, η, decision rule
    │
    ├──▶ APP-003: [Future] Sentinel Integration
    ├──▶ APP-004: [Future] Seasonal Recalibration
    └──▶ APP-005: [Future] Night vs Day Model Selection
```

**Rule:** Applications import from the core. Never modify it. A change to the core propagates forward. A change to an application does not propagate upward.

Full modelling trajectory, remodelling log, and discovered structural properties: [ARCH-001](architecture/ARCH-001_Architecture_and_Trajectory.md)

---

## Documentation

### Specifications

| ID | Document | Purpose | Link |
|----|----------|---------|------|
| ARCH-001 | Architecture & Trajectory | Dependency chain, modelling history, remodelling log, structural properties | [View](architecture/ARCH-001_Architecture_and_Trajectory.md) |
| CORE-001 | CNHR-MNHR Framework | Core measurement: CNHR, MNHR, derivative, attractor dynamics, statistical properties | [View](core/CORE-001_CNHR-MNHR_Framework.md) |
| APP-001 | Sustainable Operations Model | Scheduling: costs, δ, patterns, monitoring protocol, fallback | [View](applications/APP-001_Sustainable_Operations_Model.md) |
| APP-002 | Value of Time Analysis | Temporal evaluation: τ, π, η, decision rule, diminishing returns | [View](applications/APP-002_Value_of_Time_Analysis.md) |

### Operational

| Document | Purpose | Link |
|----------|---------|------|
| Work Schedule | Printable single-page 21-day cycle schedule with metrics and monitoring | [PDF](operational/Work_Schedule_21Day_Cycle.pdf) |
| Schedule builder | Python source for generating the schedule PDF | [Source](operational/build_schedule.py) |
| Dashboard v2.3 | Interactive CNHR-MNHR dashboard (735 trips, 13 weeks) | [Launch](https://shehzadqayum.github.io/cnhr-mnhr-framework/dashboard/dashboard_v2_3.html) |

### Archive (pre-separation monolithic documents)

| Document | Description | Link |
|----------|-------------|------|
| SOM-001 Final (.docx) | Consolidated self-contained SOM before core/app separation | [Download](archive/SOM-001_Final.docx) |
| SOM-001 Final (.pdf) | LaTeX-typeset PDF version | [View](archive/SOM-001_Final.pdf) |
| SOM-001 Final (.tex) | LaTeX source | [View](archive/SOM-001_Final.tex) |
| SOM-001 Final (.md) | Markdown version | [View](archive/SOM-001_Final.md) |

---

## Repository Structure

```
cnhr-mnhr-framework/
├── README.md                               ← You are here
├── CHANGELOG.md
│
├── architecture/
│   └── ARCH-001_Architecture_and_Trajectory.md
│
├── core/
│   └── CORE-001_CNHR-MNHR_Framework.md
│
├── applications/
│   ├── APP-001_Sustainable_Operations_Model.md
│   └── APP-002_Value_of_Time_Analysis.md
│
├── operational/
│   ├── Work_Schedule_21Day_Cycle.pdf
│   └── build_schedule.py
│
├── dashboard/
│   └── dashboard_v2_3.html
│
├── tools/
│   └── cnhr_calculator.py                  [planned]
│
└── archive/
    ├── SOM-001_Final.docx
    ├── SOM-001_Final.pdf
    ├── SOM-001_Final.tex
    └── SOM-001_Final.md
```

---

## The Five Equations

Everything derives from working density **δ = d / N** (working days ÷ total days).

| # | Output | Equation | Answers |
|---|--------|----------|---------|
| 1 | CNHR(e) | ρ/α − 4.85 − 3.63/δ | What do I earn per engaged hour? |
| 2 | H(δ) | 16 − 11δ | How many free hours per day? |
| 3 | τ(δ) | (16 − 11δ) / (11δ) | How many free hours per hour worked? |
| 4 | π(δ) | (ρrh − v) / 11 | What does each free hour cost me? |
| 5 | Net/month | 30.44 × ((ρrh − v)δ − F) | What is my take-home pay? |

**The decision rule:** Work if marginal π < value of a free hour. Study hour value ≈ £26.70. Since £26.70 > £14.64, minimise working days. NLW sets the floor at 12.

Full derivations: [CORE-001](core/CORE-001_CNHR-MNHR_Framework.md) · Applied form: [APP-001 §4](applications/APP-001_Sustainable_Operations_Model.md) · Time metrics: [APP-002 §3](applications/APP-002_Value_of_Time_Analysis.md)

---

## Document Guide

| If you want to… | Read |
|------------------|------|
| Understand what CNHR is and how it behaves | [CORE-001](core/CORE-001_CNHR-MNHR_Framework.md) |
| Know how many days to work and what pattern to follow | [APP-001](applications/APP-001_Sustainable_Operations_Model.md) |
| Evaluate whether the schedule is worth living inside | [APP-002](applications/APP-002_Value_of_Time_Analysis.md) |
| Understand how we got here and why something is the way it is | [ARCH-001](architecture/ARCH-001_Architecture_and_Trajectory.md) |
| Explore the raw trip data interactively | [Dashboard v2.3](https://shehzadqayum.github.io/cnhr-mnhr-framework/dashboard/dashboard_v2_3.html) |
| Print the work schedule and stick it on the wall | [Work Schedule PDF](operational/Work_Schedule_21Day_Cycle.pdf) |
| See the pre-separation monolithic model | [SOM-001 Final](archive/SOM-001_Final.md) |

---

## Key Constants

| Symbol | Name | Value | Source |
|--------|------|-------|--------|
| ρ | Trip earning rate | £29.55/hr (target) | [Dashboard v2.3](https://shehzadqayum.github.io/cnhr-mnhr-framework/dashboard/dashboard_v2_3.html), pending trial |
| α | Engagement multiplier | 1.26 | Dashboard v2.3 |
| r | Trip ratio | 0.687 | Dashboard v2.3 |
| k | Composite (r × α) | 0.866 | Derived |
| F | Daily fixed cost | £31.43 | [APP-001 §3.1](applications/APP-001_Sustainable_Operations_Model.md) |
| v | Daily variable cost | £42.00 | [APP-001 §3.1](applications/APP-001_Sustainable_Operations_Model.md) |
| h | Shift length | 10 hours | Policy |
| NLW | National Living Wage | £12.21/hr | UK Government (Apr 2025) |
| K | Max consecutive shifts | 4 | Policy, pending trial validation |

---

## Three Discovered Structural Properties

Properties implicit in the mathematics, identified during [Phase 10 external evaluation](architecture/ARCH-001_Architecture_and_Trajectory.md):

**1. NLW Regulatory Attractor.** At minimum δ, CNHR(e) = NLW exactly, regardless of ρ. Higher productivity → more free time, not higher income. The framework models subsistence optimisation, not wage maximisation.

**2. Day 3 is Mathematically Optimal.** The cost-recovery noise term C/(k·s) crosses the signal scale (~±£3/hr) at s ≈ 30 hours. The Day 3 checkpoint sits at the signal-to-noise crossover — early enough to act, late enough for the signal to be clear.

**3. Hours Dominance is Structural.** ∂CNHR/∂δ ≈ 9.48 vs ∂CNHR/∂ρ ≈ 0.79 at the operating point. Schedule design is a 12× larger lever than trip optimisation. The ~90% hours-dominance finding is not just empirical — it falls out of the equation.

---

## Current Status

### Validated
- Core CNHR dynamics — [CORE-001 §5–6](core/CORE-001_CNHR-MNHR_Framework.md)
- Cost decomposition (F/v separation) — [APP-001 §3.1](applications/APP-001_Sustainable_Operations_Model.md)
- Block length irrelevance proof — [APP-001 §3.2](applications/APP-001_Sustainable_Operations_Model.md)
- Marginal π constancy — [APP-002 §5.1](applications/APP-002_Value_of_Time_Analysis.md)
- Statistical estimator properties — [CORE-001 §8](core/CORE-001_CNHR-MNHR_Framework.md)

### Pending Trial
- Day-shift ρ (target £203/day, conservative £200)
- Engagement multiplier α under day-shift conditions
- K = 4 fatigue tolerance
- Study conversion factor η
- Structural demand scores under 2026 conditions

### Planned
- Stochastic extension (distributions, confidence intervals)
- Shift-class variable σ (weekday/weekend ρ separation)
- Reference Python implementation
- Sentinel integration (real-time trip data feed)

Full assumptions register and future directions: [ARCH-001 §3](architecture/ARCH-001_Architecture_and_Trajectory.md)

---

## Commit Convention

```
<layer>: <description>

core:    changes to CORE-001 (measurement definitions)
app-001: changes to SOM (scheduling, costs, patterns)
app-002: changes to Value of Time (temporal metrics)
arch:    changes to ARCH-001 (trajectory, remodelling log)
ops:     operational outputs (schedule PDF, build scripts)
tools:   calculator, reference implementations
docs:    README, CHANGELOG, non-spec documentation
```

---

## Tags

| Tag | Description |
|-----|-------------|
| `v1.0-night` | Original night model |
| `v2.0-day` | Day model transition |
| `v2.2-financial` | Financial model rebuilt |
| `v3.0-separated` | Core/application separation |
| `v3.1-corrections` | π formula, monthly net corrections |
| `v4.0-4on3off` | **Current.** d=12 uniform pattern, £203/day target |
| `trial-start` | *Future.* Live trial begins |
| `trial-complete` | *Future.* Parameters confirmed or reverted |

---

## Origin

735 trips. One driver. One car (Kia e-Niro). One city (London). 13 weeks of night-shift data transformed into a general scheduling framework through iterative analysis, external evaluation, and structural separation.

The framework's real contribution is not the specific numbers — those change with every trial. It is the architecture: a measurement layer that never changes, an operations layer that adapts to any schedule, and a time-value layer that converts scheduling decisions into human terms.

**Author:** Shehzad Qayum  
**Date:** March 2026  
**Site:** [shehzadqayum.github.io/cnhr-mnhr-framework](https://shehzadqayum.github.io/cnhr-mnhr-framework)  
**Licence:** Private. Not for distribution.
