# Sustainable Operations Model

## Application Specification

**Document ID:** APP-001 (SOM) v2  
**Date:** March 2026  
**Author:** Shehzad Qayum  
**Status:** Active — pending trial validation  
**Imports from CORE-001:** ρ, α, r, k, CNHR dynamics, binding constraint finding  
**Exports to APP-002:** δ, F, v, h, shift window, pattern

**v2 change:** Primary pattern updated from d=13 (5-5-3, mixed weekly structure) to d=12 (4-4-4, uniform weekly structure). Target daily earnings revised from £200 to £203. Fatigue constraint relaxed from K=3 to K=4 (subject to trial validation).

---

## 1. Purpose

This application consumes the core CNHR-MNHR framework's outputs and answers: **how should I schedule working and rest days to maintain NLW compliance while maximising free time?**

It introduces concepts that do not exist in the core: cost decomposition (F, v), working density (δ), shift specification, structural demand analysis, pattern generation, and an operational monitoring protocol.

---

## 2. Imports from Core

| Import | Value Used | Notes |
|--------|-----------|-------|
| ρ | £29.55/hr (target) | Corresponds to £203/day. Pending trial. |
| α | 1.26 | Stable. |
| r | 0.687 | Stable. |
| k | 0.866 | Derived: r × α. |
| Binding constraint | Hours dominate rate | Drives emphasis on sustainable scheduling. |

---

## 3. Concepts Introduced by This Application

### 3.1 Cost Decomposition

All operating costs separate into two categories with distinct scaling behaviour:

**Fixed (F = £31.43/day):** Insurance, vehicle finance, phone, MOT, PCO, incidentals. Accrues every calendar day regardless of activity. F is a function of **time** — it does not change if shifts are lengthened, shortened, or redistributed.

**Variable (v = £42.00/day):** Primarily charging cost, plus congestion, tyres, maintenance, cleaning, wear reserve. v is a function of **distance driven**, which is approximately proportional to hours worked. One full 10-hour shift corresponds to approximately one full charge cycle (~200+ miles, 38.4 kWh at 20–80%). The daily v figure of £42 is calibrated to a 10-hour shift; non-standard shift lengths would scale v proportionally.

For any block of N days with d working days at h = 10 hours: **Total cost = 31.43N + 42d.**

**Weekly formulation (more fundamental).** When shifts are non-uniform (e.g., 3×13 + 1×1 instead of 4×10), the daily cost equation breaks down because v no longer maps cleanly to integer days. The correct general form is:

> **Net_week = Σ revenue − F_week − v_week**
>
> where F_week = £220 (fixed, calendar-determined), and v_week ≈ v_per_hour × total_hours_worked.

For any fixed 40-hour week, v_week is constant regardless of how those hours are distributed across days. The daily model (Total cost = 31.43N + 42d) is a special case that holds when all shifts are 10 hours. For brevity, the remainder of this document assumes uniform 10-hour shifts; the weekly formulation becomes operative if non-uniform schedules are adopted.

**Pending empirical work.** The naive estimate of v_per_hour ≈ £4.20 (£42/10hr) conflates active driving with waiting/idle time. A more precise determination from charging receipts correlated with hours worked over a multi-week sample would enable accurate sub-daily cost attribution — a prerequisite for real-time performance metrics (see §10.5).

### 3.2 Working Density δ

> **δ = d / N**

The fraction of days that are working days. δ is the single control variable. Once set, all outputs follow deterministically.

**Block length irrelevance:** CNHR depends only on ρ and δ. N cancels algebraically. N = 21 is used as the operational cycle for scheduling convenience.

### 3.3 Shift Specification

- Window: 04:00–14:00 (10 hours)
- Sleep: 20:00–04:00 (8 hours, non-negotiable)
- Transition: 14:00–15:00 (1 hour)
- Free block: 15:00–20:00 (5 hours on working days)

### 3.4 Structural Demand Scoring

Each day scored 0–4 per 2-hour block based on real demand drivers (airport schedules, commuter patterns, school runs), not historical ρ which is contaminated by night-shift carry-over artefacts.

| Day | Score (/20) | Key insight |
|-----|-------------|-------------|
| Monday | 14 | Peak commute — always work |
| Tuesday | 14 | Peak commute — always work |
| Thursday | 12 | Strong commute — always work |
| Wednesday | 11 | Moderate — work (completes 4-day block) |
| Friday | 10 | Weakest weekday — rest (starts 3-day block) |
| Saturday | 8 | Limited AM demand — rest |
| Sunday | 6 | Structurally dead 04:00–08:00 — always rest |

The top 4 demand days (Mon, Tue, Wed, Thu) form a contiguous block. The bottom 3 (Fri, Sat, Sun) form a contiguous rest block. This alignment between demand ranking and pattern structure is the reason the 4-on-3-off design works — the working days are the highest-demand days and the rest days are the lowest.

### 3.5 Hour Distribution Constraints

The 40 weekly clock hours could in principle be distributed non-uniformly across working days (e.g., 3×13+1, 2×12+2×8, 5×8). Three constraint layers govern what configurations are feasible:

**Platform (Uber UK).** Drivers are disconnected after 10 hours of accumulated trip time within a session, with a mandatory 6-hour offline reset. At r = 0.687, a 10-hour clock shift produces only ~6.87 hours of trip time — well under the cap. The platform limit becomes binding at approximately 14.5 clock hours per shift.

**Regulatory (Working Time Regulations).** Since the Supreme Court classified Uber drivers as workers, WTR protections apply: 11 hours uninterrupted rest between shifts, 48-hour average weekly maximum (opt-out available), and 24 hours uninterrupted rest per 7-day period (or 48 hours per 14 days). The current 4×10 pattern clears all constraints with margin (13-hour gap between shifts = 11hr rest + 2hr buffer).

**Practical (fatigue).** Night driving fatigue is non-linear. Hours 9–10 of a shift carry disproportionate accident risk relative to hours 1–5. Extending individual shifts beyond 10 hours would push into a zone where per-hour safety cost rises sharply, even if the platform and regulations permit it.

**Implication.** Non-uniform hour distributions are feasible within these bounds but require v_per_hour for accurate per-shift cost attribution. Until that parameter is empirically established, non-uniform schedules are measurable at the weekly level but not diagnosable at the shift level (see §10.5).

---

## 4. The Applied CNHR Equation

Substituting the cost decomposition into the core's CNHR formula:

> **CNHR(e) = ρ/α − 4.85 − 3.63/δ**

| Component | Source | Value at δ = 0.571 | Controllable? |
|-----------|--------|---------------------|---------------|
| Attractor (ρ/α) | Core | £23.45/hr | No — market-given |
| Variable drag | This application | £4.85/hr | No — irreducible cost of driving |
| Fixed drag (3.63/δ) | This application | £6.35/hr | Yes — the only scheduling lever |

---

## 5. Target ρ and NLW Compliance

### 5.1 Minimum Viable ρ

For d=12 (δ = 12/21 = 0.571) to clear NLW (£12.21/hr):

> **Minimum ρ = £29.50/hr → minimum daily earnings = £203**

This is £3 above the conservative £200/day assumption. The trial must confirm that the 04:00–14:00 shift window sustains at least £203/day on average.

### 5.2 Sensitivity

| Daily earnings | ρ (£/hr) | CNHR(e) | NLW headroom | Monthly net | Status |
|----------------|----------|---------|-------------|-------------|--------|
| £200 | £29.11 | £11.90 | −£0.31 | £1,792 | FAIL — fallback to d=13 |
| **£203** | **£29.55** | **£12.25** | **+£0.04** | **£1,844** | **PASS — minimum viable** |
| £205 | £29.84 | £12.48 | +£0.27 | £1,879 | PASS — small buffer |
| £210 | £30.57 | £13.05 | +£0.84 | £1,966 | PASS — comfortable |
| £220 | £32.02 | £14.21 | +£2.00 | £2,139 | PASS — strong |
| £231 | £33.62 | £15.48 | +£3.27 | £2,331 | PASS — abundant headroom |

### 5.3 Fallback

If the trial shows daily earnings consistently below £203, two options:

1. **Increase to d=13 (δ = 0.619).** Reverts to the prior pattern (Section 8). NLW minimum drops to £200/day.
2. **Extend shift window.** If ρ is marginally below target, shifting from 04:00–14:00 to 04:00–15:00 (11h shift) may close the gap without adding a working day.

---

## 6. Primary Pattern: 4-On-3-Off

### 6.1 Schedule

```
         Mon   Tue   Wed   Thu   Fri   Sat   Sun
Week 1:   W     W     W     W     R     R     R
Week 2:   W     W     W     W     R     R     R
Week 3:   W     W     W     W     R     R     R
```

- Working days: 4 × 3 = **12** ✓
- Max consecutive: 4 (Mon–Thu) — requires K=4 validation during trial
- Sundays: all rest ✓
- Every week identical — one template to remember
- 3-day rest block every week (Fri–Sun)

### 6.2 Why This Pattern

The 4-on-3-off design aligns with three structural properties simultaneously:

**Demand alignment.** The four highest-demand days (Mon 14, Tue 14, Thu 12, Wed 11 = total 55/80 available points) are all working days. The three lowest (Fri 10, Sat 8, Sun 6 = total 24/80) are all rest days. No demand is wasted on rest, no weak demand absorbs a working day.

**Uniform rhythm.** Every week is identical. No "heavy week" vs "light week" vs "off week" distinction. The driver and the driver's household can plan around one unchanging template. This eliminates the cognitive overhead of variable scheduling.

**Consistent recovery.** Three days off every week — not one large block every three weeks. For sustained study alongside shift work, regular 3-day blocks (Fri–Sun) are more productive than a single 4-day block interspersed with 2-day gaps. The study conversion factor η is easier to sustain with consistent weekly rhythm.

### 6.3 Fatigue Constraint

This pattern requires K=4 (max 4 consecutive working days). The prior model used K=3, inherited from the night shift. Day shifts (04:00–14:00 with 8 hours circadian-aligned sleep) are structurally less fatiguing than night shifts. The trial must validate whether 4 consecutive day shifts are sustainable. If not, the fallback pattern (Section 8) uses K=3.

---

## 7. Monitoring Protocol

### 7.1 Daily Floor

> **Daily floor = NLW × αrh + F/δ + v = 105.78 + 55.00 + 42 = £203**

At this pattern, the daily floor equals the target daily earnings exactly. There is no margin between floor and target — every working day must average £203. This is tight by design. The model operates at the NLW boundary to maximise free time.

### 7.2 Day 3 Checkpoint

After 3 shifts (30 hours), cumulative earnings ≥ 3 × daily floor.

> **Day 3 checkpoint: £608**

This checkpoint falls on Wednesday evening. If cumulative Monday–Wednesday earnings are below £608, the signal is clear before Thursday's shift.

**Mathematical basis (ARCH-001 §3.3, Property 2).** The Day-3 checkpoint is not an arbitrary choice. At s = 30 shift hours, the cost drag C_w/(k·s) has decayed to £14.93/hr — low enough that the ρ signal (±£4/hr day-to-day variation) is detectable against the residual noise. Day 3 is also the final decision point before the intervention window closes: the sacrifice rule (§7.4) must be decided Wednesday evening to enact on Friday. The checkpoint sits at the intersection of sufficient projection reliability (3/4 of shifts completed) and remaining intervention capacity — the optimal sensor placement in the feedback loop (ARCH-001 §3.4).

### 7.3 Monitoring Table

| After shift | Cumul. target | If below | If above |
|-------------|---------------|----------|----------|
| Day 1 (Mon) | £203 | Note only | On track |
| Day 2 (Tue) | £406 | Trend forming | On track |
| Day 3 (Wed) | £608 | **FLAG: sacrifice rest day** | Rest days protected |
| Day 4 (Thu) | £811 | Confirm sacrifice | On track / NLW compliant |

### 7.4 Sacrifice Rule

If below at Day 3, convert one rest day to a working day for that week only:

1. **First choice: Friday** (demand score 10, highest among rest days).
2. **Second choice: Saturday** (demand score 8).
3. **Sunday is never sacrificed** (structurally dead morning).
4. Maximum one sacrifice per week. If two consecutive weeks require sacrifice, reassess ρ — the model may need to revert to d=13.

A sacrifice converts the week from 4-on-3-off to 5-on-2-off for that week only. This produces d=13 for the cycle — exactly the fallback pattern.

---

## 8. Fallback Pattern: d=13 (K=3 or K=4)

If the trial shows ρ < £203/day or K=4 proves unsustainable:

```
         Mon   Tue   Wed   Thu   Fri   Sat   Sun
Week 1:   W     W     W     R     W     W     R
Week 2:   W     W     W     R     W     W     R
Week 3:   W     W     W     R     R     R     R
```

Working: 13 days. Max consecutive: 3 (Mon–Wed). Thursday rest breaks the run. Week 3 provides a 4-day recovery block (Thu–Sun). Daily floor drops to £199 (at £200/day ρ).

---

## 9. Key Metrics Summary

At target ρ = £29.55/hr (£203/day), d = 12, δ = 0.571:

| Metric | Value |
|--------|-------|
| **Working pattern** | **Mon–Thu on, Fri–Sun off, every week** |
| Working days per cycle | 12 |
| Rest days per cycle | 9 |
| δ (working density) | 0.571 |
| CNHR(e) | £12.25/hr |
| NLW headroom | +£0.04/hr |
| Monthly net income | £1,844 |
| Daily floor | £203 |
| Day 3 checkpoint | £608 |
| Cycle cost (21 days) | £1,164 |
| Net contribution per working day | £161 |
| Shift window | 04:00–14:00 |
| Sleep window | 20:00–04:00 |

---

## 10. Known Limitations

### 10.1 NLW Headroom

At +£0.04/hr, the model has essentially zero NLW margin. It operates exactly at the regulatory boundary. Any sustained ρ decline below £203/day triggers the fallback. This is an accepted trade — the margin is exchanged for free time.

### 10.2 Shift Heterogeneity

The framework assumes expected earnings per shift are approximately constant. In practice, Monday earnings may differ from Thursday earnings. The 04:00–14:00 window constrains this — all four working days capture the same morning commute peak — but variation exists. The trial should track day-of-week ρ separately.

### 10.3 K=4 Fatigue Assumption

Four consecutive day shifts is untested. If fatigue degrades performance or safety on Day 4, the fallback pattern (K=3, d=13) provides a tested alternative.

### 10.4 No Exit Condition

If ρ falls below ~£25/hr sustained, the rational decision may be to stop driving entirely. This is not modelled.

### 10.5 Sub-Weekly Cost Attribution

The framework's target analytical capability is real-time performance metrics at hourly, daily, weekly, and monthly granularity — enabling decisions such as whether the current day is outperforming baseline, whether a shift can end early, or how many more hours are required to meet the weekly target. This requires cost attribution at every level.

Weekly and monthly CNHR are calculable today: F_week is calendar-fixed (£220), v_week is constant for any 40-hour week, and revenue is observed directly. However, intra-week attribution (per-shift and per-hour CNHR/MNHR) requires two parameters not yet empirically determined:

**v_per_hour** — the average variable cost per hour worked. The naive estimate is £4.20 (£42/10hr), but this conflates active driving (high energy draw) with idle/waiting time (low draw). True v_per_hour should be derived from charging receipts correlated with hours worked over a sufficiently large sample.

**F_per_hour (provisional)** — fixed costs allocated as £220/40hr = £5.50/hr. This figure changes if total weekly hours change. The operational approach is to use the planned 40 hours as the denominator and flag outperformance as surplus against baseline.

Until v_per_hour is established empirically, real-time CNHR carries an allocation uncertainty of approximately ±£1–2/hr in the cost layer. For directional decisions (end shift early vs continue), this uncertainty is tolerable. For precise hourly performance comparison across days or weeks, it must be resolved. This is a critical dependency for the Sentinel advisory system.

---

## 11. Export Interface

| Export | Value | Consumed by |
|--------|-------|-------------|
| δ | 0.571 (pending trial) | APP-002 |
| F | £31.43/day | APP-002 |
| v | £42.00/day | APP-002 |
| h | 10 hours | APP-002 |
| Shift window | 04:00–14:00 | APP-002 |
| Pattern | WWWWRRR × 3 | APP-002 |
| Daily floor | £203 | Operational use |
| Day 3 checkpoint | £608 | Operational use |
| v_per_hour | Pending (naive: £4.20) | Sentinel, real-time metrics |
| F_per_hour | £5.50 (provisional at 40hr/wk) | Sentinel, real-time metrics |
| Weekly formulation | Net = ΣR − £220 − (v_per_hour × Σhours) | Non-uniform schedules, Sentinel |

---

## 12. Versioning

| Version | Date | Change |
|---------|------|--------|
| v1.0 | Mar 2026 | Night model. C_W = £430. Fixed 5-2-5-2-7. |
| v2.0 | Mar 2026 | Day model transition. 04:00–14:00. |
| v2.1 | Mar 2026 | Rest days revised (Wed+Sun). Structural demand analysis. |
| v2.2 | Mar 2026 | Financial model rebuilt from first principles. |
| Final | Mar 2026 | Self-contained consolidation. |
| Separated | Mar 2026 | Separated from core. F/v decomposition. δ generalisation. d=13 reference. |
| **Current** | **Mar 2026** | **Primary pattern changed to d=12 (4-on-3-off, uniform weekly). Target ρ revised to £203/day. K relaxed to 4 (trial-dependent). d=13 retained as fallback.** |
| Post-separation | Mar 2026 | Cost decomposition expanded: v identified as function of distance/hours (not days), F as function of time. Weekly formulation (Σ revenue − Σ costs / Σ engaged hours) established as fundamental. Hour distribution constraints documented (Uber 10hr trip cap, WTR). §10.5 added: sub-weekly cost attribution dependency on v_per_hour for real-time metrics. v_per_hour and F_per_hour added to export interface as pending. |

---

*— End of Application Specification —*
