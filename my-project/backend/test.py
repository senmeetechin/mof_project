import requests

# Test
mof_name = "str_m5_o5_o24_sra_sym.63.cif"

# send array to Flask API
response = requests.get('http://127.0.0.1:5000/data', json={'mof_name': mof_name})

# print prediction
print(response.json())