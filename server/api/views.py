from flask import Blueprint, jsonify, request
from datetime import datetime
from .app import handleSubmit

main = Blueprint('main', __name__)

data = {
    # 1: {
    #     "numVars": 100,
    #     "sat": False,
    #     "randVars": {
    #         "c": {
    #             "dist": 'normal',
    #             "low": 1,
    #             "high": 4,
    #             "mean": 2,
    #             "stdev": 0.37,
    #             "unit": 'Kpa'
    #         },
    #         "c_r": {
    #             "dist": 'uniform',
    #             "low": 4,
    #             "high": 6,
    #             "mean": 6,
    #             "stdev": 1.2,
    #             "unit": 'Kpa'
    #         },
    #         "phi": {
    #             "dist": 'normal',
    #             "low": 0,
    #             "high": 50,
    #             "mean": 36,
    #             "stdev": 1.67,
    #             "unit": 'deg'
    #         },
    #         "k_s": {
    #             "dist": 'normal',
    #             "low": 0.0,
    #             "high": 10,
    #             "mean": 4.18e-07,
    #             "stdev": 0.0,
    #             "unit": 'm/s'
    #         },
    #         "a": {
    #             "dist": 'normal',
    #             "min": 0,
    #             "max": 12,
    #             "mean": 0.38,
    #             "stdev": 0.02,
    #             "unit": '1/kPa'
    #         },
    #         "n": {
    #             "dist": 'uniform',
    #             "min": 0.2,
    #             "max": 0.44,
    #             "mean": 0,
    #             "stdev": 0,
    #             "unit": ''
    #         }
    #     },
    #     "constVars": {
    #         "gamma": 17,
    #         "gamma_w": 9.81,
    #         "slope": 45,
    #         "q": -2.778e-07
    #     },
    #     "z": {
    #         "max": 1.5,
    #         "step": 0.05
    #     }
    # }
}

results = {

}


@main.route('/add_data', methods=['POST'])
def add_data():
    new_data = request.get_json()
    # now = datetime.now().timestamp()
    data[1] = new_data
    res = handleSubmit(data[1])
    results[1] = res
    return 'Done', 201


@main.route('/display')
def display():
    return jsonify({'results': results})
