import tensorflow as tf
import numpy as np
import joblib
import sys

def predict(feature_data, model_path, scaler_path):
    # reshape the input array 
    feature_array = np.array(feature_data).reshape(1, -1)
    
    # MinMaxScaler for normalize data
    scaler = joblib.load(scaler_path)
    
    # normalize data
    feature_norm = scaler.transform(feature_array)
    
    # load model
    model = tf.keras.models.load_model(model_path)
    
    # prediction
    prediction = model.predict(feature_norm, verbose=0)
    
    return str(prediction[0][0])

if __name__ == '__main__':
    feature_data = [float(param) for param in sys.argv[1].split(',')]
    model_path  = sys.argv[2]
    scaler_path = sys.argv[3]
    prediction = predict(feature_data, model_path, scaler_path)
    print(prediction)