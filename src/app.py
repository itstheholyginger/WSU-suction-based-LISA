from flask import Flask;
from flask_socketio import SocketIO, send
from FOS import FOS, FOSSat, FOSUnsat

# send => send messages to al clients in listen to server

# create app using flask

app = Flask(__name__)
# add secret to app
app.config['SECRET_KEY'] = 'lisasecret'

# create server using socket and dix cors errors
socketIo = SocketIO(app, cors_allowed_origins="*")

# use debug=true we do not need to start server manually when we change code
app.debug = True
# hot to localhost
app.host = 'localhost'

# when client emits event using message name this func will call and send that
# message to every client listening on server
@socketIo.on('submit')
def handleSubmit(data):
    print(data)
    send(data, broadcast=True)
    return None


# run app
if __name__ == '__main__':
    socketIo.run(app)