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
        initialDoc: '/files/outlines-nested.pdf',
      },
      viewer.current,
    ).then((instance) => {
      instance.UI.enableElements([
        'bookmarksPanel',
        'bookmarksPanelButton',
      ]);
    });
  }, []);

  return (
    <div className="App">
      {/* <div className="header">React sample</div> */}
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
