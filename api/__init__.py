from flask import Flask, request, jsonify
from flask_cors import CORS
from .views import main


def create_app():
    app = Flask(__name__, static_folder='../build', static_url_path='/')
    print("App Static Folder")
    print(app.static_folder)
    print("App Static Url Path")
    print(app.static_url_path)
    app.config['DEBUG'] = True
    CORS(app)

    app.register_blueprint(main)
    return app
