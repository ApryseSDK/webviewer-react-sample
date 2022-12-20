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
        initialDoc: '/files/PDFTRON_about.pdf',
        disabledElements: [
          'header',
          'toolsHeader',
          'pageNavOverlay'
        ]
      },
      viewer.current,
    ).then((instance) => {
      const { Core, UI } = instance;
      const { documentViewer, annotationManager, Annotations } = Core;
      const LayoutMode = UI.LayoutMode;


      documentViewer.addEventListener('documentLoaded', function() {
        UI.setFitMode(UI.FitMode.FitWidth);
        UI.setLayoutMode(LayoutMode.Single);
      });

      document.getElementById('prevButton').onclick = e => {
        if (documentViewer.getCurrentPage() - 1 > 0) {
          documentViewer.setCurrentPage(
            Math.max(documentViewer.getCurrentPage() - 1, 1),
          );
        }
      };

      document.getElementById('nextButton').onclick = e => {
        if (documentViewer.getCurrentPage() + 1 <= documentViewer.getPageCount()) {
          documentViewer.setCurrentPage(
            Math.min(documentViewer.getCurrentPage() + 1, documentViewer.getPageCount())
          );
        }
      };
    });
  }, []);

  return (
    <div className="App">
      <button type="button" id="prevButton">Previous</button>
      <div className="webviewer" ref={viewer}></div>
      <button type="button" id="nextButton">Next</button>
    </div>
  );
};

export default App;
