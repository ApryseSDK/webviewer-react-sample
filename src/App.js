import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        // initialDoc: '/files/0370010-0-0540.DGN.pdf',
        initialDoc: '/files/007611-009H002.dwg.pdf',
      },
      viewer.current,
    ).then(async (instance) => {
      window.localStorage.removeItem('init_timestamp');

      instance.UI.disableElements(["header", "toolsHeader"]);
      instance.UI.setDefaultPrintOptions({ maintainPageOrientation: true });

      document.getElementById("fitPageBtn").onclick = (e) => {
        instance.UI.setFitMode(instance.UI.FitMode.FitPage);
      };

      document.getElementById("fitWidthBtn").onclick = (e) => {
        instance.UI.setFitMode(instance.UI.FitMode.FitWidth);
      };

      document.getElementById("printBtn").onclick = (e) => {
        instance.UI.openElements(["printModal"]);
      };

    });
  }, []);

  return (
    <div className="App">
      <div className="header">
        React sample
        <button id="fitPageBtn">Fit Page</button>
        <button id="fitWidthBtn">Fit Width</button>
        <button id="printBtn">Print</button>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
