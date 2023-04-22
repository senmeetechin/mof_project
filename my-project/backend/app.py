import subprocess
import sys

### Prediction API ###
from flask import Flask, jsonify, request
import os
import pandas as pd

# Initialize Flask application
app = Flask(__name__)

# set upload folder
UPLOAD_DIR = '../src/upload'
MODEL_PATH = './model/best_model_78_0.06193.h5'
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
    cmd = ['conda', 'run', '-n', 'mof_env',
           'python', './extract_porE.py', mof_path]
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    return "", 204


@app.route('/getZeo', methods=['POST'])
def get_zeo():
    # Get mof
    mof_name = request.json['mof_name']
    mof_path = os.path.join(UPLOAD_DIR, mof_name)

    # Run extract_zeo.py
    cmd = ['conda', 'run', '-n', 'mof_env',
           'python', './extract_zeo.py', mof_path]
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    return "", 204


@app.route('/combineFeature', methods=['POST'])
def combine_feature():
    mof_name = request.json['mof_name']

    # Run combine_feature.py
    cmd = ['conda', 'run', '-n', 'mof_env',
           'python', './combine_feature.py', mof_name]
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    # print("\n=== OUTPUT ===\n", output.decode('utf-8'))
    return "", 204


@app.route('/predict', methods=['POST'])
def predict():
    # Get the feature data from the request
    mof_name = request.json['mof_name']

    cmd = ['conda', 'run', '-n', 'tf_env', 'python',
           './predict.py', mof_name, MODEL_PATH, SCALER_PATH]
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()

    # format the output as JSON and return
    if os.path.exists(os.path.join('../src/extracted', mof_name.replace('.cif', '')+'_result.csv')):
        result = pd.read_csv(os.path.join(
            '../src/extracted', mof_name.replace('.cif', '')+'_result.csv'))
        result = str(result['CO2_adsorption'][0])
    else:
        result = "0.0"

    print(result)

    output = {
        'prediction': result,
    }

    print(output)

    return jsonify(output)


@app.route('/data', methods=['GET'])
def get_data():
    # get mof_name from request
    mof_name = request.json['mof_name']
    mof_name = mof_name.replace('.cif', '')

    # initial data
    output = {
        'name': mof_name+".cif",
        'Phi_void': None,
        'Phi_acc': None,
        'density': None,
        'poreV_void': None,
        'poreV_acc': None,
        'Di': None,
        'Df': None,
        'Dif': None,
        'volume': None,
        'ASA_A2': None,
        'ASA_m2/cm3': None,
        'ASA_m2/g': None,
        'NASA_A2': None,
        'NASA_m2/cm3': None,
        'NASA_m2/g': None,
        'weight': None,
        'CO2_adsorption': None
    }

    if os.path.exists(os.path.join(
            '../src/extracted', mof_name+'_result.csv')):
        result = pd.read_csv(os.path.join(
            '../src/extracted', mof_name+'_result.csv'))
        data = result.iloc[0]
        output = {
            'name': data['name'],
            'Phi_void': data['Phi_void'],
            'Phi_acc': data['Phi_acc'],
            'density': data['density'],
            'poreV_void': data['poreV_void'],
            'poreV_acc': data['poreV_acc'],
            'Di': data['Di'],
            'Df': data['Df'],
            'Dif': data['Dif'],
            'volume': data['volume'],
            'ASA_A2': data['ASA_A2'],
            'ASA_m2/cm3': data['ASA_m2/cm3'],
            'ASA_m2/g': data['ASA_m2/g'],
            'NASA_A2': data['NASA_A2'],
            'NASA_m2/cm3': data['NASA_m2/cm3'],
            'NASA_m2/g': data['NASA_m2/g'],
            'weight': data['weight'],
            'CO2_adsorption': data['CO2_adsorption']
        }
    elif os.path.exists(os.path.join(
            '../src/extracted', mof_name+'_combine.csv')):
        result = pd.read_csv(os.path.join(
            '../src/extracted', mof_name+'_combine.csv'))
        data = result.iloc[0]
        output['name']: data['name']
        output['Phi_void']: data['Phi_void']
        output['Phi_acc']: data['Phi_acc']
        output['density']: data['density']
        output['poreV_void']: data['poreV_void']
        output['poreV_acc']: data['poreV_acc']
        output['Di']: data['Di']
        output['Df']: data['Df']
        output['Dif']: data['Dif']
        output['volume']: data['volume']
        output['ASA_A2']: data['ASA_A2']
        output['ASA_m2/cm3']: data['ASA_m2/cm3']
        output['ASA_m2/g']: data['ASA_m2/g']
        output['NASA_A2']: data['NASA_A2']
        output['NASA_m2/cm3']: data['NASA_m2/cm3']
        output['NASA_m2/g']: data['NASA_m2/g']
        output['weight']: data['weight']
    else:
        if os.path.exists(os.path.join(
                '../src/extracted', mof_name+'_porE.csv')):
            result = pd.read_csv(os.path.join(
                '../src/extracted', mof_name+'_porE.csv'))
            data = result.iloc[0]
            output['name']: data['name']
            output['Phi_void']: data['Phi_void']
            output['Phi_acc']: data['Phi_acc']
            output['density']: data['density']
            output['poreV_void']: data['poreV_void']
            output['poreV_acc']: data['poreV_acc']
        if os.path.exists(os.path.join(
                '../src/extracted', mof_name+'_zeo.csv')):
            result = pd.read_csv(os.path.join(
                '../src/extracted', mof_name+'_zeo.csv'))
            output['name']: data['name']
            output['Di']: data['Di']
            output['Df']: data['Df']
            output['Dif']: data['Dif']
            output['volume']: data['volume']
            output['ASA_A2']: data['ASA_A2']
            output['ASA_m2/cm3']: data['ASA_m2/cm3']
            output['ASA_m2/g']: data['ASA_m2/g']
            output['NASA_A2']: data['NASA_A2']
            output['NASA_m2/cm3']: data['NASA_m2/cm3']
            output['NASA_m2/g']: data['NASA_m2/g']
            output['weight']: data['weight']
            
    return jsonify(output)


if __name__ == '__main__':
    # Start the Flask application
    app.run(debug=True)
