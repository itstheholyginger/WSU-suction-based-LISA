from flask import Flask
from flask_socketio import SocketIO, send
import numpy
import statistics
from FS import FSSat, FSUnsat
from Vars import NormalVariable, UniformVariable

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
'''
    ASK:  I was asked to assume a value of 5 for the distance between the ground surface to the water table.
        Is this still the case?
'''
# when client emits event using message name this func will call and send that
# message to every client listening on server
@socketIo.on('submit')
def handleSubmit(data):
    print("received data: " + str(data))
    # create a dict to store the values needed to return to frontend
    to_return = {}
    # collect general variables
    rand_vars = data["randVars"]
    num_vars = data["numVars"]
    sat = data["sat"]
    # put const vars into dict. contains gamma, gamma_w, gamma_sat, slope, and flux
    const_vars = data['constVars']

    # we received the max value of z and the step that should be taken from 0 to max. 
    # need to fetch all the values in that range by given step
    z_vals = get_z_vals(data["z"])

    # create a list of Random Variable objects. Variables are currently either Normal Dist or Uniform Dist
    # TODO: add bivariate distribution
    # calculate values based on distributions
    rand_var_objs = create_dists(rand_vars, num_vars)
    print(rand_var_objs)

    # serialize rand_var_objs back into a dictionary to be used with the rest of the program and the frontend
    rand_vars = {}
    for item in rand_var_objs:
        rand_vars[item.name] = serialize_obj(item)


    to_return['z'] = get_FS_data(rand_vars, const_vars['H_wt'], const_vars['gamma'], const_vars['gamma_w'], \
         const_vars['slope'], const_vars['flux'], z_vals, num_vars, sat)
    
    # remove randVar vals from dict. can delete if needed later
    rand_vars = clean_rand_vars(rand_vars, "vals")
    rand_vars = clean_rand_vars(rand_vars, "name")
    rand_vars = clean_rand_vars(rand_vars, "num_vars")

    to_return['randVars'] = rand_vars

    # print("serialized data to return to frontend:\t ", to_return)
    send(to_return, broadcast=True)
    return None


def create_dists(data, num_vars):
    rand_vars = []
    temp = None
    print("randVars: ", data)
    for (key, val) in data.items():
        # print("key: ", key)
        # print("val: ", val)
        if val["dist"] == "normal":
            temp = NormalVariable(key, val['mean'], val["stdev"], num_vars)
        if val["dist"] == "uniform":
            temp = UniformVariable(key, val["min"], val["max"], num_vars)
        rand_vars.append(temp)
        # print(temp)
    return rand_vars
    

# z is given with a max value and steps. We need to return all the values between
# 0 and max by the given step
def get_z_vals(z):
    print("z: ", z)
    top = z['max']
    step = z['step']
    return  frange(0, top, step)


# function from https://www.pythoncentral.io/pythons-range-function-explained/
def frange(start, stop, step):
    i = start
    l = []
    while i < stop+step:
        l.append(i)
        i += step
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

        print(FS)
        if FS.fs < FAILSTATE:
            failed += 1

        FS_list.append(FS.fs)
    return FS_list, failed / num_vars


def calc_FS_sat(rand_vars, H_wt, gamma, gamma_w, slope, q, z, num_vars):
    FS_list = []
    failed = 0
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
        print(failed)
        FS_list.append(FS.fs)

    return FS_list, failed / num_vars


    # collect FS lists for each z value. will be used to compare in graphs
def get_FS_data(rand_vars, H_wt, gamma, gamma_w, slope, q, z_vals, num_vars, sat):
    print("IN get_FS_data FUNC")
    res = {}
    probFail = 0.0
    for z in z_vals:
        print("CUR Z: ", z)
        # collect list of FS
        FS_list = []
        print("Is the soil saturated?\t", sat)
        if sat == "sat":
            print("soil is sat")
            FS_list, probFail = calc_FS_sat(rand_vars, H_wt, gamma, gamma_w, slope, q, z, num_vars)
        elif sat == "unsat":
            print("soil is unsat")
            FS_list, probFail = calc_FS_unsat(rand_vars, H_wt, gamma, slope, z, num_vars)
    
        print("\nFS_LIST:\t", FS_list)
        print("Probability of failure: ", probFail)
        res[z] = {}
        res[z]['vals'] = FS_list
        res[z]['low'] = min(FS_list)
        res[z]['high'] = max(FS_list)
        res[z]['mean'] = statistics.mean(FS_list)
        res[z]['stdev'] = statistics.stdev(FS_list)
        res[z]['probFail'] = probFail
        print(res[z])

    return res


# doing this manually ig
def clean_rand_vars(data, key):
    data['c'].pop(key, None)
    data['c_r'].pop(key, None)
    data['phi'].pop(key, None)
    data['k_s'].pop(key, None)
    data['a'].pop(key, None)
    data['n'].pop(key, None)
    return data


# serialize the data in the python objects and return them as a dictionary, which can be sent to the frontend
def serialize_obj(obj):
    data = vars(obj)
    return data


# run app
if __name__ == '__main__':
    socketIo.run(app)