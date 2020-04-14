import numpy as np
import statistics
import scipy.stats

# normal distribution is calculated with mean, standard deviation, and number of variables
class NormalVariable():
    def __init__(self, name, mean, stdev, num_vars):
        self.name = str(name)
        self.mean = round(float(mean) , 2)   
        self.stdev = round(float(stdev), 2)
        self.num_vars = int(num_vars)
        self.vals = self.calc_vals()
        self.low = round(min(self.vals), 2)
        self.high = round(max(self.vals), 2)

    def __str__(self):
        return "Random Variable {0} has a Normal Distribution. min: {1} max: {2} mean: {3} stdev: {4} \
            ".format(self.name, self.low, self.high, self.mean, self.stdev)
    
    def calc_vals(self):
        vals = np.zeros(self.num_vars)
        for i in range(self.num_vars):
            vals[i] = (scipy.stats.norm(self.mean, 2* self.stdev).rvs())
        return vals

class UniformVariable():
    def __init__(self, name,  low, high, num_vars):
        self.name = str(name)
        self.low = round(float(low), 2)
        self.high = round(float(high), 2)
        self.num_vars= int(num_vars)
        self.vals = self.calc_vals()
        self.mean = round(self.vals.mean(), 2)
        self.stdev = round(statistics.stdev(self.vals), 2)

    def __str__(self):
        return "Random Variable {0} has a Uniform Distribution. min: {1} max: {2} mean: {3} stdev: {4} \
            ".format(self.name, self.low, self.high, self.mean, self.stdev)
    
    def calc_vals(self):
        vals = np.zeros(self.num_vars)
        for i in range(self.num_vars):
            vals[i] = (scipy.stats.uniform(self.low, self.high).rvs())
        return vals
