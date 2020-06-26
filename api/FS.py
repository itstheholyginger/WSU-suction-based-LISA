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


class FS:
    def __init__(self, c, c_r, phi, gamma, gamma_w, slope, H_wt, z):
        self.c = float(c)
        self.c_r = float(c_r)
        self.phi = float(phi)
        self.H_wt = float(H_wt)
        self.gamma = float(gamma)
        self.gamma_w = float(gamma_w)
        self.slope = float(slope)
        self.z = float(z)


'''
    New variables
        k_s = saturated hydraulic conductivity (m/s)
        alpha = Van Genuchten's parameters from the best fit to SWRC
        n = Van Genuchten's parameters from the best fit to SWRC
        q = steady flux rate (m/s) [positive for infiltration and negative for evaporation]
'''


class FSUnsat(FS):
    def __init__(self, c, c_r, phi, k_s, alpha, n, gamma, gamma_w, slope, q, H_wt, z):
        FS.__init__(self, c, c_r, phi, gamma, gamma_w, slope, H_wt, z)
        self.k_s = float(k_s)
        self.alpha = float(alpha)
        self.n = float(n)
        self.q = float(q)
        self.matric_suction = self.matric_suction()
        self.ss = self.suction_stress()
        self.Se = self.Se()
        self.fs = self.fs()
        self.round_vals()

    def __str__(self):
        return "Factor of Safety of Unsaturated Soil\n\tc: {0} c_r: {1} \
            phi: {2} k_s: {3} alpha: {4} n: {5} gamma: {6} gamma_w: {7} \
            slope: {8} q: {9} H_wt: {10} z: {11}\n\tfs: {12}"\
            .format(self.c, self.c_r, self.phi, self.k_s, self.alpha, self.n,
                    self.gamma, self.gamma_w, self.slope, self.q, self.H_wt,
                    self.z, self.fs)

    def tan(self, deg):
        rad = math.radians(deg)
        return math.tan(rad)

    def cot(self, deg):
        return 1/self.tan(deg)

    def sin(self, deg):
        rad = math.radians(deg)
        return math.sin(rad)

    def round_vals(self):
        self.k_s = '%.2E' % Decimal(self.k_s)
        self.alpha = round(self.alpha, 3)
        self.n = round(self.n, 3)
        self.c = round(self.c, 1)
        self.c_r = round(self.c_r, 1)
        self.phi = round(self.phi, 1)

    # Calculate the factor of safety value for unsaturated soil

    def fs(self):
        # print("Calculating the fs of unsaturated soil")
        H_ss = self.H_wt - self.z
        first = self.tan(self.phi) / self.tan(self.slope)

        second = (2 * (self.c + self.c_r)) / \
            (self.gamma * H_ss * self.sin(2 * self.slope))

        third = (self.ss / (self.gamma * H_ss))

        last = (self.tan(self.slope) + self.cot(self.slope)) * \
            self.tan(self.phi)

        fs = first + second - (third * last)
        return fs

    ''' Description:
            This is a general equation for the vertical profile of suction stress
            under steady infiltration or evaportation:
            if magic_suction <= 0, suction_stress = -magic_suction
            else if suction stress > 0, calculate new magin_suction
    '''

    def suction_stress(self):
        msuc = self.matric_suction
        if msuc <= 0:
            # print("matric suction is negative : {}".format(msuc))
            return -msuc
        else:
            # print("matric suction is positive : {}".format(msuc))
            try:
                temp = self.q / self.k_s

                # first = 1/self.alpha
                # second_top = math.log(
                #     (1 + temp) * math.exp(-self.gamma_w * self.alpha * self.z) - temp)

                top = -self.matric_suction
                inside = pow(-top * self.alpha, self.n)
                bottom = pow(1 + inside, (self.n - 1) / self.n)

                # second_bottom = pow((1 + pow((-second_top), self.n)),
                #                     (self.n - 1) / self.n)
                # ss = first * (second_top / second_bottom)
                ss = top / bottom
            except ValueError as e:
                import pdb
                pdb.set_trace()
                print(e)
                # ss = 0
        return ss

    def matric_suction(self):
        # import pdb
        # pdb.set_trace()
        temp = self.q / self.k_s
        ms = 0
        try:
            first = (-1 / self.alpha)

            inside_first = (1+temp)

            inside_second = math.exp(-self.gamma_w * self.alpha * self.z)

            inside = inside_first * inside_second - temp

            second = math.log(inside)

            ms = first * second
            # ms = (-1 / self.alpha) *\
            #     math.log((1 + temp) * math.exp(-self.gamma *
            #                                    self.alpha * self.z) - temp)
        except ValueError as e:
            import pdb
            pdb.set_trace()
            print(e)
            # ms = 0
        if ms == 0:
            print("matric stress = 0")
        return ms

    # Effective Degree of Saturation. Used to test if Suction Stress function is correct
    def Se(self):
        inside = 1 / (1 + pow(self.alpha * self.matric_suction, self.n))
        s_e = pow(inside, (self.n - 1) / self.n)
        return s_e


class FSSat(FS):
    def __init__(self, c, c_r, phi, gamma, gamma_w, slope, H_wt, z):
        FS.__init__(self, c, c_r, phi, gamma, gamma_w, slope, H_wt, z)

        self.fs = self.calc_fs()
        self.round_vals()

    def __str__(self):
        return "Factor of Safety of Saturated Soil\n\tc: {0} c_r: {1} phi: {2}\
            gamma: {3} gamma_w: {4} slope: {5} H_wt: {6} z: {7}\
                \n\tfs: {8}".format(self.c, self.c_r, self.phi, self.gamma,
                                    self.gamma_w, self.slope, self.H_wt, self.z, self.fs)

    # maybe do this here and not in the frontend?
    def round_vals(self):
        self.c = round(self.c, 1)
        self.c_r = round(self.c_r, 1)
        self.phi = round(self.phi, 1)

    def calc_fs(self):
        H_ss = self.H_wt - self.z
        first = math.tan(math.radians(self.phi)) / \
            math.tan(math.radians(self.slope))

        second = (2 * (self.c + self.c_r)) /\
            (self.gamma * H_ss * math.sin(math.radians(2 * self.slope)))

        third = (self.gamma_w * H_ss) /\
            (self.gamma * H_ss * math.sin(math.radians(2 * self.slope))) *\
            math.tan(math.radians(self.phi))

        if math.isnan(float(third)):
            import pdb
            pdb.set_trace()
            print("third is not a number")

        fs = first + second - third
        if fs < 0:
            import pdb
            pdb.set_trace()
            print("fs shouldn't be negative returning 0")
            return 0
        return fs
