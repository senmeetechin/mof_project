import requests
import pandas as pd
import numpy as np

# download feature csv
test_df = pd.read_csv('./dummy_data/TEST.csv')
test = np.array(test_df.iloc[1])

# send array to Flask API
response = requests.post('http://127.0.0.1:5000/predict', json={'features': test.tolist()})
# response = requests.get('http://127.0.0.1:5000/test')

# print prediction
print(response.json()['prediction'])