from flask import Blueprint, jsonify, request
from datetime import datetime
from .lisa_backend import handleSubmit

main = Blueprint('main', __name__)

data = {

}

results = {

}


@main.route('/')
def index():
    return main.send_static_file('index.html')


@main.route('/api/add_data', methods=['POST'])
def add_data():
    new_data = request.get_json()
    # print("data recieved: ")
    # print(new_data)
    # now = datetime.now().timestamp()
    data[1] = new_data
    res = handleSubmit(data[1])
    results[1] = res
    return 'Done', 201


@main.route('/api/display')
def display():
    res = results[1]
    return jsonify({'results': res})
