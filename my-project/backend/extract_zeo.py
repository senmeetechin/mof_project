import os
import numpy as np
import pandas as pd
import subprocess
import sys

# Delete old output files
def clear_zeo_files(mof_name):
    if os.path.exists(mof_name+"_output_pd.txt"):
        os.remove(mof_name+"_output_pd.txt")

    if os.path.exists(mof_name+"_output_sa.txt"):
        os.remove(mof_name+"_output_sa.txt")

# Create output files
def create_zeo_files(mof_name, mof_cif, ZEO_PATH='./zeo++-0.3/', PROBE_SIZE=2.004, N_SAMPLING=10000):
    # Set zeo++ command
    pd_cmd = 'network -ha -res '+ mof_name+'_output_pd.txt ' + mof_cif       # Pore diameter
    sa_cmd = 'network -sa ' + str(PROBE_SIZE) + ' ' + str(PROBE_SIZE) + ' ' + str(N_SAMPLING) + ' ' + mof_name + '_output_sa.txt ' + mof_cif       # Surface_area
    
    # Run command via terminal for using zeo++ program
    pd_process = subprocess.Popen(ZEO_PATH + pd_cmd, stdout=subprocess.PIPE, stderr=None, shell=True)
    sa_process = subprocess.Popen(ZEO_PATH + sa_cmd, stdout=subprocess.PIPE, stderr=None, shell=True)

    # Wait until command is finished
    _ = pd_process.communicate()
    _ = sa_process.communicate()
    
def get_data_zeo(mof_path, PROBE_SIZE=2.004, N_SAMPLING=10000):
    
    mof_name = mof_path.split('/')[-1].replace('.cif', '')
    mof_path_name = mof_path.replace('.cif', '')
    # Initailize data
    '''
        ### Pore diameter ###
        Di               Largest included sphere
        Df               Largest free sphere
        Dif              Largest included sphere along free sphere path

        ### Surface area ###
        volume           Unit cell volume
        density          Crystal density
        ASA_A2           Accessible surface area per unit cell
        ASA_m2_cm3       Accessible surface area per volume (in cubic cm)
        ASA_m2_g         Accessible surface area per mass (in gram g)
        NASA_A2          Non-accessible surface area per unit cell
        NASA_m2_cm3      Non-accessible surface area per volume (in cubic cm)
        NASA_m2_g        Non-accessible surface area per mass (in gram g)
    '''
    Di, Df, Dif = np.nan, np.nan, np.nan
    volume, density, ASA_A2, ASA_m2_cm3, ASA_m2_g, NASA_A2, NASA_m2_cm3, NASA_m2_g = np.nan, np.nan, np.nan, np.nan, np.nan, np.nan, np.nan, np.nan
    
    # Create zeo++ files from current mof
    mof_cif = mof_path
    create_zeo_files(mof_path_name, mof_cif, PROBE_SIZE=PROBE_SIZE, N_SAMPLING=N_SAMPLING)
    
    # Get data
    if os.path.exists(mof_path_name + '_output_pd.txt'):       # Pore diameter
        with open(mof_path_name + '_output_pd.txt') as f:
            pd_lines = f.readlines()
            for line in pd_lines:
                pd_data = line.split()
                Di = float(pd_data[1])
                Df = float(pd_data[2])
                Dif = float(pd_data[3])
                break

    if os.path.exists(mof_path_name + '_output_sa.txt'):       # Surface area
        with open(mof_path_name + '_output_sa.txt') as f:
            sa_lines = f.readlines()
            for line in sa_lines:
                sa_data = line.split()
                volume = float(sa_data[3])
                density = float(sa_data[5])
                ASA_A2 = float(sa_data[7])
                ASA_m2_cm3 = float(sa_data[9])
                ASA_m2_g = float(sa_data[11])
                NASA_A2 = float(sa_data[13])
                NASA_m2_cm3 = float(sa_data[15])
                NASA_m2_g = float(sa_data[17])
                break

    mof_data = {
        'name': mof_name,
        'Di': Di,
        'Df': Df,
        'Dif': Dif,
        'volume': volume, 
        'ASA_A2': ASA_A2, 
        'ASA_m2/cm3': ASA_m2_cm3, 
        'ASA_m2/g': ASA_m2_g, 
        'NASA_A2': NASA_A2, 
        'NASA_m2/cm3': NASA_m2_cm3, 
        'NASA_m2/g': NASA_m2_g,
    }
    
    # Clear old zeo++ files
    clear_zeo_files(mof_path_name)
    
    dataframe = pd.DataFrame(mof_data, index=[0])
    return dataframe

def extract_zeo(mof_path, extracted_path):
    try:
        mof_data = get_data_zeo(mof_path)
        mof_name = mof_path.split('/')[-1].replace('.cif', '')
        mof_data.to_csv(os.path.join(extracted_path, mof_name+'_zeo.csv'), index=False)
        print(f'{mof_name} has already extracted by zeo')
    except:
        print(f'{mof_name} failed to extract by zeo')

if __name__ == "__main__":
    mof_path = sys.argv[1]
    extracted_path = sys.argv[2]
    extract_zeo(mof_path, extracted_path)