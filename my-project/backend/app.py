import tensorflow as tf
from flask import Flask, jsonify, request
import pandas as pd
import numpy as np
import joblib

# Initialize Flask application
app = Flask(__name__)


# load model
model = tf.keras.models.load_model('./model/best_model_78_0.06193.h5')

# MinMaxScaler for normalize data
scaler = joblib.load('./static/minmaxScaler.joblib')

@app.route('/test', methods=['GET'])
def test():
    output = {'prediction': 'THIS IS STRING FOR TESTING API'}
    return jsonify(output)

@app.route('/predict', methods=['POST'])
def predict():
    
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
    return jsonify(output)

if __name__ == '__main__':
    # Start the Flask application
    app.run(debug=True)