import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const [instance, setInstance] = useState();
  const [doc, setDoc] = useState();
  const [annotationManager, setAnnotationManager] = useState();

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
      },
      viewer.current,
    ).then((instance) => {
      setInstance(instance);
      setAnnotationManager(instance.Core.annotationManager);
    });

    document.getElementById('file-picker').onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setDoc(file);
      }
    };
  }, []);

  useEffect(() => {
    if (instance && doc) {
      instance.UI.loadDocument(doc);
      annotationManager.addEventListener("annotationChanged", () => {
        console.log("ANNOTATION CHANGED");
        // Everytime this useEffect runs, the number of this line in the console corresponds with the number of annotations in the newly loaded document.
        // Load a document with no annotation will not have this line printed.
      })
    }
  }, [instance, doc]);

  return (
    <div className="App">
      <div className="header">React sample</div>
      <input type="file" id="file-picker"></input>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
