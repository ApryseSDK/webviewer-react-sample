import React, { useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const scrollView = useRef(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    const CoreControls = window.CoreControls;
    CoreControls.setWorkerPath('/webviewer');

    const docViewer = new CoreControls.DocumentViewer();
    docViewer.setScrollViewElement(scrollView.current);
    docViewer.setViewerElement(viewer.current);
    docViewer.setOptions({ enableAnnotations: true });
    docViewer.loadDocument('/files/pdftron_about.pdf');

    docViewer.on('documentLoaded', () => {
      console.log('document loaded');
      // enable default tool for text and annotation selection
      docViewer.setToolMode(docViewer.getTool('AnnotationEdit'));
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
