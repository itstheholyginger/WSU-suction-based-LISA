const LABELS = {
    c: 'C: Soil Cohesion (kPa)',
    c_r: 'C_r: Root cohesion (kPa)',
    phi: 'phi: Effective Angle of Friction (deg)',
    k_s: 'k_s: Saturated Hydraulic Conductivity (m/s',
    a: "Van Genuchten's parameter a (1/kPa)",
    n: "Van Genuchten's parameter n",
    gamma: 'gamma: Soil Weight (kN/m3)',
    gamma_w: "gamma_w: Unit Weight of Water (kN/m3)",
    slope: "Beta: Slope (deg)",
    q: "q: Infiltration (m/s)",
    H_wt: "H_wt: Distance from surface to water table (m)",
    z_step: "Z Step: Used to calculate values to analysis values" +
        "between 0 and H_wt (m)"
}

export default LABELS;