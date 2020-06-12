import React, { useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const scrollView = useRef(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    const CoreControls = window.CoreControls;
    CoreControls.setWorkerPath('/webviewer')

    CoreControls.getDefaultPdfBackendType().then(backendType => {
      //const licenseKey = 'Insert commercial license key here after purchase';
      const workerTransportPromise = CoreControls.initPDFWorkerTransports(backendType, {});
    
      const docViewer = new CoreControls.DocumentViewer();
      const partRetriever = new CoreControls.PartRetrievers.ExternalPdfPartRetriever('/files/pdftron_about.pdf');
    
      docViewer.setScrollViewElement(scrollView.current);
      docViewer.setViewerElement(viewer.current);
      docViewer.loadAsync(partRetriever, {
        type: 'pdf',
        backendType: backendType,
        workerTransportPromise: workerTransportPromise
      });
    
      docViewer.setOptions({ enableAnnotations: true });
    
      docViewer.on('documentLoaded', () => {
        console.log('document loaded');
    
        // enable default tool for text and annotation selection
        docViewer.setToolMode(docViewer.getTool('AnnotationEdit'));
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div id="scroll-view" ref={scrollView}>
        <div id="viewer" ref={viewer}></div>
      </div>
    </div>
  );
};

export default App;
