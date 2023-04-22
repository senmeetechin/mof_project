import pandas as pd
import os
import sys


def combine_feature(mof_name):
    mof_nname = mof_name.split('/')[-1].replace('.cif', '')
    df_porE = pd.read_csv(os.path.join(
        '../src/extracted', mof_nname+'_porE.csv'))
    df_zeo = pd.read_csv(os.path.join('../src/extracted', mof_nname+'_zeo.csv'))
    df_combine = df_porE.merge(df_zeo, on=['name'], how='inner')
    df_combine['weight'] = (
        1e3/6.0221408e23)*(1/df_combine['density'])*(1e-6/1e-30)*df_combine['volume']/3
    feature_list = ['Phi_void',
                    'Phi_acc',
                    'density',
                    'poreV_void',
                    'poreV_acc',
                    'Di',
                    'Df',
                    'Dif',
                    'volume',
                    'ASA_A2',
                    'ASA_m2/cm3',
                    'ASA_m2/g',
                    'NASA_A2',
                    'NASA_m2/cm3',
                    'NASA_m2/g',
                    'weight']

    df_out = df_combine[feature_list]
    df_out.to_csv(os.path.join('../src/extracted', mof_nname+'_combine.csv'), index=False)

if __name__ == "__main__":
    mof_name = sys.argv[1]
    combine_feature(mof_name)
    # print("\nACCESS TO SCRIPT")
