# CNHR-MNHR Framework

## Core Specification

**Document ID:** CORE-001  
**Date:** March 2026  
**Author:** Shehzad Qayum  
**Status:** Active  
**Imports:** None (this is the root)  
**Exports:** ρ, α, r, k, CNHR(n), MNHR, df/ds, f(s) closed-form

---

## 1. Purpose

This document defines how to measure the earnings performance of a PHV driver. It specifies four metrics and the mathematical relationships between them. It makes no recommendations about scheduling, costs, or operations. Those belong to application documents that consume this core's outputs.

---

## 2. Data Source

All parameters derive from the CNHR-MNHR Dashboard v2.3: 735 trips across 13 consecutive weekly cycles (1 December 2024 – 2 March 2025), recorded during night-shift operations (23:00–09:00) on the Uber platform in London, Kia e-Niro EV. The dashboard passed a full audit confirming internal consistency.

---

## 3. Definitions

### 3.1 MNHR — Marginal Net Hourly Rate

The instantaneous earning rate of a single trip.

> **MNHR = fare / trip duration**

MNHR is volatile. Across the 735-trip dataset it ranges from ~£10/hr to ~£80/hr. It is useful for evaluating individual trips but unreliable for assessing overall performance.

### 3.2 CNHR — Cumulative Net Hourly Rate

The rolling net earnings per trip hour from the start of a cycle, after deducting a fixed cost C.

> **CNHR(n) = (cumulative earnings after n trips − C) / cumulative trip hours after n trips**

C is a cost parameter supplied by the application layer. The core defines the formula; applications supply the value.

### 3.3 CNHR(e) — Engaged-Hours Variant

Adjusts for unpaid time between trips by converting trip hours to engaged hours via the engagement multiplier α.

> **CNHR(e) = (cumulative earnings − C) / (α × cumulative trip hours)**

CNHR(e) is the net rate per hour of platform availability — the correct comparator against the National Living Wage (NLW, £12.21/hr as of April 2025).

---

## 4. Core Parameters

### 4.1 Measured Parameters

These are empirical outputs of the dashboard, derived from the 735-trip dataset.

| Parameter | Symbol | Definition | Measured Value |
|-----------|--------|------------|----------------|
| Trip earning rate | ρ | Average fare per trip hour (£/hr) | Night: £37.08, Day (est): £29.11–£33.69 |
| Engagement multiplier | α | Engaged hours / trip hours | 1.26 |
| Trip ratio | r | Trip hours / shift hours | 0.687 |

**ρ** is the single most important parameter. It determines the ceiling toward which CNHR converges. It varies by time of day, day of week, and season. Applications must specify which ρ they are using.

**α** captures the dead time between trips (waiting, repositioning, queuing). An α of 1.26 means that for every hour of actual trip time, 0.26 hours of unpaid engaged time are incurred.

**r** captures the fraction of a shift spent on actual trips versus all other on-shift activity. An r of 0.687 means 68.7% of shift time is trip time.

### 4.2 Derived Constant

| Constant | Expression | Value |
|----------|------------|-------|
| k (composite multiplier) | r × α | 0.866 |

k converts shift hours to engaged hours: engaged hours = k × shift hours. It appears throughout the framework as the bridge between the clock-time a driver experiences and the engaged-time that determines CNHR.

---

## 5. The CNHR Derivative

### 5.1 Derivation

Express CNHR(e) as a continuous function f(s) of shift hours s:

> f(s) = (E(s) − C) / (k · s)

where E(s) is cumulative earnings at shift-hour s and C is the cost parameter.

Differentiating with respect to s using the quotient rule and simplifying (noting that dE/ds = ρ_t · r, where ρ_t is the instantaneous trip rate):

> **df/ds = (ρ_t/α − f(s)) / s**

This equation governs all CNHR behaviour.

### 5.2 Three Components

| Component | Expression | Role |
|-----------|------------|------|
| **Attractor** | ρ_t/α | The value CNHR is pulled toward. Set entirely by the market (trip rate divided by engagement overhead). At steady ρ_t = £32.28/hr, the attractor is £25.62/hr. |
| **Gap** | ρ_t/α − f(s) | The signed distance from current CNHR to the attractor. Positive when CNHR is below the attractor (the normal case — recovering costs). Determines the direction and magnitude of movement. |
| **Inertia** | 1/s | The rate of change is inversely proportional to accumulated shift hours. At s = 1, one trip moves everything. At s = 30, the average is stable within ±£2. At s = 50, a single trip barely registers. |

### 5.3 Interpretation

The derivative says three things:

1. **CNHR always moves toward ρ_t/α.** If below (the normal case), it rises. If above (rare), it falls.

2. **The movement decelerates as hours accumulate.** This is not a property of the trips (which are independent). It is a property of the cumulative average — adding a data point to a larger sample moves the mean less. Each trip contributes the same pounds; but its influence on the running average diminishes as the denominator grows.

3. **By ~30 shift hours, CNHR is effectively committed.** The 1/s inertia means late-week changes are mathematically negligible. This is the foundation for any monitoring system that uses a mid-week checkpoint.

---

## 6. Closed-Form Solution

If ρ_t is constant (steady earning rate throughout the cycle):

> **f(s) = ρ_t/α − C/(k · s)**

CNHR is a hyperbola in s, approaching ρ_t/α from below. The gap between current CNHR and the attractor is exactly C/(k · s), which shrinks as 1/s but never reaches zero for finite s.

### 6.1 Properties

**At s = 0:** f(s) → −∞. The cost C creates an infinite negative starting point (division by zero). In practice, CNHR begins deeply negative after the first trip.

**As s → ∞:** f(s) → ρ_t/α. The attractor is the long-run limit. But within any finite cycle, CNHR remains below it by C/(k · s).

**The residual gap at s hours:** C/(k · s). At 50 shift hours with C = £430: £430/(0.866 × 50) = £9.93/hr. This is the structural drag of the cost parameter on the rate metric. It exists purely because the accounting window is finite.

### 6.2 What the Closed-Form Does Not Say

The closed-form assumes constant ρ_t. In practice, ρ_t varies within a shift (early morning vs midday) and across days (weekday vs weekend). The derivative (Section 5) handles the general case. The closed-form is an analytical tool for understanding steady-state behaviour, not a prediction of any specific week.

---

## 7. The Binding Constraint

The 13-week dataset reveals that weekly CNHR(e) variance is dominated by hours worked (~90%), not by trip rate variation (~10%). Weeks with 50+ shift hours consistently clear NLW regardless of ρ fluctuation. Weeks with 20–30 shift hours fail regardless of how high ρ is.

This is a direct consequence of the closed-form: CNHR = ρ_t/α − C/(k·s). The first term (attractor) varies by ±15% across weeks. The second term (cost drag) varies by 2–3× depending on hours. The cost drag term dominates.

**Implication for applications:** any scheduling model must optimise for sustainable hours first. Trip-rate optimisation (surge chasing, area selection) is a second-order effect.

---

## 8. Statistical Properties

### 8.1 CNHR as a Ratio Estimator

CNHR computes Σfare / Σtime — the ratio of total earnings to total trip hours. This is the **ratio-of-means** estimator, which is the statistically correct way to estimate average hourly earnings.

The alternative — averaging MNHR (fare/time for each trip individually) — is the **mean-of-ratios** estimator. It gives disproportionate weight to short trips (a 5-minute minimum-fare trip producing £48/hr MNHR versus a 60-minute airport trip at £42/hr). This is a well-known bias in statistics: the mean of ratios ≠ the ratio of means.

CNHR avoids this by weighting each trip by its time contribution. Longer trips contribute more to both numerator and denominator, producing a stable, consistent estimate of true hourly earnings.

### 8.2 Convergence

As the number of trips grows, CNHR converges to the true expected hourly earnings (by the law of large numbers applied to the ratio estimator). With 735 trips in the dataset, the estimate is highly stable. This is the mathematical reason the CNHR curve flattens in the dashboard — it is not an operational pattern but a convergence property of the estimator.

### 8.3 What the Core Does Not Provide

The core provides means (ρ, α, r) but not dispersion (σ(MNHR), σ(CNHR), fare distributions, idle-time distributions). Without variance estimates, risk and earnings volatility cannot be quantified. This is a known limitation, acceptable for operational use but insufficient for academic or probabilistic applications. A stochastic extension treating ρ as a random variable with a distribution estimated from the 735-trip dataset would address this.

---

## 9. Export Interface

Applications import the following from this core:

| Export | Type | Description |
|--------|------|-------------|
| ρ | Parameter | Trip earning rate. Applications must specify which ρ (night, day, conservative, optimistic). |
| α | Parameter | Engagement multiplier. Stable across the dataset. |
| r | Parameter | Trip ratio. Stable across the dataset. |
| k | Derived | r × α = 0.866. Composite shift-to-engaged-hours multiplier. |
| CNHR(n) | Function | Cumulative rate at trip n. Applications supply C. |
| CNHR(e) | Function | Engaged-hours variant. Applications supply C. |
| df/ds | Equation | The derivative. Applications use it for monitoring design. |
| f(s) | Equation | Closed-form at constant ρ. Applications use it for steady-state analysis. |
| Binding constraint | Finding | Hours dominate rate in explaining CNHR variance. |

The core does not export: cost structures, working patterns, daily floors, time-value metrics, or operational recommendations. Those are application-layer concerns.

---

## 10. Versioning

| Version | Date | Change |
|---------|------|--------|
| 1.0 | Mar 2026 | Initial specification. Derivative, closed-form, three-component interpretation, binding constraint finding. |

The core is expected to be stable. Changes would occur only if new data invalidates the measured parameters (ρ, α, r) or if the mathematical framework is extended (e.g., stochastic ρ treatment).

---

*— End of Core Specification —*
