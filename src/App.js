import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import { initializeHTMLViewer } from '@pdftron/webviewer-html';
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
    ).then(async (instance) => {

      const { loadHTMLPage, loadHTMLPages, toggleAnnotations } = await initializeHTMLViewer(instance);

      loadHTMLPages([
        {
          url:
            'https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d41656.714956835!2d-123.0850416!3d49.26607539999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sca!4v1591640645684!5m2!1sen!2sca',
          width: 1800,
          height: 1100,
        },
        {
          url:
            'https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik',
          width: 600,
          height: 450,
        },
      ]);
      
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
