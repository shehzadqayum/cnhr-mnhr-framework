# CNHR-MNHR Modelling Framework

## Architecture & Trajectory

**Document ID:** ARCH-001  
**Date:** March 2026  
**Author:** Shehzad Qayum  
**Status:** Active  

---

## 1. Architecture

### 1.1 Principle

The modelling framework separates **measurement** from **application**. The core framework defines how to measure earnings performance. Applications consume those measurements to answer specific operational questions. Nothing flows backward — applications cannot redefine core metrics.

### 1.2 Document Set

| ID | Document | Layer | Purpose |
|----|----------|-------|---------|
| CORE-001 | CNHR-MNHR Framework | Core | Defines CNHR, MNHR, the derivative, attractor dynamics. Takes trip data in, produces rate metrics out. |
| APP-001 | Sustainable Operations Model | Application | Imports core outputs. Adds cost structure, working density δ, pattern generation, monitoring protocol. Answers: "how should I schedule?" |
| APP-002 | Value of Time Analysis | Application | Imports from core and APP-001. Adds τ (time exchange rate), π (price of freedom), η (study conversion). Answers: "is this schedule worth living inside?" |
| ARCH-001 | This document | Meta | Architecture, dependency chain, modelling trajectory, remodelling log. |

### 1.3 Dependency Chain

```
CORE-001 (ρ, α, r, CNHR dynamics)
    │
    ├──► APP-001: SOM (δ, F, v, patterns, monitoring)
    │       │
    │       └──► APP-002: Value of Time (τ, π, η)
    │
    ├──► APP-003: [Future] Sentinel Integration
    ├──► APP-004: [Future] Seasonal Recalibration
    └──► APP-005: [Future] Night vs Day Model Selection
```

**Rules:**
- Applications import from the core. Never modify it.
- Downstream applications may import from upstream applications.
- Each document declares its imports and exports explicitly.
- A change to the core propagates to all applications. A change to an application does not propagate upward.

---

## 2. Modelling Trajectory

This section records how the framework evolved, what was discovered at each stage, and what was corrected. It serves as a reasoning audit trail.

### 2.1 Phase 1: Empirical Foundation (Dec 2024 – Feb 2025)

**Activity:** 735 trips collected across 13 weekly cycles during night-shift operations (23:00–09:00). CNHR-MNHR Dashboard built and iterated to v2.3.

**Key finding:** Hours worked, not trip quality, is the binding constraint on earnings. ~90% of weekly CNHR variation is attributable to shift hours. This redirected all subsequent modelling toward scheduling rather than trip optimisation.

**Output:** Dashboard v2.3. Core parameters established: ρ = £37.08/hr (night), α = 1.26, r = 0.687.

### 2.2 Phase 2: Mathematical Framework (Feb–Mar 2025)

**Activity:** Derived the CNHR differential equation from first principles.

**Key finding:** df/ds = (ρ_t/α − f(s)) / s. Three components — attractor, inertia, gap — explain all observed CNHR behaviour. The closed-form f(s) = ρ_t/α − C_W/(k·s) proves CNHR is a hyperbola approaching an asymptote set entirely by ρ.

**Implication:** Late-week intervention is structurally futile (1/s inertia). By hour 30, CNHR is committed within ±£2. This motivated the Day 3 checkpoint design.

**Output:** CORE-001 mathematical foundation.

### 2.3 Phase 3: Night Model (SOM v1.0)

**Activity:** Applied core framework to design a sustainable night-shift operating pattern.

**Configuration:** 23:00–09:00 shift, 2:1 cycle (2 working weeks, 1 off), 5 days/week, C_W = £430.

**Output:** £192/day target, £19,955 annual net, CNHR(e) = £13.17/hr.

### 2.4 Phase 4: Day Model Transition (SOM v2.0–v2.1)

**Activity:** Redesigned for 04:00–14:00 day shift to gain circadian health and study capacity.

**Key finding:** Night-shift carry-over artefact. Weekend 04:00–08:00 historical ρ was inflated by night-shift momentum, not organic daytime demand. Sunday historical ρ ranked 2nd but structural demand ranked last (+57% inflation). This invalidated the initial rest-day selection (Wed+Sat) and led to the corrected selection (Wed+Sun).

**Correction:** v2.1 rest days revised from Wed+Sat to Wed+Sun based on structural demand analysis.

**Output:** SOM v2.1 with structural demand scoring.

### 2.5 Phase 5: Financial Spot-Check (SOM v2.2)

**Activity:** First-principles cost decomposition to validate the model.

**Key finding:** £430/week decomposes into £220 fixed + £210 variable. Charging is only 3.8% of gross. Retention rate: 53.5p net per £1 earned. Cross-check: first-principles £1,804/month vs model £1,783 (£21 rounding difference).

**Output:** SOM v2.2 with rebuilt Section 7 (Financial Model).

### 2.6 Phase 6: Self-Contained Consolidation (SOM Final)

**Activity:** Merged all prior versions into a single self-contained document. Added full mathematical derivation, monitoring rationale, data basis section.

**Output:** SOM-001 Final (13 sections, 37 subsections).

### 2.7 Phase 7: Framework Generalisation (v2.0–v2.1)

**Activity:** Challenged the 1-week accounting window. Discovered that C_W = £430 hid the off-week cost, overstating NLW headroom by a factor of two (£4.59 vs £2.06).

**Key findings:**

1. **Off-week cost invisibility.** The weekly CNHR used C_W = £430 but the off week costs £220 with zero hours to dilute it. The true cycle-adjusted cost per working week is £540, not £430.

2. **Block length irrelevance.** CNHR depends only on ρ and δ. N cancels algebraically. This eliminated the need for a "3-week CNHR" — the correction is simply to use the right cost constant.

3. **Cost separation.** F = £31.43/day (fixed, runs always) and v = £42/day (variable, working days only) is the correct decomposition. The collapsed C_W obscured this.

4. **Conservative ρ revision.** £200/day (ρ = £29.11/hr) adopted as planning assumption pending trial data. This shifts NLW minimum from 8 to 13 working days.

**Correction applied:** CNHR(e) = ρ/α − 4.85 − 3.63/δ replaces the weekly-window CNHR.

### 2.8 Phase 8: Value of Time (APP-002)

**Activity:** Introduced temporal metrics alongside financial metrics.

**Key findings:**

1. **τ (free hours per hour worked)** is a more human-legible measure of life balance than δ. δ is for computation; τ is for communication.

2. **π (price of a free hour)** quantifies the diminishing return of additional working days. Income per day is constant (£158); but π rises because remaining free hours become scarcer.

3. **The £200 vs £231 question is fundamentally about whether freedom is affordable.** At £231/day, π = £1.83 (cheap freedom). At £200/day, π = £9.18 (expensive freedom). The trial resolves this.

4. **Study hours ≠ free hours.** The conversion factor η must be observed, not assumed. The traineeship target requires η ≥ 0.59 at δ = 0.619.

### 2.9 Phase 9: Separation Principle (Current)

**Activity:** Recognised that Phases 7–8 had over-fitted the core framework by welding scheduling, cost modelling, and time-value analysis into the rate measurement layer.

**Correction:** Separated core (measurement) from applications (decisions). Established the one-directional dependency chain. This document (ARCH-001) records the architecture.

### 2.10 Phase 10: External Comprehensive Evaluation

**Activity:** Full framework stack (CORE-001, APP-001, APP-002) submitted for structured external evaluation. The evaluation examined theoretical soundness, internal consistency, operational usefulness, and limitations.

**Overall rating received:** 7.5/10. Conceptual architecture 9/10, mathematical consistency 8/10, operational usefulness 8/10, empirical grounding 7/10, general applicability 5/10.

**Three structural properties identified** that were implicit in the mathematics but not stated in the documents:

**Property 1 — NLW Regulatory Attractor.** When the driver minimises work (chooses minimum δ for NLW compliance), CNHR(e) ≈ NLW regardless of ρ. This is not empirical — it is algebraic. At minimum δ, the NLW constraint binds as equality, so CNHR(e) = NLW by construction. Higher ρ does not increase hourly income; it increases free time. The framework therefore models a system where productivity gains convert to leisure rather than income — closer to subsistence labour economics than conventional wage optimisation.

**Property 2 — Day 3 Checkpoint is Mathematically Optimal.** The cost-recovery noise term C/(k·s) decays hyperbolically. The signal (ρ variation, ~±£3/hr) becomes distinguishable from the noise at s ≈ C/(k × 3) ≈ 25–35 hours. This is the signal-to-noise crossover point. The Day 3 checkpoint (30 hours) sits exactly there — early enough to act, late enough for the signal to be clear. This was presented as an operational heuristic but is in fact close to the mathematically optimal observation point.

**Property 3 — Hours Dominance is Structural.** The ~90% hours-dominance finding (binding constraint) is not just an empirical observation from the dataset — it falls out of the CNHR equation itself. ∂CNHR/∂ρ = 1/α ≈ 0.79 (linear, modest sensitivity). ∂CNHR/∂δ = 3.63/δ² ≈ 9.48 at δ = 0.619 (nonlinear, high sensitivity). Because fixed costs are large relative to earnings, the δ-term dominates CNHR variance. Drivers intuitively optimise ρ (surge, trip selection) but the equation shows δ (schedule design) is the larger lever.

**Principal vulnerability identified:** Shift heterogeneity. The framework assumes expected earnings per shift are approximately constant. In practice, weekday vs weekend shifts may differ by 30–60%. This means Income = f(δ) is an approximation; the true function is Income = f(δ, σ) where σ = schedule composition (fraction of high-demand shifts). The model works when the driver operates within a consistent shift window (e.g., weekday 04:00–14:00), but fails if schedule composition varies. This affects APP-001 and APP-002 only — the core measurement layer (CORE-001) remains valid regardless.

**Academic pathway identified:** Adding a stochastic formulation (treating ρ, α, r as random variables with distributions derived from the 735-trip dataset) would convert the framework from a deterministic operational model to a statistical study. The key novel contribution: CNHR as an engagement-adjusted cumulative ratio estimator, which avoids the mean-of-ratios bias that afflicts most gig-economy earnings studies.

**Output:** This evaluation integrated across ARCH-001, CORE-001, APP-001, APP-002. No structural changes to equations. Findings recorded as discovered properties, known limitations, and future directions.

---

## 3. Remodelling Log

This section records structural changes to the framework — not parameter updates, but changes to equations, definitions, or architecture.

| Date | Document | Change | Reason |
|------|----------|--------|--------|
| Mar 2026 | CORE-001 | Established core with derivative, attractor, closed-form | Phase 2 |
| Mar 2026 | APP-001 | C_W replaced by F + v decomposition | Phase 7: off-week cost hidden |
| Mar 2026 | APP-001 | δ replaces fixed 5-day week | Phase 7: generalisation |
| Mar 2026 | APP-001 | Daily floor revised from £192 to £199 (at δ=0.619) | Phase 7: honest cost accounting |
| Mar 2026 | APP-002 | τ, π, η introduced | Phase 8: temporal evaluation |
| Mar 2026 | ARCH-001 | Core/application separation established | Phase 9: over-fitting mitigation |
| Mar 2026 | APP-001, APP-002 | d=8 CNHR corrected from £8.58 to £8.72 | Rounding artefact from draft computation. Non-material (d=8 is NLW non-compliant regardless). |
| Mar 2026 | APP-002 | v1.1 corrections: Monthly net recalculated (d=8,9,10 overstated by ~£208). π formula corrected for kh/11 dimensional consistency (27.1% overstatement). Marginal π (£14.36, constant) introduced as primary decision metric. H(δ) at d=15 corrected (7.14→8.14). Diminishing returns reframed as average vs marginal. | External evaluation identified carried-forward errors from draft ρ, dimensional mismatch between engaged-hour CNHR and clock-hour τ, and misleading "diminishing returns" framing. |
| Mar 2026 | APP-002 | v1.2 correction: Average π table was missing ×δ factor (computed CNHR×kh/H instead of CNHR×kh×δ/H), overstating by 1/δ. Corrected π_avg at d=13: £7.22 (was £11.67). Warning thresholds and ρ sensitivity recalibrated. ρ sensitivity recomputed with correct CNHR at each ρ's minimum δ. | External evaluation identified formula/table mismatch. Non-material (marginal π and all decisions unaffected). |
| Mar 2026 | APP-002 | v1.3 correction: ρ-sensitivity table (§7) CNHR(e) column had carried-forward draft values for three non-primary rows. £200→£12.39 (was £12.25), £215→£12.36 (was £12.71), £231→£12.30 (was £12.65). Downstream π_avg corrected. Now consistent with ARCH-001 Property 1 table. | Second external evaluation identified carried-forward artefact. Non-material (primary row correct, no decision metrics affected). |
| Mar 2026 | APP-001, APP-002 | Cost decomposition expanded: v identified as function of distance/hours driven (not days worked), F as function of time. Weekly formulation established as fundamental for non-uniform shifts. Hour distribution constraints documented (Uber 10hr trip cap, WTR 11hr rest, 24hr weekly rest). New §10.5: sub-weekly cost attribution requires empirical v_per_hour. v_per_hour and F_per_hour added to APP-001 exports. APP-002 annotated with real-time dependency. | Analysis of whether 40hr/week can be redistributed across days revealed that daily cost model is a special case of weekly formulation; real-time multi-granularity metrics (hourly/daily/weekly/monthly) identified as target capability for Sentinel. |
| Mar 2026 | ARCH-001 | §3.3 expanded from summary table to full derivations of three structural properties (NLW attractor, Day-3 checkpoint optimality, hours dominance). Integer-day discretisation quantified for Property 1. Property 2 derivation tightened with correct weekly C_w = £388 and dual-threshold framing (projection reliability × intervention capacity). Property 3 clarified: structural sensitivity ratio (12–14×) distinguished from empirical variance split. New §3.4: control-system interpretation — target/sensor/actuator/feedback mapping. Sentinel relationship documented. | Integration and tightening of external review (ARCH-002) findings. Subsistence optimisation folded into Property 1 interpretation. |

### 3.1 Active Assumptions Under Review

| Assumption | Current Value | Risk | Resolution |
|------------|--------------|------|------------|
| ρ (day shift) | £29.11/hr (conservative) | May be £33.63/hr (optimistic) | Trial data |
| α (engagement multiplier) | 1.26 (from night data) | May differ on day shifts (e.g., 1.40 with more idle time) | Re-measure during trial |
| K (fatigue limit) | 3 consecutive days | Day shifts may tolerate K=4 | Trial observation |
| η (study conversion) | Assumed 0.59 needed | Unobserved | Track during trial |
| h (shift length) | 10 hours fixed | May vary with demand | Post-trial review |
| Structural demand scores | Based on night-shift era knowledge | May not reflect 2026 conditions | Seasonal recalibration |
| Shift homogeneity | Expected earnings per shift ≈ constant | Weekday vs weekend may differ 30–60% | Shift-class analysis post-trial |
| Cost stability | F = £31.43, v = £42 fixed | Insurance, electricity, maintenance fluctuate | Annual recalibration |
| v_per_hour | Naive estimate £4.20 (£42/10hr) | Conflates active driving with idle time; true value depends on engaged vs dead time mix | Correlate charging receipts with hours worked over multi-week sample |
| F_per_hour allocation | £5.50 (£220/40hr) | Changes retroactively if total weekly hours change | Use planned 40hr as denominator; flag outperformance as surplus |

### 3.2 Known Structural Limitations

| Limitation | Affected layer | Severity | Mitigation |
|------------|---------------|----------|------------|
| Shift heterogeneity — Income = f(δ) assumes all shifts equal | APP-001, APP-002 | Moderate | Model works within consistent shift windows. Future: introduce shift-class variable σ. |
| Deterministic model — no variance/risk quantification | All | Moderate | Sufficient for operational decisions. Future: stochastic extension for academic/planning use. |
| Single-driver dataset — may not generalise | All | Low (for personal use) | Framework is a case-study architecture, not universal theory. |
| No market exit condition — model assumes driver remains active | APP-001 | Low | If ρ < £25/hr sustained, the rational decision may be to stop driving entirely. Not currently modelled. |
| Linear utility — all free hours valued equally | APP-002 | Low | Real preference: evening > midday, weekend > weekday. Acceptable approximation for scheduling. |
| Platform dynamics — ρ, α, r assumed stationary | CORE-001 | Moderate | Descriptive, not predictive. Parameters must be re-measured periodically. |
| Sub-weekly cost attribution — v and F cannot be accurately allocated below weekly level | APP-001, Sentinel | High (for real-time metrics) | Requires empirical v_per_hour from charging data. Weekly CNHR unaffected. Directional shift-level decisions tolerate ±£1–2/hr uncertainty; precise hourly comparison does not. |

### 3.3 Discovered Structural Properties

These properties were implicit in the mathematics but not stated explicitly until the Phase 10 evaluation and subsequent consolidation review. Their formal derivation transforms the framework from a descriptive earnings tracker into a closed-loop control system with a regulatory target, an optimal observation point, and a dominant control lever.

#### Property 1 — NLW Regulatory Attractor

**Statement.** When the driver minimises working days to the NLW boundary, CNHR(e) collapses to NLW exactly, independent of market rate ρ.

**Derivation.** The applied CNHR(e) equation (APP-001 §4):

> CNHR(e) = ρ/α − 4.85 − 3.63/δ

NLW compliance requires CNHR(e) ≥ 12.21. At the minimum feasible δ (where the inequality binds):

> 3.63/δ_min = ρ/α − 4.85 − 12.21

Substituting back: CNHR(e) = ρ/α − 4.85 − (ρ/α − 4.85 − 12.21) = **12.21 exactly**, regardless of ρ. The cancellation is algebraic, not approximate.

**Integer-day discretisation.** In practice, d must be an integer (you cannot work 12.61 days). This forces δ slightly above δ_min, producing a small headroom:

| Daily earnings | ρ (£/hr) | δ_min (exact) | d (exact) | d (integer) | δ (integer) | CNHR(e) | Headroom |
|----------------|----------|---------------|-----------|-------------|-------------|---------|----------|
| £200 | 29.11 | 0.6005 | 12.61 | 13 | 0.619 | £12.39 | +£0.18 |
| £203 | 29.55 | 0.5680 | 11.93 | 12 | 0.571 | £12.25 | +£0.04 |
| £215 | 31.30 | 0.4667 | 9.80 | 10 | 0.476 | £12.36 | +£0.15 |
| £231 | 33.62 | 0.3771 | 7.92 | 8 | 0.381 | £12.30 | +£0.09 |

The £203/day operating point has only £0.04 of headroom — essentially sitting on the attractor. Higher ρ does not increase hourly income; it reduces the required d, converting productivity gains into free time.

**Implication.** The framework is a subsistence optimiser. It models free-time maximisation subject to NLW — closer in character to FIRE/early-retirement economics than to wage maximisation.

#### Property 2 — Day-3 Checkpoint Optimality

**Statement.** The Day-3 checkpoint (s = 30 shift hours) is the mathematically near-optimal observation point, not merely an operational convenience. It sits at the intersection of sufficient projection reliability and remaining intervention capacity.

**Derivation.** The CORE-001 closed-form f(s) = ρ_t/α − C/(k·s) shows that the cost drag C/(k·s) decays hyperbolically with shift hours. Using the weekly cost parameter C_w = £388 (F_week = £220, v_week = £168):

| After shift | s (hr) | Cost drag C_w/(k·s) | ρ-signal as fraction of drag |
|-------------|--------|---------------------|------------------------------|
| Day 1 | 10 | £44.80/hr | 8.9% |
| Day 2 | 20 | £22.40/hr | 17.9% |
| Day 3 | 30 | £14.93/hr | 26.8% |
| Day 4 | 40 | £11.20/hr | 35.7% |

(Signal assumed at ±£4/hr, representative of day-to-day ρ variation in the 735-trip dataset.)

At Day 1, the cost drag overwhelms the ρ signal — CNHR is dominated by cost recovery and reveals almost nothing about earning quality. By Day 3, the drag has fallen 67% and the signal is now a meaningful fraction of the remaining gap.

**Why Day 3 specifically.** The checkpoint is optimal because it satisfies a dual threshold:

First, **projection reliability**: with 3 of 4 shifts completed, the standard error of the ρ estimate has fallen by 42% (factor 1/√3). The CNHR trajectory is largely set — the 1/s inertia (CORE-001 §5.3) means Day 4 can move the cumulative average only marginally.

Second, **intervention capacity**: the sacrifice rule (APP-001 §7.4) converts a rest day to a working day. This decision must be made on Wednesday evening to be enacted on Friday. Day 3 is therefore the *final decision point* before the intervention window closes. Earlier checkpoints (Day 1, Day 2) offer more intervention time but too little data; Day 4 offers the most data but no time to act within the current week.

The two constraints cross at Day 3 — enough data to project reliably, and the last moment at which action is possible. This is the optimal sensor placement in the feedback loop.

#### Property 3 — Structural Hours Dominance

**Statement.** The partial derivative of CNHR(e) with respect to δ is 12–14× larger than with respect to ρ at realistic operating points. Schedule design dominates trip-rate optimisation as a mathematical necessity, not merely an empirical observation.

**Derivation.** From CNHR(e) = ρ/α − 4.85 − 3.63/δ:

> ∂CNHR/∂ρ = 1/α = 0.794

> ∂CNHR/∂δ = 3.63/δ²

| Operating point | δ | ∂CNHR/∂δ | Ratio to ∂CNHR/∂ρ |
|-----------------|---|----------|---------------------|
| Primary (d=12) | 0.571 | 11.13 | **14.0×** |
| Fallback (d=13) | 0.619 | 9.47 | **11.9×** |

**Distinguishing structural sensitivity from empirical variance.** The partial derivatives measure sensitivity per unit change. The *actual* CNHR movement depends on how much each variable varies in practice. Day-to-day ρ variation of ±£5/hr produces CNHR movement of ±£3.97. A single-day δ change (Δδ = 1/21 ≈ 0.048) produces CNHR movement of approximately £0.45–0.53. Across the full feasible range (d = 8 to d = 15, Δδ ≈ 0.33), δ explains ~£4.45 of CNHR range versus ~£3.95 from ρ.

The 90% hours-dominance finding from the 13-week dashboard audit reflects both the structural sensitivity ratio *and* the empirical fact that δ varied substantially across the sample while ρ was relatively stable. A period of extreme ρ volatility with constant δ could produce a different empirical split — but the structural ratio (12–14×) means this is unlikely under normal operating conditions.

**Economic mechanism.** Fixed costs (F = £220/week) create a leverage effect: each additional working day amortises the same fixed cost across more engaged hours. ρ affects only the variable contribution per shift. The fixed-cost leverage makes δ the dominant lever — exactly as the binding constraint analysis (CORE-001 §7) concluded from the empirical data.

#### Additional Properties

| Property | Description | Implication |
|----------|-------------|-------------|
| CNHR as ratio estimator | Σfare/Σtime is the ratio-of-means estimator, avoiding the mean-of-ratios bias that inflates short-trip MNHR | Stronger than most academic gig-economy estimators (CORE-001 §8.1) |

### 3.4 Control-System Interpretation

Properties 1–3 combine to form a closed-loop control system operating on a weekly cycle:

| Element | Framework equivalent | Governing property |
|---------|---------------------|--------------------|
| **Target** | NLW = £12.21/hr | Property 1 — regulatory attractor. CNHR(e) is pulled to NLW at minimum δ. |
| **Sensor** | CNHR at s = 30hr (Day 3 checkpoint) | Property 2 — optimal observation point. Balances projection reliability against intervention timing. |
| **Actuator** | δ adjustment (sacrifice one rest day) | Property 3 — dominant control lever. δ moves CNHR 12–14× more effectively than ρ per unit change. |
| **Feedback law** | Day-3 checkpoint + sacrifice rule (APP-001 §7) | All three combined. Observe at the optimal point, act on the dominant lever, converge to the regulatory target. |

**Operating loop.** Each week executes: drive Mon–Wed → observe CNHR at Day 3 → if below £608 cumulative, sacrifice Friday (δ adjustment) → week closes → repeat. The system automatically drives CNHR(e) toward the regulatory attractor using the dominant lever, observed at the mathematically near-optimal moment. Persistent underperformance (two consecutive sacrifices) triggers a regime change — fallback to d = 13 permanently — which is a structural recalibration rather than a feedback adjustment.

**Relationship to Sentinel.** The control-system interpretation provides the architectural blueprint for Sentinel's real-time advisory capability. Sentinel implements the sensor (continuous CNHR/MNHR tracking), provides the observation (mid-shift projection), and recommends the actuation (shift extension, early termination, sacrifice decision). The properties guarantee that the system is well-posed: the target is algebraically stable (Property 1), the observation point is near-optimal (Property 2), and the recommended action is the most effective available (Property 3).

### 3.5 Future Development Directions

| Direction | Description | Priority | Effort |
|-----------|-------------|----------|--------|
| Trial validation | Resolve ρ (target £203/day), re-measure α for day shifts, validate K=4 | Critical | 2–3 weeks of data |
| Shift-class extension | Introduce σ (schedule composition) as second control variable alongside δ | Medium | Requires weekday/weekend ρ separation from trial data |
| Stochastic formulation | Express ρ, α, r as distributions; compute E[CNHR], Var(CNHR), confidence intervals | Medium | 735-trip dataset sufficient. Converts framework to statistical study. |
| Reference implementation | Python module computing all outputs from (ρ, α, r, h, F, v, δ). Includes sensitivity table generator. Single source of truth for all numerical values. | Done | tools/cnhr_calculator.py |
| Driver scorecard | One-page operational summary: pattern + floor + checkpoint + τ + π + η | Done | Work_Schedule_21Day_Cycle.pdf |
| Real-time multi-granularity metrics | CNHR/MNHR at hourly, daily, weekly, monthly levels for mid-shift decision-making (early termination, performance comparison, hours-remaining projection) | Critical | Requires empirical v_per_hour. Target capability for Sentinel. Weekly level already functional; sub-weekly blocked on cost attribution. |
| Non-uniform schedule support | Enable 40hr/week distributed across non-standard shift lengths (e.g., 3×13+1, 5×8) with correct per-shift cost attribution | Medium | Depends on v_per_hour. Weekly formulation already established in APP-001 §3.1. |
| η tracking dashboard | Weekly study hours column: effective study = η × H(δ) × days. Tracks whether η ≥ 0.55 threshold is being met during trial. | Medium | Simple addition to existing dashboard. Enables early warning if traineeship target is at risk. |

---

## 4. How to Use This Framework

**If you want to understand what CNHR is and how it behaves:** Read CORE-001.

**If you want to know how many days to work and what pattern to follow:** Read APP-001 (SOM). It imports everything it needs from the core.

**If you want to evaluate whether a schedule is worth living inside:** Read APP-002 (Value of Time). It imports from both the core and the SOM.

**If you want to understand how we got here and why something is the way it is:** Read Section 2 of this document (Modelling Trajectory).

**If you want to understand why the monitoring protocol works:** Read Section 3.3 (Structural Properties) and Section 3.4 (Control-System Interpretation). The Day-3 checkpoint, sacrifice rule, and NLW target form a mathematically well-posed feedback loop.

**If you want to change something:** Check the dependency chain (Section 1.3). Change only the layer where the concept lives. If it's a rate metric, change the core. If it's a schedule parameter, change the SOM. If it's a time-value interpretation, change APP-002. Then propagate forward.

---

*— End of Architecture Document —*
