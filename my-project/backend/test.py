import requests
import sys

def test(mof_name):
    # Test
    # mof_name = "str_m4_o5_o14_acs_sym.79.cif"
    print(mof_name)

    # send array to Flask API
    # response = requests.get('http://127.0.0.1:5000/files')

    # send array to Flask API
    # response = requests.post('http://127.0.0.1:5000/testEnv',
    #                          json={'env_name': mof_name}
                            #  )

    # send array to Flask API
    response = requests.post('http://127.0.0.1:5000/predict',
                             json={'mof_name': mof_name}
                             )

    # print prediction
    print(response.json())

if __name__ == '__main__':
    mof_name = sys.argv[1]
    test(mof_name)
