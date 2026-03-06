# Value of Time Analysis

## Application Specification

**Document ID:** APP-002 v1.2  
**Date:** March 2026  
**Author:** Shehzad Qayum  
**Status:** Active — pending trial validation  
**Imports from CORE-001:** ρ, α, r, k  
**Imports from APP-001:** δ, F, v, h, CNHR(e) equation, shift window  
**Exports:** τ, π, H(δ), η framework

**Revision history (bottom of document, §11). Key v1.2 change:** average π table corrected — computation was missing ×δ factor, overstating by 1/δ. Marginal π (£14.64, the decision metric) was and remains unaffected.

---

## 1. Purpose

This application evaluates whether a given schedule is worth living inside. It imports the schedule from APP-001 (SOM) and the rate mechanics from CORE-001, then introduces three temporal metrics that the financial model cannot capture: how much free time you have, what the exchange rate between work and freedom is, and what each hour of freedom costs in foregone earnings.

It does not determine the schedule. It evaluates one.

---

## 2. Imports

| Import | Source | Value |
|--------|--------|-------|
| ρ | CORE-001 | £29.55/hr (target for d=12 pattern) |
| α | CORE-001 | 1.26 |
| r | CORE-001 | 0.687 |
| k | CORE-001 | 0.866 (= r × α) |
| δ | APP-001 | 0.571 (12 days per 21-day cycle) |
| F | APP-001 | £31.43/day |
| v | APP-001 | £42.00/day |
| h | APP-001 | 10 hours |
| CNHR(e) | APP-001 (derived from CORE-001) | ρ/α − 4.85 − 3.63/δ |

**Derived constants used in this application:**

| Constant | Expression | Value | Notes |
|----------|------------|-------|-------|
| kh | αrh | 8.66 hours | Engaged hours per shift |
| ρrh − v | Net contribution per working day | £161 | Gross earnings (£203) minus variable cost (£42) |

---

## 3. Concepts Introduced by This Application

### 3.1 Time Budget

Every day has three mutually exclusive states:

| State | Working day | Rest day | Notes |
|-------|-----------|----------|-------|
| Sleep | 8h | 8h | Fixed. Non-negotiable. |
| Work + transition | 11h | 0h | 10h shift + 1h transition. |
| Free time | 5h | 16h | Everything else. |
| **Total** | **24h** | **24h** | |

Free time is not study time. It is uncommitted waking hours. What the driver does with them — study, rest, socialise, pray, cook, run errands — is allocation, not architecture. This application reports free hours; it does not prescribe their use.

### 3.2 H(δ) — Free Hours Per Day

The weighted average of free hours across the cycle:

> **H(δ) = 16 − 11δ  hours/day**

This is the planning projection. No specific day yields H(δ) hours. Working days yield 5; rest days yield 16. The average is useful for projecting totals over weeks and months.

**Derivation:** H = (d × 5 + (N − d) × 16) / N = (5δN + 16N − 16δN) / N = 16 − 11δ.

### 3.3 τ(δ) — Value of Time

The exchange rate between work and freedom, measured in clock hours:

> **τ(δ) = (16 − 11δ) / (11δ)**

For every clock hour committed to work (including transition), τ is the number of free hours received. This measures the trade in the currency that is actually scarce — time.

**Derivation:** Total work hours per cycle = 11δN. Total free hours per cycle = (16 − 11δ)N. Ratio = (16 − 11δ) / (11δ). N cancels.

| τ | Interpretation |
|---|---------------|
| > 2.0 | Freedom-dominant. Work is a minor fraction of waking life. |
| 1.0 | Equal split. For every hour worked, one hour free. |
| < 1.0 | Work-dominant. More time working than free. |

**Interconversion:** δ = 16 / (11(τ + 1)). The framework uses δ for computation and τ for communication because humans reason about ratios more naturally than fractions.

### 3.4 π — Price of Freedom

π answers: what income do I forgo per free hour gained by not working?

There are two valid measures, answering different questions.

**Marginal π (the decision metric):**

Converting one rest day to a working day gains £161 of net income (ρrh − v = £200 − £42) and costs 11 free hours (16h rest day → 5h working day). Therefore:

> **π_marginal = (ρrh − v) / 11 = £161 / 11 = £14.64 per free hour**

This is **constant** — it does not depend on δ. Each day is independent; the 9th working day produces the same £161 and costs the same 11 hours as the 15th. There are no diminishing marginal returns in the earning process itself.

**Average π (illustrative only — the decision metric is always marginal π):**

The total net earnings across the cycle, divided by total free hours, expressed per engaged hour:

> **π_average = CNHR(e) × kh × δ / (16 − 11δ)**

This varies with δ because it includes the fixed-cost-recovery component. At low δ, most earning recovers the £660 fixed cost, so average net per free hour is low. At high δ, fixed costs are well-covered, so a larger share of each working day is genuine surplus.

Average π is descriptive — it tells you where you sit. Marginal π is prescriptive — it tells you what to do. Average π approaches marginal π as δ → 1 (all costs fully amortised).

**Dimensional note:** CNHR(e) is per engaged hour (kh = 8.66h per shift). τ is per clock hour (11h per shift). The ×kh×δ/(16−11δ) formulation keeps units consistent — it converts the engaged-hour rate to total cycle net earnings before dividing by cycle free hours.

### 3.5 η — Study Conversion Factor

The fraction of free hours converted to productive study.

> **Effective study hours = η × H(δ) × days**

η is not a model parameter. It is an observed quantity. The framework reports H(δ) (total free hours) and leaves η to be measured during the trial. Realistic range: 0.40–0.70.

---

## 4. Output Table

All metrics at each feasible integer d within a 21-day cycle. Target ρ = £29.55/hr (£203/day). All values computed from the exact formulae in §3.

| d/21 | δ | CNHR(e) | H(δ) h/day | τ | π_avg (£/hr) | Net/mo | NLW? |
|------|---|---------|------------|---|-------------|--------|------|
| 8 | 0.381 | £9.07 | 11.81 | 2.82 | £2.53 | £910 | NO (−£3.14) |
| 9 | 0.429 | £10.13 | 11.29 | 2.39 | £3.33 | £1,144 | NO (−£2.08) |
| 10 | 0.476 | £10.98 | 10.76 | 2.05 | £4.20 | £1,377 | NO (−£1.23) |
| 11 | 0.524 | £11.67 | 10.24 | 1.78 | £5.17 | £1,610 | NO (−£0.54) |
| **12** | **0.571** | **£12.25** | **9.71** | **1.55** | **£6.24** | **£1,844** | **YES (+£0.04)** |
| 13 | 0.619 | £12.74 | 9.19 | 1.35 | £7.43 | £2,077 | YES (+£0.53) |
| 14 | 0.667 | £13.15 | 8.67 | 1.18 | £8.76 | £2,310 | YES (+£0.94) |
| 15 | 0.714 | £13.52 | 8.14 | 1.04 | £10.26 | £2,544 | YES (+£1.31) |

**Marginal π = £14.64/hr at every row** (constant, omitted from table).

**Verification:** π_avg at d=12: CNHR(e) × kh × δ / H(δ) = 12.25 × 8.66 × 0.5714 / 9.71 = £6.24. ✓  
Monthly net marginal: £1,844 − £1,610 = £234. £2,077 − £1,844 = £233. Consistent within rounding. ✓

---

## 5. Marginal vs Average: What the Numbers Actually Say

### 5.1 Marginal π Is Constant

Each additional working day produces £161 of income and costs 11 free hours. Always. The 9th working day and the 15th working day have identical marginal economics: £14.64 per free hour traded. There are no diminishing returns in the earning process itself because trips are independent.

This means the decision rule is binary:

- If a free hour is worth more than £14.64 → do not add a working day
- If a free hour is worth less than £14.64 → add a working day
- The NLW constraint may override this preference (forcing more working days regardless)

### 5.2 Average π Rises With δ

Average π increases from £2.43 (d=8) to £10.00 (d=15) not because later days earn less, but because of how the fixed cost is distributed across the average.

At d=8, the first 4.2 working days go entirely to covering the £660 fixed cost. Only 3.8 days produce genuine profit. The average net earnings per free hour is low because much of the driving just pays rent on the vehicle.

At d=15, fixed cost recovery takes the same 4.2 days but there are 10.8 profit-producing days. The average is higher because a larger share of total driving generates surplus.

The gap between average π and marginal π (£14.64) measures cost-recovery overhead. At d=12, average π is £6.24 — roughly half the marginal. This means about half of each working day's value goes to fixed cost recovery. At d=15, average π is £10.26 — two-thirds of the marginal — meaning cost recovery is a smaller share and the driver is keeping more of each day's output.

### 5.3 Which to Use

| Question | Metric | Value at δ = 0.571 |
|----------|--------|---------------------|
| "Should I add a working day?" | Marginal π | £14.64 (constant) |
| "What fraction of my driving is cost recovery?" | 1 − (π_avg / π_marg) | 50% |
| "Is the cybersecurity study trade rational?" | Marginal π vs study value | £14.64 vs £26.70 → yes |
| "How does my schedule feel overall?" | Average π | £6.24 — moderate |

---

## 6. The Decision Rule

> **Work whenever marginal π (£14.64) < value of a free hour. Otherwise, stop.**

Since marginal π is constant, this gives a binary answer for any given ρ: either every additional working day is worth it, or none are. The resolution is the NLW constraint — it forces a minimum δ regardless of time-value preference.

### 6.1 Career Transition Value

If the cybersecurity traineeship leads to a £35,000 role and requires 1,311 hours of study:

> Value of a study hour ≈ £35,000 / 1,311 = **£26.70**

£26.70 > £14.64 → every free hour converted to study earns more than working that hour would. The rational strategy is to minimise working days. NLW compliance forces δ ≥ 0.601 (13 days). Therefore **13 days is the optimum** under this value system — not because of a smooth tradeoff, but because it is the minimum permitted by law.

### 6.2 Revealed Preference

If the driver's personal threshold for an hour of work is ~£10–15 (a common range for discretionary labour), the marginal π of £14.64 sits right at that boundary. The NLW constraint resolves this indifference by requiring at least 13 days.

---

## 7. ρ Sensitivity Through the Temporal Lens

The £200 vs £231 question is not primarily about money. It is about the character of daily life. Each row shows the minimum NLW-compliant position at that ρ, with all metrics recomputed for the correct δ.

| Daily earn | ρ (£/hr) | Min d/21 | δ | CNHR(e) | τ | π_avg | π_marg | Net/mo | Character |
|------------|----------|----------|---|---------|---|-------|--------|--------|-----------|
| £200 | £29.11 | 13 | 0.619 | £12.25 | 1.35 | £7.20 | £14.36 | £2,021 | Fallback. d=12 fails NLW. |
| **£203** | **£29.55** | **12** | **0.571** | **£12.25** | **1.55** | **£6.24** | **£14.64** | **£1,844** | **Primary. 4-on-3-off viable.** |
| £215 | £31.30 | 10 | 0.476 | £12.71 | 2.05 | £4.87 | £15.73 | £1,551 | Comfortable. τ doubles. |
| £231 | £33.62 | 8 | 0.381 | £12.65 | 2.82 | £3.54 | £17.18 | £1,235 | Abundant freedom. Low income. |

Three observations:

**CNHR(e) is approximately constant (~£12.3) across all rows.** This is not a coincidence — each row shows the minimum δ that just clears NLW, so CNHR(e) ≈ £12.21 by construction. The value of the analysis is in the other columns.

**Marginal π rises with ρ** — higher earnings mean each free hour costs more to buy. But NLW minimum δ falls with ρ — you can afford more rest days. The net effect: at £231/day, freedom is expensive per hour (£17.18 marginal) but abundant because only 8 working days are required.

**Monthly net falls as ρ rises** at the NLW-minimum position. This seems paradoxical: earning more per day produces less per month. The explanation: at higher ρ, the driver can meet NLW with fewer days, and at the minimum-δ point, the driver takes the freedom rather than the income. More days at higher ρ would produce more income, but the driver is choosing the minimum permitted.

**This is why the trial matters.** At £200/day, the Value of Time analysis is informational — NLW compliance dictates the schedule. At £231/day, it becomes decisional — the driver genuinely chooses δ based on the tradeoff between income and freedom.

---

## 8. Study Feasibility

The traineeship requires 1,311 hours by November 2026 (~244 days). Total free hours available = H(δ) × 244. Effective study = η × total free hours.

| η | Meaning | Free hours available | Effective study | Target met? | Margin |
|---|---------|---------------------|----------------|-------------|--------|
| 0.40 | Light discipline | 2,370h | 948h | No | −363h |
| 0.50 | Moderate discipline | 2,370h | 1,185h | No | −126h |
| **0.55** | **Required minimum** | **2,370h** | **1,304h** | **Yes (marginal)** | **−7h** |
| **0.59** | **Comfortable** | **2,370h** | **1,398h** | **Yes** | **+87h** |
| 0.70 | Intensive | 2,370h | 1,659h | Yes | +348h |

At δ = 0.571, the minimum viable η is 0.55 — converting 5.3 of 9.7 daily free hours to study. On working days (5 free hours), this means ~2.8 hours of productive study. On rest days (16 free hours), ~8.8 hours. The η requirement is less demanding than the d=13 pattern (0.55 vs 0.59) because the extra rest day provides 128 additional free hours across the cycle.

---

## 9. Warning Signals

Average π serves as an illustrative indicator of model health. Since corrected π_avg ranges from ~£2.50 (d=8) to ~£10.00 (d=15), thresholds are calibrated to this range:

| π_avg range | Signal | Interpretation |
|-------------|--------|---------------|
| < £4 | Green | Strong surplus. Fixed costs well-covered relative to free time. |
| £4–£7 | Amber | Moderate. Functional but roughly half of driving is cost recovery. |
| £7–£10 | Red | Tight. Most of each working day is going to costs. Limited surplus per free hour. |
| ≥ £10 | Critical | Average π approaching marginal π (£14.64). Nearly all earning is cost recovery. Model is at structural limit. |

The current position (π_avg = £6.24 at δ = 0.571) sits in the amber zone — functional, with approximately half of each working day dedicated to cost recovery and A decline in ρ below ~£27/hr would push π_avg above £10 and into the critical zone.

**Note:** Average π is shown only for illustration. The decision metric is always marginal π (£14.64).

---

## 10. Export Interface

| Export | Value | Notes |
|--------|-------|-------|
| τ | 1.55 | At δ = 0.571. Free hours per hour worked. |
| π_marginal | £14.64 | Constant. Independent of δ. The decision metric. |
| π_average | £6.24 | At δ = 0.571. Illustrative only. |
| H(δ) | 9.71 h/day | At δ = 0.571. Average free hours per day. |
| η requirement | ≥ 0.55 | For traineeship target at δ = 0.571. |
| Decision rule | Work if marginal π < value of free hour | Binary. NLW may override. |

These exports are informational. No downstream application currently depends on them. They exist to inform the driver's qualitative assessment of whether the SOM's recommended δ is liveable.

---

## 11. Versioning

| Version | Date | Change |
|---------|------|--------|
| 1.0 | Mar 2026 | Initial specification. H(δ), τ, π, η, decision rule. Separated from core and SOM. |
| 1.1 | Mar 2026 | Monthly net recalculated (d=8,9,10 overstated by ~£208). π formula corrected for kh/11 dimensional consistency (27.1% overstatement). Marginal π introduced as primary decision metric. Diminishing returns rewritten. H(δ) d=15 corrected (7.14→8.14). |
| 1.2 | Mar 2026 | **Average π computation corrected:** table was missing ×δ factor in π_avg = CNHR(e) × kh × δ / (16 − 11δ), overstating by 1/δ. Corrected π_avg at d=13: £7.22 (was £11.67). Warning signal thresholds recalibrated. ρ sensitivity table recomputed with correct CNHR(e) at each ρ's minimum δ. Added "Note: average π is illustrative only" per review recommendation. Marginal π and all decision rules unchanged. |

---

*— End of Application Specification —*
