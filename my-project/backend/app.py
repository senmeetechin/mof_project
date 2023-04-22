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
    
@app.route('/getPorE', methods=['POST'])
def get_porE():
    # Get mof
    mof_name = request.json['mof_name']
    mof_path = os.path.join(UPLOAD_DIR, mof_name)
    
    # Run extract_porE.py
    cmd = ['conda', 'run', '-n', 'mof_env', 'python', './extract_porE.py', mof_path]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    return "", 204

@app.route('/getZeo', methods=['POST'])
def get_zeo():
    # Get mof
    mof_name = request.json['mof_name']
    mof_path = os.path.join(UPLOAD_DIR, mof_name)
    
    # Run extract_zeo.py
    cmd = ['conda', 'run', '-n', 'mof_env', 'python', './extract_zeo.py', mof_path]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    return "", 204

@app.route('/combineFeature', methods=['POST'])
def combine_feature():
    mof_name = request.json['mof_name']
    
    # Run combine_feature.py
    cmd = ['conda', 'run', '-n', 'mof_env', 'python', './combine_feature.py', mof_name]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    # print("\n=== OUTPUT ===\n", output.decode('utf-8'))
    return "", 204
    
@app.route('/predict', methods=['POST'])
def predict():
    # Get the feature data from the request
    mof_name = request.json['mof_name']
    
    cmd = ['conda', 'run', '-n', 'tf_env', 'python', './predict.py', mof_name, MODEL_PATH, SCALER_PATH]
    process = subprocess.Popen(cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    
    print(output.decode("utf-8"))
    # format the output as JSON and return
    try:
        output = {'prediction': output.decode("utf-8").split('\n')[1]}
    except:
        output = {'prediction': output.decode('utf-8')}
    
    return jsonify(output)

if __name__ == '__main__':
    # Start the Flask application
    app.run(debug=True)