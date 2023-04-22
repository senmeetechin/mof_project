import tensorflow as tf
import pandas as pd
import numpy as np
import joblib
import sys
import os

def remove_if_exist(fpath):
    if os.path.exists(fpath):
        os.remove(fpath)
    else:
        print("NOT EXIST")

def predict(mof_name, model_path, scaler_path):
    mof_nname = mof_name.split('/')[-1].replace('.cif', '')
    feature_df = pd.read_csv(os.path.join('../src/extracted', mof_nname+'_combine.csv'))
    feature_df = feature_df.drop(columns=['name'])
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
    
    # upadte prediction to csv
    result = feature_df.copy()
    result['CO2_adsorption'] = prediction[0][0]
    result.to_csv(os.path.join('../src/extracted', mof_nname+'_result.csv'))
    
    # remove combine.csv
    remove_if_exist(os.path.join('../src/extracted', mof_nname+'_combine.csv'))

if __name__ == '__main__':
    mof_name = sys.argv[1]
    model_path  = sys.argv[2]
    scaler_path = sys.argv[3]
    predict(mof_name, model_path, scaler_path)