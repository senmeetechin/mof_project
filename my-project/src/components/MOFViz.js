import * as $3Dmol from "3dmol/build/3Dmol.js";
import React, { Component } from 'react';
import mof_file from '../assets/str_m1_o1_o1_pcu_sym.9.cif'

class MOFViz extends Component {
  componentDidMount() {
    // Initialize the 3Dmol.js viewer
    var container = document.getElementById("viewer");
    var viewer = $3Dmol.createViewer(container);
    var file = mof_file

    // Load the CIF file
    $3Dmol.get(file, function(data) {
        viewer.addModel(data,'cif');
        viewer.setStyle({stick:{}}); //sphere
        viewer.zoomTo();
        viewer.render( );
      });
  }

  render() {
    return (
      <div id="viewer" style={{ width: "100%", height: "100%" }}></div>
    );
  }
}

export default MOFViz;

