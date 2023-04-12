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
      },
      viewer.current,
    ).then((instance) => {
      instance.UI.enableFeatures([instance.UI.Feature.FilePicker]);

      const { documentViewer } = instance.Core;
      documentViewer.addEventListener('documentLoaded', async () => {
        console.log('Document Loaded');
        const pages = documentViewer.getPageCount();
        const newRotation = 1;
        for (let pageNumber = 1; pageNumber <= pages; pageNumber++) {
          try {
            console.log('page: ', pageNumber);
            documentViewer.setRotation(2, pageNumber);
            documentViewer.refreshPage(pageNumber);
          } catch (e) {
            console.log(`Failed to rotate page ${pageNumber}  to ${newRotation}`, e);
          }
        }
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
