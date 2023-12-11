import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);
  const webComponentViewer = useRef(null);

  const [showWebComponent, setShowWebComponent] = useState(false);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/PDFTRON_about.pdf',
        licenseKey: 'your_license_key'  // sign up to get a free trial key at https://dev.apryse.com
      },
      viewer.current,
    ).then((instance) => {

    }).catch(console.log);
  }, []);

  useEffect(() => {
    if(showWebComponent) {

      WebViewer.WebComponent(
        {
          path: '/webviewer/lib',
          initialDoc: '/files/PDFTRON_about.pdf',
          licenseKey: 'your_license_key'  // sign up to get a free trial key at https://dev.apryse.com
        },
        webComponentViewer.current,
      ).then((instance) => {

      }).catch(console.log);
    }
  }, [showWebComponent]);

  const onWebComponentLoadClick = () => {
    setShowWebComponent(true)
  }

  return (
    <div className="App">
      <div className="header">React sample</div>
      <div>
        <div className="webviewer" ref={viewer}></div>
        <button onClick={onWebComponentLoadClick}>Load WebComponent WebViewer</button>
        {showWebComponent && <div className="webviewerWebComponent" ref={webComponentViewer}></div> }

      </div>
    </div>
  );
};

export default App;
