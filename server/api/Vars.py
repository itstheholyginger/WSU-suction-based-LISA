import numpy as np
import statistics
import scipy.stats
from scipy.stats import truncnorm
import math

# normal distribution is calculated with mean, standard deviation, and number of variables


class NormalVariable():
    def __init__(self, name, mean, stdev, low, high, num_vars):
        self.name = str(name)
        self.mean = float(mean)
        self.stdev = float(stdev)
        self.low = float(low)
        self.high = float(high)
        self.num_vars = int(num_vars)
        self.vals = self.calc_vals()

    def __str__(self):
        return "Random Variable {0} has a Normal Distribution. min: {1} max: {2} mean: {3} stdev: {4} \
            ".format(self.name, self.low, self.high, self.mean, self.stdev)

    # def get_truncated_normal(self):
    #     return scipy.stats.truncnorm(
    #         (self.low - self.mean) / self.stdev,
    #         (self.high - self.mean) / self.stdev,
    #         loc=self.mean, scale=self.stdev
    #         size=self.num_vars
    #     )

    def calc_vals(self):
        # vals = self.get_truncated_normal()

        # import pdb; pdb.set_trace()
        print(self.name, self.low, self.high, self.mean, self.stdev)
        stdev = self.stdev
        if stdev == 0:
            print(
                "Normal Distribution's stdev is 0, setting to 0.00001 instead to avoid divide by 0 error.")
            stdev = 0.00001

        a = (self.low - self.mean) / stdev
        b = (self.high - self.mean) / stdev
        vals = truncnorm.rvs(a, b, loc=self.mean, scale=self.stdev, size=self.num_vars)
        print(vals)
        if min(vals) < 0:
            import pdb; pdb.set_trace()
            print("something is wrong here")
        # vals.rvs(self.num_vars)
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

    def __str__(self):
        return "Random Variable {0} has a Uniform Distribution. min: {1} max: {2} mean: {3} stdev: {4} \
            ".format(self.name, self.low, self.high, self.mean, self.stdev)

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

    def split_cov(self, cov):
        return cov

    def calc_vals(self):
        # import pdb; pdb.set_trace()
        print(self.means)
        print(self.cov)
        vals = np.random.default_rng().multivariate_normal(
            self.means, self.cov, size=self.num_vars)
        print(vals)
        return vals


# def tan(num):
#     return math.tan(num * (math.pi/180))