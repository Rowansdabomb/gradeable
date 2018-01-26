
import os
from flask import Flask, send_from_directory

from multiimage import multiImage, printHello

app = Flask(__name__, static_folder='../frontend/build')

# Serve React App
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if(path == ""):
        return send_from_directory('../frontend/build', 'index.html')
    else:
        if(os.path.exists("../frontend/build/" + path)):
            return send_from_directory('../frontend/build', path)
        else:
            return send_from_directory('../frontend/build', 'index.html')

@app.route('/pyscript')
def runScript():
    return multiImage()


if __name__ == '__main__':
    app.run(use_reloader=True, port=5000, threaded=True)

# from flask import Flask
# from flask import render_template
# from flask import request
# import json


# app = Flask(__name__, template_folder='templates')
 
# @app.route("/")
# def hello():
#     return "Welcome to Python Flask!"

# @app.route('/test')
# def signUp():
#     return render_template('signUp.html')

# @app.route('/signUpUser', methods=['POST'])
# def signUpUser():
#     user =  request.form['username'];
#     password = request.form['password'];
#     return json.dumps({'status':'OK','user':user,'pass':password});
 
# if __name__ == "__main__":
#     app.run()    