var data = {
    numVars: 1000,
    conf: 'nondet',
    sat: true,
    randVars: {
        c: {
            dist: 'truncnormal',
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        c_r: {
            dist: 'truncnormal',
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        phi: {
            dist: 'truncnormal',
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        k_s: {
            dist: 'truncnormal',
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        a: {
            dist: 'truncnormal',
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        n: {
            dist: 'truncnormal',
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        }
    },
    constVars: {
        gamma: 0,
        gamma_w: 0,
        slope: 0,
        flux: 0
    }
}
// use this normally
var results = {
    randVars: {
        c: {
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        c_r: {
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        phi: {
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        k_s: {
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        a: {
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        },
        n: {
            low: 0,
            high: 0,
            mean: 0,
            stdev: 0
        }
    },
    z: {}
}
// datasets to use while testing
var testing = {
    data: {
        numVars: 1000,
        sat: false,
        conf: 'nondet',
        randVars: {
            c: {
                dist: 'truncnormal',
                low: 0,
                high: 4,
                mean: 1.058,
                stdev: 0.647
            },
            c_r: {
                dist: 'constant',
                const_val: 0
            },
            phi: {
                dist: 'truncnormal',
                low: 30,
                high: 48.9,
                mean: 36.055,
                stdev: 3.058

            },
            k_s: {
                dist: 'constant',
                const_val: 1e-6
            },
            a: {
                dist: 'truncnormal',
                low: 0.025,
                high: 0.7,
                mean: 0.323,
                stdev: 0.093
            },
            n: {
                dist: 'lognormal',
                low: 1.672,
                high: 7.78,
                logmean: 1.302,
                logstdev: 0.22
            }
        },
        constVars: {
            gamma: 18,
            gamma_w: 9.81,
            slope: 45,
            // q: -6.5e-7,
            q: 0,
            H_wt: 5,
            z_step: 0.2
        }
    }
}

export { data, results, testing }
