# Changelog

All notable changes to the CNHR-MNHR Framework.

## [v4.0-4on3off] — March 2026 (Current)

- **APP-001:** Primary pattern changed to d=12 (4-on-3-off, uniform weekly). Target ρ revised to £203/day. K relaxed to 4 (trial-dependent). d=13 retained as fallback.
- **APP-001:** Cost decomposition expanded: v identified as function of distance/hours (not days), F as function of time. Weekly formulation established as fundamental for non-uniform shifts. §3.5 added (hour distribution constraints: Uber 10hr trip cap, WTR). §10.5 added (sub-weekly cost attribution dependency on v_per_hour for real-time metrics). v_per_hour and F_per_hour added to export interface.
- **APP-002 v1.3:** ρ-sensitivity table CNHR(e) corrected for three non-primary rows (£200→£12.39, £215→£12.36, £231→£12.30). Downstream π_avg corrected. Real-time application note added to §10.
- **ARCH-001:** §3.3 expanded from summary table to full derivations of three structural properties (NLW attractor with integer discretisation, Day-3 checkpoint with dual-threshold framing, hours dominance with 14× leverage ratio). §3.4 added: control-system interpretation (target/sensor/actuator/feedback mapping). Sentinel relationship documented. Duplicate remodelling log entry cleaned. Reference implementation marked as done. η tracking added to future directions.
- **CORE-001:** Cross-reference to ARCH-001 §3.3 Property 2 added in §5.3.
- **Tools:** cnhr_calculator.py — reference Python implementation computing all framework outputs. Single source of truth for all numerical values. Includes sensitivity table generator.
- **Operational:** Work schedule PDF rebuilt for v4.0. Companion Guide created (14 sections, Feynman-technique examples, plain-language explanations of all terms and strategy, corrected fallback pattern with Fri/Sun rest days).
- **Identified (not yet integrated):** Income Tax + Class 4 NI as third cost category (T). Annual tax+NI = £2,465 at d=12 (26% marginal on profit above £12,570). Post-tax CNHR(e) = £10.88/hr, monthly take-home = £1,639. NLW assessed pre-tax; post-tax is the take-home metric.

## [v3.1-corrections] — March 2026

- **APP-002 v1.2:** Average π table corrected (missing ×δ factor, overstated by 1/δ). Corrected π_avg at d=13: £7.22 (was £11.67).
- **APP-002 v1.1:** Monthly net recalculated (d=8,9,10 overstated by ~£208). π formula corrected for kh/11 dimensional consistency (27.1% overstatement). Marginal π (£14.36, constant) introduced as primary decision metric. H(δ) at d=15 corrected (7.14→8.14).
- **APP-001:** d=8 CNHR corrected from £8.58 to £8.72. Monthly net values aligned with first-principles calculation.

## [v3.0-separated] — March 2026

- **Architecture:** Core/application separation established. ARCH-001 created.
- **CORE-001:** Extracted from SOM-001 Final. Defines CNHR, MNHR, derivative, attractor dynamics. Added §8 (Statistical Properties).
- **APP-001:** Extracted from SOM-001 Final. Cost decomposition (F/v), δ generalisation, pattern generation, monitoring protocol.
- **APP-002:** New. Value of time analysis with τ, π, η, decision rule.
- Phase 10 external evaluation findings integrated across all documents.

## [v2.2-financial] — March 2026

- Financial model rebuilt from first principles. Cost decomposition: £220 fixed + £210 variable = £430.
- Charging economics: 3.8% of gross. Retention rate: 53.5p per £1 earned.
- Cross-check: first-principles £1,804/month vs model £1,783 (£21 rounding).

## [v2.0-day] — March 2026

- Transition from night (23:00–09:00) to day (04:00–14:00) shift model.
- v2.1: Rest days revised from Wed+Sat to Wed+Sun. Night-shift carry-over artefact identified.
- Structural demand analysis added.

## [v1.0-night] — March 2026

- Initial release. Night shift model. C_W = £430. Fixed 5-2-5-2-7 pattern.
- £192/day target. £19,955 annual net.
