import math
from decimal import Decimal
'''
These classes find the factor of safety for both saturated and unsaturated soil.

variables:
    slope = slope angle (const) (denoted by beta in function)
    c = drained cohesion (rand var)
    c_r = tree root strength expressed as cohesion, psf, function of depth (ask tasnia)
    phi = effective angle of friction (degrees) (rand var)
    k_s = saturated hydraulic conductivity (m/s) (rand var)
    alpha, n = Van Genuchten's parameters for the best fit to SWRC (rand var)
    H_wt = distance from ground surface to water table (WT)
    gamma = unit weight of the soil (moist?) (const)
    gamma_w = water unit weight (const)
    gamma_sat = saturated soil unit weight (const)
    q = steady flux rate (m/s) [positive for infiltration and negative for evaporation] const arr
    z = distance above water table (have max (H_wt) and step)
    '''

# location of water table and slope is fixed

class FS:
    def __init__(self, c, c_r, phi, gamma, H_wt, slope,  z):
        self.c = c
        self.c_r = c_r
        self.phi = phi
        self.H_wt = H_wt
        self.gamma = gamma
        self.slope = slope
        self.z = float(z)


class FSUnsat(FS):
    def __init__(self, c, c_r, phi, gamma, slope, H_wt,  z):
        FS.__init__(self, c, c_r, phi, gamma, H_wt, slope,  z)
        self.fs = round(self.calc_fs(), 3)
        self.round_vals()

    def __str__(self):
        return "Factor of Safety of Unsaturated Soil\n\tc: {0} c_r: {1} phi: {2} gamma: {3} slope: {4} H_wt: {5} \
            z: {6}\n\tfs: {7}".format(self.c, self.c_r, self.phi, self.gamma, self.slope, self.H_wt, self.z, self.fs)

    def calc_fs(self):
        return (math.tan(self.phi)*self.z)/math.tan(self.slope) + \
            ((2*self.c + self.c_r)/(self.gamma * (self.H_wt - self.z) * math.sin(2 * self.slope)))
    
    def round_vals(self):
        self.c = round(self.c, 1)
        self.c_r = round(self.c_r, 1)
        self.phi = round(self.phi, 1)


class FSSat(FS):
    def __init__(self, c, c_r, phi, k_s, alpha, n,  gamma, gamma_w, slope, H_wt,  q, z):
        self.k_s = k_s
        self.alpha = alpha
        self.gamma_w = gamma_w
        self.n = n
        self.q = q
        FS.__init__(self, c, c_r, phi, gamma, H_wt, slope, z)
        self.fs = round(self.calc_fs(), 3)
        self.round_vals()
        

    def __str__(self):
        return "Factor of Safety of Saturated Soil\n\tc: {0} c_r: {1} phi: {2} k_s: {3} alpha: {4} n: {5} gamma: {6} \
            gamma_w: {7} slope: {8} H_wt: {9} q:  {10} z: {11}\n\tfs: {12}".format(self.c, 
                self.c_r, self.phi, self.k_s, self.alpha, self.n,  self.gamma, self.gamma_w, self.slope,
                self.H_wt, self.q,  self.z, self.fs)

# def format_e



    def round_vals(self):
        self.k_s = '%.2E' % Decimal(self.k_s)
        self.alpha = round(self.alpha, 3)
        self.n = round(self.n, 3)
        self.c = round(self.c, 1)
        self.c_r = round(self.c_r, 1)
        self.phi = round(self.phi, 1)
        

    def calc_fs(self):
        first = (math.tan(self.phi) * self.z) / math.tan(self.slope)
        second = (2 * self.c + self.c_r)/(self.gamma * (self.H_wt - self.z) * math.sin(2 * self.slope))
        third = (self.S_e() / (self.gamma * (self.H_wt - self.z))) * \
            (math.tan(self.slope) + (1/math.tan(self.slope))) * \
                    math.tan(self.phi) * self.z

        return first + second - third


    '''
        This is a general equation for the vertical profile of suction stress
        under steady infiltration or evaportation:

        k_s = saturated hydraulic conductivity (m/s)
        alpha = Van Genuchten's parameters from the best fit to SWRC 
        n = Van Genuchten's parameters from the best fit to SWRC 
        q = steady flux rate (m/s) [positive for infiltration and negative for evaporation]
    '''
    def suction_stress(self):
        if self.infiltration() <= 0:
            return -self.infiltration()
        else:
            first = 1/self.alpha
            second_top = math.log((1 + self.q / self.k_s) * pow(math.e, (-self.gamma_w * self.alpha * self.z)) - self.q / self.k_s)
            second_bottom = pow((1 + pow((-second_top), self.n)), ((self.n - 1) / self.n))
            return first * (second_top / second_bottom)
            # return (1/self.alpha) * (math.log((1 + (self.q / self.k_s)) * math.e^(-self.gamma_w * self.alpha * self.z) - \
            #     (self.q / self.k_s)) / (1 + (-math.log((1+(self.q / self.k_s)) * math.e^(self.gamma_w * self.alpha * self.z) - \
            #         (self.q / self.k_s))) ^ self.n) ^ ((self.n - 1) / self.n))


    def infiltration(self):
        return (-1 / self.alpha) * math.log((1 + (self.q / self.k_s)))

    
    #  This function finds the effective degree of saturation (S_e)
    #  if suction stress <= 0, S-e = -suction stress
    #  else if suction stress > 0, calculate new S_e
    #  variables: 
    #  k_s = saturated hydraulic conductivity (m/s)
    #  alpha = Van Genuchten's parameters from the best fit to SWRC 
    #  n = Van Genuchten's parameters from the best fit to SWRC 
    #  q = steady flux rate (m/s) [positive for infiltration and negative for evaporation]
    
    def S_e(self):
        inner = 1 / (1 + pow((self.alpha * self.suction_stress()), self.n))
        return pow(inner, (1 - (1/self.n)))
        # return (1/(1 + (self.alpha * self.suction_stress()) ^ self.n)) ^ (1-(1/self.n))