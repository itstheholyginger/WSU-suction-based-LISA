from decimal import Decimal
import math
from flask import Flask
import numpy as np
import statistics
from .FS import FSSat, FSUnsat
from .Vars import TruncNormalVariable, UniformVariable,  \
    LognormalVariable, ConstantVariable, TruncatedLognormalVariable

# use debug=true we do not need to start server manually when we change code
FAILSTATE = 1
'''
    ASK: was asked to compare FS with different steady flux rates. 
        should I ask the user for multiple fluxes?
'''


def handleSubmit(data):
    # separate received data into categories
    to_return = {}
    rand_vars = data["randVars"]
    sat = data['sat']
    conf = data["conf"]
    const_vars = data['constVars']
    H_wt = float(const_vars['H_wt'])
    z_step = float(const_vars['z_step'])

    const_vars.pop('H_wt')
    const_vars.pop('z_step')

    # remove vars if soil is saturated conf can be nondetSat, nondetUnsat, detSat, detUnsat
    if sat == True:
        rand_vars.pop('k_s', None)
        rand_vars.pop('a', None)
        rand_vars.pop('n', None)
        const_vars.pop('q', None)

    ''' 
        create a list of Random Variable objects by given distribution.
        Dists are either truncated normal, lognormal, uniform, or constant.
        Bivariate dist is partially implemented by is put on the side for now.
    '''

    # If deterministic, don't create dist. calc only one fs

    if conf == 'nondet':
        num_vars = int(data["numVars"])
        to_return = calc_nondet(rand_vars, const_vars,
                                H_wt, z_step, num_vars, sat, conf)

    elif conf == 'det':
        to_return = calc_det(rand_vars, const_vars, H_wt, z_step, sat, conf)

    to_return['conf'] = conf
    to_return['sat'] = sat
    to_return['H_wt'] = H_wt

    to_return = round_results(to_return)

    return to_return


# z is given with a max value and steps. We need to return all the values between
# 0 and max by the given step
def get_z_vals(H_wt, z_step):
    num_z_vals = math.floor(H_wt / z_step) + 1
    l = [round(x * z_step, 4) for x in range(0, num_z_vals)]
    return l


def calc_det(rand_vars, const_vars, H_wt, z_step, sat, conf):
    to_return = {}
    to_return['conf'] = conf
    FS = None

    c = rand_vars['c']['val']
    c_r = rand_vars['c_r']['val']
    gamma = const_vars['gamma']
    gamma_w = const_vars['gamma_w']
    slope = const_vars['slope']

    z_arr = get_z_vals(H_wt, z_step)
    z_data = {}
    rvs = {}
    rvs['c'] = c
    rvs['c_r'] = c_r
    rvs['phi'] = const_vars['phi_0']

    if sat is True:
        phi_0 = const_vars['phi_0']
        delta_phi = const_vars['delta_phi']
        z_w = const_vars['z_w']
        for z in z_arr:
            H_ss = H_wt - z
            phi = phi_0 + (delta_phi / (1 + z_w / H_ss))

            FS = FSSat(c, c_r, phi, gamma, gamma_w, slope, H_wt, z)
            z_data[H_ss]['fs_vals'] = FS.fs
    elif sat is False:
        k_s = rand_vars['k_s']['val']
        alpha = rand_vars['a']['val']
        n = rand_vars['n']['val']
        q = const_vars['q']
        rvs['k_s'] = k_s
        rvs['alpha'] = alpha
        rvs['n'] = n

        phi_0 = const_vars['phi_0']
        delta_phi = const_vars['delta_phi']
        z_w = const_vars['z_w']
        for z in z_arr:
            H_ss = H_wt - z
            phi = phi_0 + (delta_phi / (1 + z_w / H_ss))
            FS = FSUnsat(c, c_r, phi, k_s, alpha, n,
                         gamma, gamma_w, slope, q, H_wt, z)
            H_ss = H_wt - z
            z_data[H_ss]['fs_vals'] = FS.fs
            z_data[H_ss]['ss'] = FS.ss

    to_return['z'] = z_data
    to_return['randVars'] = rvs
    to_return['conf'] = conf

    return to_return


'''
    Non-deterministic analysis is the norm for LISA. Calculates random variables
    based on given inputs and distribution
'''


def calc_nondet(rand_vars, const_vars, H_wt, z_step, num_vars, sat, conf):
    to_return = {'conf': conf}

    # calculate random variable objects using given dist
    rand_var_objs = create_dists(rand_vars, num_vars)

    # serialize rand_var_objs back into a dictionary to be used
    # with the rest of the program and the frontend
    rand_vars = {}
    for item in rand_var_objs:
        rand_vars[item.name] = serialize_obj(item)

    to_return['z'] = get_FS_data(
        rand_vars, const_vars, H_wt, z_step, num_vars, sat)

    # remove randVar vals from dict. can delete if needed later
    rand_vars = clean_rand_vars(rand_vars, "name")
    rand_vars = clean_rand_vars(rand_vars, "num_vars")

    to_return['randVars'] = rand_vars
    return to_return


def create_dists(data, num_vars):
    rand_vars = []
    new_var = None
    for (key, val) in data.items():
        if val["dist"] == "truncnormal":
            new_var = TruncNormalVariable(
                key, val['mean'], val["stdev"],
                val['low'], val['high'], num_vars)

        elif val["dist"] == "uniform":
            new_var = UniformVariable(key, val["low"], val["high"], num_vars)

        elif val['dist'] == "lognormal":
            new_var = LognormalVariable(
                key, val['logmean'], val['logstdev'], num_vars)

        elif val['dist'] == 'constant':
            new_var = ConstantVariable(key, val['const_val'], num_vars)

        elif val['dist'] == "trunclognormal":
            new_var = TruncatedLognormalVariable(
                key, val['logmean'], val['logstdev'], val['low'], val['high'], num_vars)

        rand_vars.append(new_var)

    return rand_vars


# collect FS lists for each z value. will be used to compare in graphs
def get_FS_data(rand_vars, const_vars, H_wt, z_step, num_vars, sat):
    res = {}
    probFail = 0.0
    z_arr = get_z_vals(H_wt, z_step)
    for z in z_arr:
        # collect list of FS
        FS_list = []
        SS_list = []
        Se_list = []
        Ms_list = []
        H_ss = round(H_wt - z, 2)

        if sat == False:
            FS_list, SS_list, Se_list, Ms_list, probFail = calc_FS_unsat(
                rand_vars, const_vars['gamma'], const_vars['gamma_w'],
                const_vars['slope'], const_vars['q'], H_wt, z, num_vars)

        elif sat == True:
            FS_list, probFail = calc_FS_sat(
                rand_vars, const_vars['gamma'], const_vars['gamma_w'],
                const_vars['slope'], H_wt, z, num_vars)

        res[H_ss] = {}
        if sat == False:
            res[H_ss]['ss'] = statistics.mean(SS_list)
            res[H_ss]['Se'] = statistics.mean(Se_list)
            res[H_ss]['ms'] = statistics.mean(Ms_list)
        res[H_ss]['fs_vals'] = FS_list
        res[H_ss]['low'] = round(min(FS_list), 2)
        res[H_ss]['high'] = round(max(FS_list), 2)
        res[H_ss]['mean'] = round(statistics.mean(FS_list), 2)
        res[H_ss]['stdev'] = round(statistics.stdev(FS_list), 2)
        res[H_ss]['probFail'] = probFail

    return res


def Average(l):
    return sum(l) / len(l)


# if the soil is unsaturated
def calc_FS_sat(rand_vars, gamma, gamma_w, slope, H_wt, z, num_vars):
    FS_list = []
    failed = 0
    for i in range(num_vars):
        c = rand_vars['c']['vals'][i]
        c_r = rand_vars['c_r']['vals'][i]
        phi = rand_vars['phi']['vals'][i]
        FS = FSSat(c, c_r, phi, gamma, gamma_w, slope, H_wt, z)

        if FS.fs < FAILSTATE:
            failed += 1

        FS_list.append(FS.fs)
    return FS_list, failed / num_vars


def calc_FS_unsat(rand_vars, gamma, gamma_w, slope, q, H_wt, z, num_vars):
    FS_list = []
    SS_list = []
    Se_list = []
    Ms_list = []
    failed = 0

    for i in range(int(num_vars)):
        c = rand_vars['c']['vals'][i]
        c_r = rand_vars['c_r']['vals'][i]
        phi = rand_vars['phi']['vals'][i]
        k_s = rand_vars['k_s']['vals'][i]
        alpha = rand_vars['a']['vals'][i]
        n = rand_vars['n']['vals'][i]

        FS = FSUnsat(c, c_r, phi, k_s, alpha, n,  gamma,
                     gamma_w, slope, q, H_wt, z)

        if FS.fs < FAILSTATE:
            failed += 1

        SS_list.append(FS.ss)
        Se_list.append(FS.Se)
        Ms_list.append(FS.matric_suction)
        FS_list.append(FS.fs)

    return FS_list, SS_list, Se_list, Ms_list, failed / num_vars


# doing this manually ig
def clean_rand_vars(data, key):
    keys = ['c', 'c_r', 'phi', 'k_s', 'a', 'n']
    for item in keys:
        if item in data:
            data[item].pop(key, None)
    return data


# serialize the data in the python objects and return them as a dictionary,
# which can be sent to the frontend
def serialize_obj(obj):
    data = vars(obj)
    try:
        data['vals'] = data['vals'].tolist()
    except AttributeError as e:
        print("list was not an nparray.")
        print(e)
    return data


def round_results(data):
    rand_vars = data['randVars']
    for key, value in rand_vars.items():
        if key == 'c' or key == 'c_r' or key == 'phi':
            value['high'] = round(float(value['high']), 1)
            value['low'] = round(float(value['low']), 1)
            value['stdev'] = round(float(value['stdev']), 1)
            value['mean'] = round(float(value['mean']), 1)

            for i in range(len(value['vals'])):
                value['vals'][i] = round(float(value['vals'][i]), 1)
                
        elif key == 'a' or key == 'n':
            value['high'] = round(float(value['high']), 3)
            value['low'] = round(float(value['low']), 3)
            value['stdev'] = round(float(value['stdev']), 3)
            value['mean'] = round(float(value['mean']), 3)

            for i in range(len(value['vals'])):
                value['vals'][i] = round(float(value['vals'][i]), 3)

    data['randVars'] = rand_vars

    z = data['z']
    for key, value in z.items():
        value['high'] = round(value['high'], 3)
        value['low'] = round(value['low'], 3)
        value['stdev'] = round(value['stdev'], 3)
        value['mean'] = round(value['mean'], 3)
        value['probFail'] = round(value['probFail'], 3)

        for i in range(len(value['fs_vals'])):
            value['fs_vals'][i] = round(value['fs_vals'][i], 3)

        # only for unsaturated
        if data['sat'] == False:
            value['ss'] = round(value['ss'], 5)
            value['Se'] = round(value['Se'], 5)
            value['ms'] = round(value['ms'], 5)
        # for i in range(len(value['ss_vals'])):
        #     value['ss_vals'][i] = round(value['ss_vals'][i], 3)

    data['z'] = z
    return data
