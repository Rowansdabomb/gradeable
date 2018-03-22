from flask import Flask, render_template
# import argparse
# import graderTest

# # construct the argument parse and parse the arguments
# ap = argparse.ArgumentParser()
# ap.add_argument("-i", "--image", required=True,
# 	help="path to the input image")
# args = vars(ap.parse_args())

app = Flask(__name__, static_folder="../src", template_folder='../public')
 
@app.route("/")
def index():
    return render_template("index.html")
# @app.route('/gradeImage')
# def hello():
#     return graderTest.gradeImage(args)
    
 
if __name__ == "__main__":
    app.run()