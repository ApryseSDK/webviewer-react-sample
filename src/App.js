import React, { useRef, useEffect, useState, useCallback } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const [instance, setInstance] = useState(null);
  const [isEditingMode, setIsEditingMode] = useState(false)

  useEffect(() => {
    WebViewer.Iframe(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/sample_pdf.pdf',
        licenseKey: 'your_license_key',
      },
      viewer.current,
    ).then((instance) => {
      setInstance(instance);
    });
  }, []);

  const enableCustomReadOnlyMode = useCallback(
    (isReadOnlyMode = !isEditingMode) => {
      const { annotationManager } = instance.Core;
      const fieldManager = annotationManager.getFieldManager();

      fieldManager.forEachField(field => {
        field.flags.set("ReadOnly", isReadOnlyMode);
      });
    },
    [instance, isEditingMode]
  );

  useEffect(() => {
    if (instance) {
      const { documentViewer } = instance.Core;

      // For the first time when pdf loads
      documentViewer.addEventListener("annotationsLoaded", enableCustomReadOnlyMode);
      // For the subsequent loads when switched between edit and read-only modes.
      enableCustomReadOnlyMode();

      return () => {
        documentViewer.removeEventListener("annotationsLoaded", enableCustomReadOnlyMode);
      };
    }

    return undefined;
  }, [instance, enableCustomReadOnlyMode]);

  return (
    <div className="App">
      <div className="header"><button onClick={() => setIsEditingMode(isEditingMode => !isEditingMode)}>{isEditingMode ? 'Disable Editing' : 'Enable Editing'}</button></div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
