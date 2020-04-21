import numpy as np
import statistics
import scipy.stats

# normal distribution is calculated with mean, standard deviation, and number of variables
class NormalVariable():
    def __init__(self, name, mean, stdev, num_vars):
        self.name = str(name)
        self.mean = float(mean)
        self.stdev = float(stdev)
        self.num_vars = int(num_vars)
        self.vals = self.calc_vals()
        self.low = min(self.vals)
        self.high = max(self.vals)

    def __str__(self):
        return "Random Variable {0} has a Normal Distribution. min: {1} max: {2} mean: {3} stdev: {4} \
            ".format(self.name, self.low, self.high, self.mean, self.stdev)
    
    def calc_vals(self):
        # vals = np.zeros(self.num_vars)
        # for i in range(self.num_vars):
        #     vals[i] = (scipy.stats.norm(self.mean, 2* self.stdev).rvs())
        vals = get_truncated_normal()
        vals.rvs(self.num_vars)
        return vals

    def get_truncated_normal(self):
        return scipy.stats.truncnorm(
            (self.low - self.mean) / self.stdev,
            (self.high - self.mean) / self.stdev,
            loc=self.mean, scale=self.stdev
        )

class UniformVariable():
    def __init__(self, name,  low, high, num_vars):
        self.name = str(name)
        self.low = float(low)
        self.high = float(high)
        self.num_vars= int(num_vars)
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
        self.mean = float(mean)
        self.cov = split_cov(cov)
        self.vals = self.calc_vals()
        self.stdev = statistics.stdev(self.vals)
        self.low = min(self.vals)
        self.high = max(self.vals)

    def split_cov(self, cov):
        return cov
        
    def calc_vals(self):
        return vals = np.random.multivariate_normal(self.means, self.cov).rvs(self.num_vars)
