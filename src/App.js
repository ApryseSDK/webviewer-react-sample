import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const selectedAnnotationsRef = useRef(null);
  const instanceRef = useRef(null);


  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/PDFTRON_about.pdf',
        licenseKey: 'your_license_key',
        isReadOnly: false,
      },
      viewer.current,
    ).then((instance) => {
      const { annotationManager } = instance.Core;
      const handleAnnotationSelected = annotations => {
        selectedAnnotationsRef.current = annotations;
      };
      instance.UI.enableFeatures([instance.UI.Feature.ContentEdit]);

      annotationManager.addEventListener("annotationSelected", handleAnnotationSelected);
      instanceRef.current = instance;
    });
  }, []);

  const onStopEditing = async () => {
    const { documentViewer } = instanceRef.current.Core;

    const contentEditManager = await documentViewer.getContentEditManager();
    selectedAnnotationsRef.current.forEach(annotation => {
      const contentBoxId = annotation.getCustomData("contentEditBoxId");
      const box = contentEditManager.getContentBoxById(contentBoxId);

      box.stopContentEditing();
    });
  }

  return (
    <div className="App">
      <div className="header">React sample
        <button onClick={onStopEditing}>Stop editing and save</button>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
