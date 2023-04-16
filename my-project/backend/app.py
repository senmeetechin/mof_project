# ### Activate conda env ###
import subprocess
import sys
def activate_env(env_name):
    process = subprocess.Popen(['conda', 'activate', env_name], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    
    if stderr:
        print(f"Failed to activate Conda environment: {stderr.decode('utf-8')}")
        sys.exit(1)

def deactivate_env():
    process = subprocess.Popen(['conda', 'deactivate'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    
    if stderr:
        print(f"Failed to deactivate Conda environment: {stderr.decode('utf-8')}")
        sys.exit(1)
# activate_env("tf_env")
# ##########################

### Prediction API ###
import tensorflow as tf
from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
import joblib
import os

# Initialize Flask application
app = Flask(__name__)

# set upload folder
UPLOAD_DIR = '../src/upload'

# load model
model = tf.keras.models.load_model('./model/best_model_78_0.06193.h5')

# MinMaxScaler for normalize data
scaler = joblib.load('./static/minmaxScaler.joblib')

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
    # activate to tf_env
    # activate_env("mof_env")
    
    # Get the feature data from the request
    feature_data = request.json['features']
    
    # reshape the input array 
    feature_array = np.array(feature_data).reshape(1, -1)
    
    # normalize data
    feature_norm = scaler.transform(feature_array)
    
    # prediction
    prediction = model.predict(feature_norm)
    
    # format the output as JSON and return
    output = {'prediction': str(prediction[0][0])}
    
    # deactivate tf_env
    # deactivate_env()
    
    return jsonify(output)

if __name__ == '__main__':
    # Start the Flask application
    app.run(debug=True)