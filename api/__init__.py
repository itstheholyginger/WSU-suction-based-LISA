from flask import Flask, request, jsonify
from flask_cors import CORS


def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    app.config['DEBUG'] = True
    CORS(app)

    from .views import main
    app.register_blueprint(main)
    return app
