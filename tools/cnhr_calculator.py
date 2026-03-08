#!/usr/bin/env python3
"""CNHR-MNHR Framework — Reference Implementation

Computes all framework outputs from input parameters.
Eliminates rounding ambiguity by serving as the single source of truth.

Document chain: CORE-001 (ρ,α,r) → APP-001 (δ,F,v,h) → APP-002 (τ,π,H,η)
"""

def framework(rho, alpha, r, h, F_day, v_day, d, N=21, nlw=12.21, study_hours=1311):
    """Compute all framework outputs.

    Parameters
    ----------
    rho   : float  Trip earning rate (£/hr). CORE-001.
    alpha : float  Engagement multiplier. CORE-001.
    r     : float  Trip ratio (trip hrs / shift hrs). CORE-001.
    h     : float  Shift length (clock hours). APP-001.
    F_day : float  Fixed cost per calendar day (£). APP-001.
    v_day : float  Variable cost per working day (£). APP-001.
    d     : int    Working days per cycle. APP-001.
    N     : int    Cycle length in days (default 21). APP-001.
    nlw   : float  National Living Wage (£/hr, default 12.21). APP-001.
    study_hours : float  Traineeship target hours (default 1311). APP-002.

    Returns
    -------
    dict  All framework outputs with full precision.
    """
    # CORE-001 derived
    k = r * alpha
    kh = alpha * r * h  # engaged hours per shift

    # APP-001 applied
    delta = d / N
    cnhr_e = rho / alpha - v_day / kh - F_day / (kh * delta)
    daily_gross = rho * r * h
    daily_net = daily_gross - v_day
    F_week = F_day * 7
    v_week = v_day * (d / (N / 7))  # v per week at this d/N

    # Weekly formulation
    days_per_week = 7
    d_per_week = d * days_per_week / N
    revenue_week = daily_gross * d_per_week
    cost_week = F_week + v_day * d_per_week
    engaged_hours_week = kh * d_per_week
    cnhr_week = (revenue_week - cost_week) / engaged_hours_week

    # Monthly net
    monthly_net = 30.44 * ((daily_gross - v_day) * delta - F_day)

    # NLW compliance
    nlw_compliant = cnhr_e >= nlw
    nlw_headroom = cnhr_e - nlw

    # Minimum δ for NLW
    headroom_rho = rho / alpha - v_day / kh - nlw
    delta_min = (F_day / kh) / headroom_rho if headroom_rho > 0 else float('inf')
    d_min_exact = delta_min * N
    d_min_int = int(d_min_exact) + (1 if d_min_exact != int(d_min_exact) else 0)

    # APP-001 monitoring
    daily_floor = nlw * kh + F_day / delta + v_day
    day3_checkpoint = daily_floor * 3

    # APP-002 temporal
    H_delta = 16 - 11 * delta           # average free hours per day
    tau = (16 - 11 * delta) / (11 * delta)  # free hrs per work hr
    pi_marginal = daily_net / 11         # £ per free hour (constant)
    pi_average = cnhr_e * kh * delta / H_delta  # £ per free hour (varies)

    # APP-002 study feasibility
    eta_required = study_hours / (H_delta * 244) if H_delta > 0 else float('inf')

    # Cost attribution (for real-time metrics)
    v_per_hour_naive = v_day / h
    F_per_hour = F_week / (d_per_week * h)

    return {
        # CORE-001
        'rho': rho, 'alpha': alpha, 'r': r, 'k': k, 'kh': kh,
        # APP-001 schedule
        'd': d, 'N': N, 'delta': delta,
        'd_min_exact': d_min_exact, 'd_min_int': d_min_int, 'delta_min': delta_min,
        # APP-001 financial
        'cnhr_e': cnhr_e, 'cnhr_week': cnhr_week,
        'daily_gross': daily_gross, 'daily_net': daily_net,
        'monthly_net': monthly_net,
        'daily_floor': daily_floor, 'day3_checkpoint': day3_checkpoint,
        'F_day': F_day, 'F_week': F_week, 'v_day': v_day,
        'v_per_hour_naive': v_per_hour_naive, 'F_per_hour': F_per_hour,
        # APP-001 compliance
        'nlw': nlw, 'nlw_compliant': nlw_compliant, 'nlw_headroom': nlw_headroom,
        # APP-002 temporal
        'H_delta': H_delta, 'tau': tau,
        'pi_marginal': pi_marginal, 'pi_average': pi_average,
        'eta_required': eta_required,
    }


def print_report(out):
    """Print a formatted summary of all framework outputs."""
    print("=" * 60)
    print("CNHR-MNHR Framework — Reference Calculation")
    print("=" * 60)
    print(f"\n--- CORE-001 Parameters ---")
    print(f"  ρ = £{out['rho']:.2f}/hr   α = {out['alpha']:.3f}   r = {out['r']:.3f}")
    print(f"  k = {out['k']:.4f}   kh = {out['kh']:.3f} engaged hrs/shift")
    print(f"\n--- APP-001 Schedule ---")
    print(f"  d = {out['d']}/{out['N']}   δ = {out['delta']:.4f}")
    print(f"  Min d for NLW: {out['d_min_exact']:.2f} (exact), {out['d_min_int']} (integer)")
    print(f"\n--- APP-001 Financial ---")
    print(f"  CNHR(e) = £{out['cnhr_e']:.2f}/hr")
    print(f"  Daily gross = £{out['daily_gross']:.2f}   Daily net = £{out['daily_net']:.2f}")
    print(f"  Monthly net = £{out['monthly_net']:.0f}")
    print(f"  Daily floor = £{out['daily_floor']:.2f}   Day-3 checkpoint = £{out['day3_checkpoint']:.2f}")
    print(f"  NLW compliant: {'YES' if out['nlw_compliant'] else 'NO'} "
          f"(headroom £{out['nlw_headroom']:.2f})")
    print(f"  v_per_hour (naive) = £{out['v_per_hour_naive']:.2f}   "
          f"F_per_hour = £{out['F_per_hour']:.2f}")
    print(f"\n--- APP-002 Temporal ---")
    print(f"  H(δ) = {out['H_delta']:.2f} free hrs/day")
    print(f"  τ = {out['tau']:.2f} (free hrs per work hr)")
    print(f"  π_marginal = £{out['pi_marginal']:.2f}/hr (constant)")
    print(f"  π_average  = £{out['pi_average']:.2f}/hr (at this δ)")
    print(f"  η required = {out['eta_required']:.3f} (for {1311}hr traineeship)")
    print("=" * 60)


def sensitivity_table(alpha, r, h, F_day, v_day, N=21):
    """Print the ρ-sensitivity table (APP-002 §7)."""
    print(f"\n{'Daily':>6} {'ρ':>7} {'d':>3} {'δ':>7} {'CNHR(e)':>8} {'τ':>6} "
          f"{'π_avg':>7} {'π_marg':>7} {'Net/mo':>8} {'NLW?':>5}")
    print("-" * 75)
    for daily, d in [(200, 13), (203, 12), (215, 10), (231, 8)]:
        rho = daily / (r * h)
        out = framework(rho, alpha, r, h, F_day, v_day, d, N)
        nlw_str = f"+{out['nlw_headroom']:.2f}" if out['nlw_compliant'] else f"{out['nlw_headroom']:.2f}"
        marker = " **" if daily == 203 else ""
        print(f"£{daily:>4} £{rho:>5.2f} {d:>3} {out['delta']:>7.4f} "
              f"£{out['cnhr_e']:>6.2f} {out['tau']:>6.2f} "
              f"£{out['pi_average']:>5.2f} £{out['pi_marginal']:>5.2f} "
              f"£{out['monthly_net']:>6.0f} {nlw_str}{marker}")


if __name__ == '__main__':
    # Primary operating point: d=12, ρ=£203/day
    out = framework(rho=29.55, alpha=1.26, r=0.687, h=10,
                    F_day=31.43, v_day=42.0, d=12)
    print_report(out)

    # Fallback: d=13, ρ=£200/day
    print("\n\n--- FALLBACK (d=13, £200/day) ---")
    out_fb = framework(rho=29.11, alpha=1.26, r=0.687, h=10,
                       F_day=31.43, v_day=42.0, d=13)
    print_report(out_fb)

    # ρ-sensitivity table (APP-002 §7)
    print("\n\n--- ρ-SENSITIVITY TABLE (APP-002 §7) ---")
    sensitivity_table(1.26, 0.687, 10, 31.43, 42.0)
