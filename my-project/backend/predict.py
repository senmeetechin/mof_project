import tensorflow as tf
import pandas as pd
import numpy as np
import joblib
import sys
import os

def predict(mof_name, model_path, scaler_path):
    mof_nname = mof_name.split('/')[-1].replace('.cif', '')
    feature_df = pd.read_csv(os.path.join('../src/extracted', mof_nname+'_combine.csv'))
    feature_data = np.array(feature_df)
    
    # reshape the input array 
    feature_array = np.array(feature_data).reshape(1, -1)
    
    # MinMaxScaler for normalize data
    scaler = joblib.load(scaler_path)
    
    # normalize data
    feature_norm = scaler.transform(feature_array)
    
    # load model
    model = tf.keras.models.load_model(model_path)
    # print("MODEL", model)
    
    # prediction
    prediction = model.predict(feature_norm , verbose=0)
    # print("PREDICTION",)
    
    return str(prediction[0][0])

if __name__ == '__main__':
    mof_name = sys.argv[1]
    model_path  = sys.argv[2]
    scaler_path = sys.argv[3]
    prediction = predict(mof_name, model_path, scaler_path)
    print(prediction)