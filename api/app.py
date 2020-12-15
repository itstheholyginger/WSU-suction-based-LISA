from flask import Flask, request, jsonify
from flask_cors import CORS
from .lisa_backend import handleSubmit

app = Flask(__name__, static_folder='../build', static_url_path='/')
app.config['DEBUG'] = True

CORS(app)

data = {

}

results = {

}


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/api/add_data', methods=['POST'])
def add_data():
    new_data = request.get_json()
    data[1] = new_data
    res = handleSubmit(data[1])
    results[1] = res
    return 'Done', 201


@app.route('/api/display')
def display():
    res = results[1]
    return jsonify({'results': res})


if __name__ == '__main__':
    # Threaded option to enable multiple instances for muliple user access support
    app.run(threaded=True, port=5000)
