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
        fullAPI: true,
      },
      viewer.current,
    ).then(async (instance) => {
      const { Core, UI } = instance;
      const { PDFNet } = Core;
      
      await PDFNet.initialize();

      await PDFNet.runWithoutCleanup(async () => { 
          const doc = await PDFNet.PDFDoc.create();
          doc.initSecurityHandler();
          doc.lock();
  
          const tiffFile = await PDFNet.Filter.createURLFilter("./files/test.tif");
          await PDFNet.Convert.fromTiff(doc, tiffFile);
          doc.unlock();
          UI.loadDocument(doc);
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
