from flask import Flask, request, jsonify

def create_app():
    app = Flask(__name__)
    app.config['DEBUG'] = True

    from .views import main
    app.register_blueprint(main)
    return app
