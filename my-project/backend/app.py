import subprocess
import sys

### Prediction API ###
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
import os
import pandas as pd

# Initialize Flask application
app = Flask(__name__)
# Use CORS
CORS(app)

# set upload folder
UPLOAD_DIR = './upload'
EXTRACTED_DIR = './extracted'
MODEL_PATH = './model/best_model_78_0.06193.h5'
SCALER_PATH = './static/minmaxScaler.joblib'


@app.route('/test', methods=['GET'])
def test():
    output = {'prediction': 'THIS IS STRING FOR TESTING API'}
    return jsonify(output)


@app.route('/files', methods=['GET'])
def get_files():
    output = {
        'upload': os.listdir(UPLOAD_DIR),
        'extracted': os.listdir(EXTRACTED_DIR)
    }
    return jsonify(output)


@app.route('/csv', methods=['POST'])
def get_csv_content():
    # Get mof
    mof_name = request.json['mof_name']
    mof_name = mof_name.replace('.cif', '')

    # Initialize output
    output = {
        'porE': {},
        'zeo': {},
        'combine': {},
        'predict': {},
    }

    # Read csv if it exists
    if os.path.exists(os.path.join(EXTRACTED_DIR, mof_name+"_porE.csv")):
        output['porE'] = pd.read_csv(os.path.join(
            EXTRACTED_DIR, mof_name+"_porE.csv")).T.to_dict()[0]
    if os.path.exists(os.path.join(EXTRACTED_DIR, mof_name+"_zeo.csv")):
        output['zeo'] = pd.read_csv(os.path.join(
            EXTRACTED_DIR, mof_name+"_zeo.csv")).T.to_dict()[0]
    if os.path.exists(os.path.join(EXTRACTED_DIR, mof_name+"_combine.csv")):
        output['combine'] = pd.read_csv(os.path.join(
            EXTRACTED_DIR, mof_name+"_combine.csv")).T.to_dict()[0]
    if os.path.exists(os.path.join(EXTRACTED_DIR, mof_name+"_result.csv")):
        output['predict'] = pd.read_csv(os.path.join(
            EXTRACTED_DIR, mof_name+"_result.csv")).T.to_dict()[0]
    return jsonify(output)


@app.route('/upload', methods=['POST'])
def upload_files():
    if 'file' not in request.files:
        return jsonify({'error': 'No file path'})

    files = request.files.getlist('file')
    if files:
        for file in files:
            filename = file.filename
            file.save(os.path.join(UPLOAD_DIR, filename))
        return jsonify({'message': 'File uploaded succesfully'})
    else:
        return jsonify({'error': 'No file content'})


@app.route('/cifContent', methods=['POST'])
def get_cif_content():
    # Get mof name
    mof_name = request.json['mof_name']
    mof_path = os.path.join(UPLOAD_DIR, mof_name)

    # Read content in cif file
    with open(mof_path, 'r') as f:
        lines = f.read()

    output = {'cifData': lines}
    return jsonify(output)


@app.route('/getPorE', methods=['POST'])
def get_porE():
    # Get mof
    mof_name = request.json['mof_name']
    mof_path = os.path.join(UPLOAD_DIR, mof_name)

    # Run extract_porE.py
    cmd = ['conda', 'run', '-n', 'mof_env',
           'python', './extract_porE.py', mof_path, EXTRACTED_DIR]
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    if process.returncode != 0:
        print("Error getPorE", error.decode('utf-8'))
        return {"error": error.decode('utf-8')}, 500
    return {"message": output.decode('utf-8')}, 200


@app.route('/getZeo', methods=['POST'])
def get_zeo():
    # Get mof
    mof_name = request.json['mof_name']
    mof_path = os.path.join(UPLOAD_DIR, mof_name)

    # Run extract_zeo.py
    cmd = ['conda', 'run', '-n', 'mof_env',
           'python', './extract_zeo.py', mof_path, EXTRACTED_DIR]
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    if process.returncode != 0:
        print("Error getZeo", error.decode('utf-8'))
        return {"error": error.decode('utf-8')}, 500
    return {"message": output.decode('utf-8')}, 200


@app.route('/combineFeature', methods=['POST'])
def combine_feature():
    mof_name = request.json['mof_name']

    # Run combine_feature.py
    cmd = ['conda', 'run', '-n', 'mof_env',
           'python', './combine_feature.py', mof_name, EXTRACTED_DIR]
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    if process.returncode != 0:
        print("Error combineFeature", error.decode('utf-8'))
        return {"error": error.decode('utf-8')}, 500
    return {"message": output.decode('utf-8')}, 200


@app.route('/predict', methods=['POST'])
def predict():
    # Get the feature data from the request
    mof_name = request.json['mof_name']

    cmd = ['conda', 'run', '-n', 'tf_env', 'python',
           './predict.py', mof_name, MODEL_PATH, SCALER_PATH, EXTRACTED_DIR]
    process = subprocess.Popen(
        cmd, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    output, error = process.communicate()
    if process.returncode != 0:
        print("Error predict", error.decode('utf-8'))
        return {"error": error.decode('utf-8')}, 500

    # format the output as JSON and return
    if os.path.exists(os.path.join(EXTRACTED_DIR, mof_name.replace('.cif', '')+'_result.csv')):
        result = pd.read_csv(os.path.join(
            EXTRACTED_DIR, mof_name.replace('.cif', '')+'_result.csv'))
        result = str(result['CO2_adsorption'][0])
    else:
        result = "0.0"

    print(result)

    output = {
        'prediction': result,
    }

    print(output)

    return jsonify(output)


@app.route('/data', methods=['POST'])
def get_data():
    # get mof_name from request
    mof_name = request.json['mof_name']
    mof_name = mof_name.replace('.cif', '')

    # initial data
    output = {
        'name': mof_name+".cif",
        'Phi_void': -99,
        'Phi_acc': -99,
        'density': -99,
        'poreV_void': -99,
        'poreV_acc': -99,
        'Di': -99,
        'Df': -99,
        'Dif': -99,
        'volume': -99,
        'ASA_A2': -99,
        'ASA_m2/cm3': -99,
        'ASA_m2/g': -99,
        'NASA_A2': -99,
        'NASA_m2/cm3': -99,
        'NASA_m2/g': -99,
        'weight': -99,
        'CO2_adsorption': -99
    }

    print("API", "PASS")

    if os.path.exists(os.path.join(
            EXTRACTED_DIR, mof_name+'_result.csv')):
        result = pd.read_csv(os.path.join(
            EXTRACTED_DIR, mof_name+'_result.csv'))
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
            # 'weight': data['weight'],
            'CO2_adsorption': data['CO2_adsorption']
        }
        print("API1 PASS")
    elif os.path.exists(os.path.join(
            EXTRACTED_DIR, mof_name+'_combine.csv')):
        result = pd.read_csv(os.path.join(
            EXTRACTED_DIR, mof_name+'_combine.csv'))
        data = result.iloc[0]
        output['name'] = data['name']
        output['Phi_void'] = data['Phi_void']
        output['Phi_acc'] = data['Phi_acc']
        output['density'] = data['density']
        output['poreV_void'] = data['poreV_void']
        output['poreV_acc'] = data['poreV_acc']
        output['Di'] = data['Di']
        output['Df'] = data['Df']
        output['Dif'] = data['Dif']
        output['volume'] = data['volume']
        output['ASA_A2'] = data['ASA_A2']
        output['ASA_m2/cm3'] = data['ASA_m2/cm3']
        output['ASA_m2/g'] = data['ASA_m2/g']
        output['NASA_A2'] = data['NASA_A2']
        output['NASA_m2/cm3'] = data['NASA_m2/cm3']
        output['NASA_m2/g'] = data['NASA_m2/g']
        # output['weight'] = data['weight']
        print("API2 PASS")
    else:
        if os.path.exists(os.path.join(
                EXTRACTED_DIR, mof_name+'_porE.csv')):
            result = pd.read_csv(os.path.join(
                EXTRACTED_DIR, mof_name+'_porE.csv'))
            data = result.iloc[0]
            output['name'] = data['name']
            output['Phi_void'] = data['Phi_void']
            output['Phi_acc'] = data['Phi_acc']
            output['density'] = data['density']
            output['poreV_void'] = data['poreV_void']
            output['poreV_acc'] = data['poreV_acc']
            print("API3 PASS")
        else:
            print("NOT EXIST3")
        if os.path.exists(os.path.join(
                EXTRACTED_DIR, mof_name+'_zeo.csv')):
            result = pd.read_csv(os.path.join(
                EXTRACTED_DIR, mof_name+'_zeo.csv'))
            data = result.iloc[0]
            output['name'] = data['name']
            output['Di'] = data['Di']
            output['Df'] = data['Df']
            output['Dif'] = data['Dif']
            output['volume'] = data['volume']
            output['ASA_A2'] = data['ASA_A2']
            output['ASA_m2/cm3'] = data['ASA_m2/cm3']
            output['ASA_m2/g'] = data['ASA_m2/g']
            output['NASA_A2'] = data['NASA_A2']
            output['NASA_m2/cm3'] = data['NASA_m2/cm3']
            output['NASA_m2/g'] = data['NASA_m2/g']
            # output['weight'] = data['weight']
            print("API4 PASS")
        else:
            print("NOT EXIST4")
    return jsonify(output)


@app.route('/download', methods=['POST'])
def download_result():
    # get mof_name from request
    mof_name = request.json['mof_name']
    mof_name = mof_name.replace('.cif', '')

    file_path = os.path.join(EXTRACTED_DIR, mof_name+'_result.csv')
    # print(file_path)
    return send_file(file_path, mimetype='text/csv', as_attachment=True)


if __name__ == '__main__':
    # Start the Flask application
    app.run(debug=True, port=int(os.environ.get('PORT', 5000)), host='0.0.0.0')
