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
        initialDoc: '/files/receipt.pdf',
      },
      viewer.current,
    ).then((instance) => {
      instance.Core.documentViewer.addEventListener('documentLoaded', () => {
        console.timeEnd('v10build');
        const end = window.performance.now();
        window.document.querySelector('#timer').innerText = ` ${end - window.start}ms`;
      });
    });
  }, []);

  return (
    <div className="App">
      <div className="header">
        WV loading time
        <span id="timer"></span>
      </div>
      <div className="webviewer" ref={viewer}></div>
    </div>
  );
};

export default App;
