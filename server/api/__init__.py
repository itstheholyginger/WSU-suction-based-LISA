from flask import Flask, request, jsonify
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config['DEBUG'] = True
    CORS(app)

    from .views import main
    app.register_blueprint(main)
    return app
