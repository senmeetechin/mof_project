import * as $3Dmol from "3dmol/build/3Dmol.js";
import React, { useEffect } from 'react';

function MOFViz(props) {
  const fileData = props.cifData
  
  useEffect(() => {
    // Initialize the 3Dmol.js viewer
    var container = document.getElementById(props.id);
    var viewer = $3Dmol.createViewer(container);

    // Load the CIF file
    viewer.addModel(fileData,'cif');
    viewer.setStyle({stick:{}}); //sphere
    viewer.zoomTo();
    viewer.render();

  }, [fileData, props.id]);

  return (
    <div id={props.id} className="h-full w-full cursor-all-scroll"></div>
  );
}

export default MOFViz;
