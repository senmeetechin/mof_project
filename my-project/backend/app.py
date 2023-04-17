import subprocess
import sys

### Prediction API ###
from flask import Flask, jsonify, request
import os

# Initialize Flask application
app = Flask(__name__)

# set upload folder
UPLOAD_DIR  = '../src/upload'
MODEL_PATH  = './model/best_model_78_0.06193.h5'
SCALER_PATH = './static/minmaxScaler.joblib'

@app.route('/test', methods=['GET'])
def test():
    output = {'prediction': 'THIS IS STRING FOR TESTING API'}
    return jsonify(output)

@app.route('/upload', methods=['POST'])
def upload_files():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'})

    files = request.files.getlist('file')
    if files:
        for file in files:
            filename = file.filename
            file.save(os.path.join(UPLOAD_DIR, filename))
        return jsonify({'message': 'File uploaded succesfully'})

@app.route('/predict', methods=['POST'])
def predict():
    # Get the feature data from the request
    feature_data = request.json['features']
    
    cmd = ['conda', 'run', '-n', 'tf_env', 'python', './predict.py', str(feature_data)[1:-1], MODEL_PATH, SCALER_PATH]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    # process = subprocess.Popen(["conda", "run", "-n", "tf_env", "python", "./testy.py", str(feature_data)[1:-1]], stdout=subprocess.PIPE, stdin=subprocess.PIPE)
    output, error = process.communicate()
    
    # format the output as JSON and return
    output = {'prediction': output.decode("utf-8").split('\n')[1]}
    
    return jsonify(output)

if __name__ == '__main__':
    # Start the Flask application
    app.run(debug=True)