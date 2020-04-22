from flask import Flask
from flask_socketio import SocketIO, send, emit
import numpy as np
import statistics
from FS import FSSat, FSUnsat
from Vars import NormalVariable, UniformVariable, BivariateVariable
import math
from decimal import Decimal

# send => send messages to al clients in listen to server
# create app using flask

app = Flask(__name__)
# add secret to app
app.config['SECRET_KEY'] = 'lisasecret'

# create server using socket and dix cors errors
socketIo = SocketIO(app, cors_allowed_origins="*")

# use debug=true we do not need to start server manually when we change code
app.debug = True
app.host = 'localhost'
FAILSTATE = 1
'''
    ASK: is this ^^ the correct failstate?
    ASK: was asked to compare FS with different steady flux rates. 
        should I ask the user for multiple fluxes?
'''

def ack():
    print("message was received by client!")

# when client emits event using message name this func will call and send that
# message to every client listening on server
@socketIo.on('submit')
def handleSubmit(data):
    # print("received data: " + str(data))
    to_return = {}
    # separate received data into their categories
    rand_vars = data["randVars"]
    num_vars = data["numVars"]
    sat = data["sat"]
    const_vars = data['constVars']
    H_wt = data["z"]["max"]
    z = data['z']

    # create a list of Random Variable objects. Variables are currently either Normal Dist or Uniform Dist
    # TODO: add bivariate distribution
    # calculate values based on distributions
    if sat == False:
        rand_vars.pop('k_s', None)
        rand_vars.pop('a', None)
        rand_vars.pop('n', None)
        const_vars.pop('gamme_w', None)
        const_vars.pop('q', None)

    rand_var_objs = create_dists(rand_vars, num_vars)

    # serialize rand_var_objs back into a dictionary to be used with the rest of the program and the frontend
    rand_vars = {}
    for item in rand_var_objs:
        rand_vars[item.name] = serialize_obj(item)


    to_return['z'] = get_FS_data(rand_vars, const_vars, z, H_wt, num_vars, sat)
    
    # remove randVar vals from dict. can delete if needed later
    rand_vars = clean_rand_vars(rand_vars, "vals")
    rand_vars = clean_rand_vars(rand_vars, "name")
    rand_vars = clean_rand_vars(rand_vars, "num_vars")

    to_return['randVars'] = rand_vars

    print("sending data rn:")
    # print(to_return)
    send(to_return, broadcast=True, callback=ack)
    return None


def create_dists(data, num_vars):
    rand_vars = []
    temp = None
    print("randVars: ", data)
    for (key, val) in data.items():
        print("cur var: ", key)
        print(val)
        if val["dist"] == "normal":
            temp = NormalVariable(key, val['mean'], val["stdev"], val['low'], val['high'], num_vars)
        elif val["dist"] == "uniform":
            temp = UniformVariable(key, val["low"], val["high"], num_vars)
        elif val['dist'] == "bivariate":
            means = [ float(val["mean1"]), float(val["mean2"]) ]
            cov = [ [ float(val["covX1"]), float(val["covY1"]) ], [ float(val["covX2"]), float(val["covY2"]) ] ]
            temp = BivariateVariable(key, means, cov, num_vars)
        rand_vars.append(temp)
        # print(temp)
    return rand_vars
    

# z is given with a max value and steps. We need to return all the values between
# 0 and max by the given step
def get_z_vals(z):
    top = z['max']
    step = z['step']
    print("step:", step )
    print("dec step: ", Decimal)
    num_z_vals = math.floor(top / step) 
    l = [round(x * step, 4) for x in range (0, num_z_vals)]
    print(l)
    return l


# if the soil is unsaturated
def calc_FS_unsat(rand_vars, H_wt, gamma, slope, z, num_vars):
    FS_list = []
    failed = 0
    for i in range(num_vars):
        c = rand_vars['c']['vals'][i]
        c_r = rand_vars['c_r']['vals'][i]
        phi = rand_vars['phi']['vals'][i]
        FS = FSUnsat(c, c_r, phi, gamma, H_wt, slope, z)

        # print(FS)
        if FS.fs < FAILSTATE:
            failed += 1

        FS_list.append(FS.fs)
    return FS_list, failed / num_vars


def calc_FS_sat(rand_vars, H_wt, gamma, gamma_w, slope, q, z, num_vars):
    FS_list = []
    failed = 0
    print("rand vars: ")
    print(rand_vars)
    for i in range(int(num_vars)):
        c = rand_vars['c']['vals'][i]
        c_r = rand_vars['c_r']['vals'][i]
        phi = rand_vars['phi']['vals'][i]
        k_s = rand_vars['k_s']['vals'][i]
        alpha = rand_vars['a']['vals'][i]
        n = rand_vars['n']['vals'][i]

        FS = FSSat(c, c_r, phi, k_s, alpha, n,  gamma, gamma_w, slope, H_wt,  q, z)
        # print(FS)
        if FS.fs < FAILSTATE:
            failed += 1
        FS_list.append(FS.fs)

    print("failed: ", failed)
    return FS_list, failed / num_vars


    # collect FS lists for each z value. will be used to compare in graphs
def get_FS_data(rand_vars, const_vars, z, H_wt, num_vars, sat):
    print("IN get_FS_data FUNC")
    res = {}
    probFail = 0.0

    # num_z_vals = math.floor(z['max'] / z['step'])
    z_arr = get_z_vals(z)
    # z_arr = np.arange(0, z['max'] + z['step'], z['step'])
    for z in z_arr:
        print("CUR Z: ", z)
        # collect list of FS
        FS_list = []
        print("Is the soil saturated?\t", sat)
        if sat == True:
            print("soil is sat")
            FS_list, probFail = calc_FS_sat(rand_vars, H_wt, const_vars['gamma'], const_vars['gamma_w'], const_vars['slope'], const_vars['q'], z, num_vars)
        elif sat == False:
            print("soil is unsat")
            FS_list, probFail = calc_FS_unsat(rand_vars, H_wt, const_vars['gamma'], const_vars['slope'], z, num_vars)
    
        # print("\nFS_LIST:\t", FS_list)
        print("Probability of failure: ", probFail)
        res[z] = {}
        res[z]['fs_vals'] = FS_list
        res[z]['low'] = round(min(FS_list), 2)
        res[z]['high'] = round(max(FS_list), 2)
        res[z]['mean'] = round(statistics.mean(FS_list), 2)
        res[z]['stdev'] =round(statistics.stdev(FS_list), 2)
        res[z]['probFail'] = probFail
        # print(res[z])

    return res


# doing this manually ig
def clean_rand_vars(data, key):
    keys = ['c', 'c_r', 'phi', 'k_s', 'a', 'n']
    for item in keys:
        if item in data:
            data[item].pop(key, None)
    # data['c'].pop(key, None)
    # data['c_r'].pop(key, None)
    # data['phi'].pop(key, None)
    # data['k_s'].pop(key, None)
    # data['a'].pop(key, None)
    # data['n'].pop(key, None)
    return data


# serialize the data in the python objects and return them as a dictionary, which can be sent to the frontend
def serialize_obj(obj):
    data = vars(obj)
    return data


# run app
if __name__ == '__main__':
    socketIo.run(app)