import numpy as np
import statistics
import scipy.stats
from scipy.stats import truncnorm, lognorm
import math

# normal distribution is calculated with mean, standard deviation, and number of variables


class TruncNormalVariable():
    def __init__(self, name, mean, stdev, low, high, num_vars):
        self.name = str(name)
        self.mean = float(mean)
        self.stdev = float(stdev)
        self.low = float(low)
        self.high = float(high)
        self.num_vars = int(num_vars)
        self.details()
        self.vals = self.calc_vals()
        self.dist = "Truncated Normal"

    def __str__(self):
        return "Random Variable {0} has a Normal Distribution. min: {1} max: {2}\
            mean: {3} stdev: {4}".format(self.name, self.low,
                                         self.high, self.mean, self.stdev)

    def details(self):
        print("Calculating Truncated Normal with these parameters: mean: {0}, \
            stdev: {1}, min: {2}, max: {3}".format(self.mean, self.stdev,
                                                   self.low, self.high))

    def calc_vals(self):
        stdev = self.stdev
        if stdev == 0:
            print(
                "Normal Distribution's stdev is 0, setting to 0.00001" +\
                "instead to avoid divide by 0 error.")
            stdev = 0.00001

        a = (self.low - self.mean) / stdev
        b = (self.high - self.mean) / stdev
        vals = truncnorm.rvs(a, b, loc=self.mean,
                             scale=self.stdev, size=self.num_vars)
        if min(vals) < 0:
            import pdb
            pdb.set_trace()
            print("something is wrong here")
        return vals


class UniformVariable():
    def __init__(self, name,  low, high, num_vars):
        self.name = str(name)
        self.low = float(low)
        self.high = float(high)
        self.num_vars = int(num_vars)
        self.vals = self.calc_vals()
        self.mean = self.vals.mean()
        self.stdev = statistics.stdev(self.vals)
        self.dist = "Uniform"

    def __str__(self):
        return "Random Variable {0} has a Uniform Distribution. min: {1} max: {2} mean: {3} stdev: {4} \
            ".format(self.name, self.low, self.high, self.mean, self.stdev)

    def details(self):
        print("Calculating Uniform with these parameters: min: {2}, max: {3}"
              .format(self.low, self.high))

    def calc_vals(self):
        vals = np.zeros(self.num_vars)
        for i in range(self.num_vars):
            vals[i] = (scipy.stats.uniform(self.low, self.high).rvs())
        return vals


class BivariateVariable():
    def __init__(self, name, means, cov, num_vars):
        self.name = str(name)
        self.means = means
        self.cov = cov
        self.num_vars = num_vars
        self.vals = self.calc_vals()
        self.stdev = statistics.stdev(self.vals)
        self.low = min(self.vals)
        self.high = max(self.vals)
        self.dist = "Bivariate Normal"

    def split_cov(self, cov):
        return cov

    def calc_vals(self):
        # import pdb; pdb.set_trace()
        # print(self.means)
        # print(self.cov)
        vals = np.random.default_rng().multivariate_normal(
            self.means, self.cov, size=self.num_vars)
        # print(vals)
        return vals


class LognormalVariable():
    def __init__(self, name, s, num_vars):
        self.name = str(name)
        self.s = float(s)
        self.details()
        self.num_vars = int(num_vars)
        self.vals = self.calc_vals()
        self.mean = self.vals.mean()
        self.stdev = statistics.stdev(self.vals)
        self.low = min(self.vals)
        self.high = max(self.vals)
        self.dist = "Lognormal Distribution"

    def details(self):
        print("Calculating Lognormal with these parameters: s: {0}"
              .format(self.s))

    def calc_vals(self):
        vals = lognorm(self.s, loc=0, scale=1).rvs(size=self.num_vars)
        return vals


class ConstantVariable():
    def __init__(self, name, val, num_vars):
        self.name = str(name)
        self.const_val = float(val)
        self.details()
        self.num_vars = int(num_vars)
        self.vals = self.calc_vals()
        self.min = val
        self.max = val
        self.mean = val
        self.stdev = val
        self.dist = "Constant"

    def details(self):
        print("Calculating Constant with these parameters: const_val: {0}"
              .format(self.const_val))

    def calc_vals(self):
        return [self.const_val] * self.num_vars
