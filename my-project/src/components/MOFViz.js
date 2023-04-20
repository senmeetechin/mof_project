import * as $3Dmol from "3dmol/build/3Dmol.js";
import React, { useEffect } from 'react';
import mof_file from '../upload/str_m5_o5_o24_sra_sym.63.cif';

function MOFViz(props) {
  useEffect(() => {
    // Initialize the 3Dmol.js viewer
    var container = document.getElementById(props.id);
    var viewer = $3Dmol.createViewer(container);
    console.log("MOF_FILE IMPORT:", mof_file)
    var file = mof_file;

    // Load the CIF file
    $3Dmol.get(file, function(data) {
      viewer.addModel(data,'cif');
      viewer.setStyle({stick:{}}); //sphere
      viewer.zoomTo();
      viewer.render();
    });
  }, [props.id]);

  return (
    <div id={props.id} className="h-full w-full cursor-all-scroll"></div>
  );
}

export default MOFViz;
