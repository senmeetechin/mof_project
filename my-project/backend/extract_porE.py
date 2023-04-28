import sys
import os
import numpy as np
import pandas as pd
from porE.hea.HEA import HEA
from pore import porosity as p
from pore import psd 
from porE.io.ase2pore import *

def run_GPA_gridPerA(xyz,PROBE_R,grid_density):
    '''
        Execute porosity evaluation, using the grid point apporach (GPA)
        Here: Provide a grid density along all cell vectors a, b, c
              porE will determine the amount of grid points automatically

        A probe radius for the accessible porosity needs to be provided

        Input
        -----
        xyz          ... structural information in a xyz format compatible with porE
        PROBE_R      ... probe radius, in A
        grid_density ... grid point density along all cell vectors, in points/A

        Output
        ------
        Phi_void   ... Void porosity, in %
        Phi_acc    ... Accessible porosity, in %
        density    ... density of the structure, in kg/m^3
        poreV_void ... pore volume density wrt void porosity, in cm^3/g
        poreV_acc  ... pore volume density wrt accessible porosity, in cm^3/g
    '''
    Phi_void, Phi_acc, density, poreV_void, poreV_acc = p.gpa_gridpera(xyz, PROBE_R, grid_density)
    return Phi_void, Phi_acc, density, poreV_void, poreV_acc


def PorE(mof_cif, PROBE_R=2.004, grid_density = 10):
    
    # Get mof name (without .cif)
    mof_name = mof_cif.split('/')[-1].replace('.cif','')
    
    cif_path = mof_cif
    
    # Convert cif to xyz for using in OSA, PSA and GPA
    ase2pore(cif_path)
    mof_xyz = mof_name+'.xyz'
    
    Phi_void, Phi_acc, density, poreV_void, poreV_acc = np.nan, np.nan, np.nan, np.nan, np.nan
    Phi_void, Phi_acc, density, poreV_void, poreV_acc = run_GPA_gridPerA(mof_xyz,PROBE_R,grid_density)
    
    data = {
        'name': mof_name,
        'Phi_void': Phi_void,     # %
        'Phi_acc': Phi_acc,       # %
        'density': density,       # kg/m^3
        'poreV_void': poreV_void, # cm^3/g
        'poreV_acc': poreV_acc,   # cm^3/g
    }
    
    # Remove.xyz
    if os.path.exists(mof_name+".xyz"):
        os.remove(mof_name+".xyz")
    
    dataframe = pd.DataFrame(data, index=[0])
    return dataframe

def extract_pore(mof_path, extracted_path):
    try:
        mof_data = PorE(mof_path)
        mof_name = mof_path.split('/')[-1].replace('.cif', '')
        mof_data.to_csv(os.path.join(extracted_path, mof_name+'_porE.csv'), index=False)
        print(f'{mof_name} has already extracted by porE')
    except:
        print(f'{mof_name} failed to extract by porE')

if __name__ == '__main__':
    mof_path = sys.argv[1]
    extracted_path = sys.argv[2]
    extract_pore(mof_path, extracted_path)