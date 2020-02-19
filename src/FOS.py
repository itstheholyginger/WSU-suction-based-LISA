import math

'''
These classes find the factor of safety for both saturated and unsaturated soil.

variables:
    ang_fric = effective angle of friction (degrees) (rand var)
    slope = slope angle (const)
    drain_co = drained cohesion (rand var)
    grd_to_wt = distance from ground surface to water table (WT)
    alpha, n = Van Genuchten's parameters for the best fit to SWRC (rand var)
    c_r = tree root strength expressed as cohesion, psf, function of depth (ask tasnia)
    y = moist soil unit weight (const)
    y_sat = saturated soil unit weight (const)
    y_w = water unit weight (const)
    k_s = saturated hydraulic conductivity (m/s) (rand var)
    q = steady flux rate (m/s) [positive for infiltration and negative for evaporation] const arr
    z = distance above water table (const)
    '''

# location of water table and slope is fixed

class FOS:
    def __init__(self, ang_fric, slope, drain_co, grd_to_wt, z, c_r, y):
        self.ang_fric = ang_fric
        self.slope = slope
        self.drain_co = drain_co
        self.grd_to_wt = grd_to_wt
        self.z = z
        self.c_r = c_r
        self.y = y


class FOSUnsat(FOS):

    def fos(self):
        return (math.tan(self.ang_fric)*self.z)/math.tan(self.slope) + \
            ((2*self.drain_co + self.c_r)/(self.y * (self.grd_to_wt - self.z) * math.sin(2 * self.slope)))



class FOSSat(FOS):
    def __init__(self, k_s, alpha, y_sat, y_w, n, q, **kwargs):
        super().__init__()
        self.k_s = k_s
        self.alpha = alpha
        self.y_w = y_w
        self.n = n
        self.q = q
        self.y = y_sat


    def fos_sat(self):
        return (math.tan(self.ang_fric)*self.z)/math.tan(self.slope) + \
            ((2*self.drain_co + self.c_r)/(self.y * (self.grd_to_wt - self.z) * math.sin(2 * self.slope))) - (self.S_e()/(self.y * (self.grd_to_wt - self.z))) * \
            (math.tan(self.slope) + (1/math.tan(self.slope))) * math.tan(self.ang_fric) * self.z


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
            return (1/self.alpha) * (math.log((1 + (self.q / self.k_s)) * math.e^(-self.y_w * self.alpha * self.z) - \
                (self.q / self.k_s)) / (1 + (-math.log((1+(self.q / self.k_s)) * math.e^(self.y_w * self.alpha * self.z) - \
                    (self.q / self.k_s))) ^ self.n) ^ ((self.n - 1) / self.n))


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
    
    def deg_saturation(self):
        return (1/(1 + (self.alpha * self.suction_stress()) ^ self.n)) ^ (1-(1/self.n))