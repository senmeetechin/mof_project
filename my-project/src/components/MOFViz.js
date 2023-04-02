import * as $3Dmol from "3dmol/build/3Dmol.js";
import React, { Component } from 'react';

class MOFViz extends Component {
  componentDidMount() {
    // Initialize the 3Dmol.js viewer
    var container = document.getElementById("viewer");
    var viewer = $3Dmol.createViewer(container);

    // Load the CIF file
    $3Dmol.download("pdb:1MO8",viewer,{multimodel:true, frames:true},function(){
        viewer.setStyle({}, {cartoon:{color:"spectrum"}});
        viewer.render();
    });
  }

  render() {
    return (
      <div id="viewer" style={{ width: "100%", height: "100%" }}></div>
    );
  }
}

export default MOFViz;

