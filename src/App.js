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
        initialDoc: '/files/blank.pdf',
        licenseKey: 'your_license_key'  // sign up to get a free trial key at https://dev.apryse.com
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager } = instance.Core;

      const customData = 'custom data text for testing';
      const xfdfString = `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve"><pdf-info xmlns="http://www.pdftron.com/pdfinfo" version="2" import-version="4" /><fields /><annots><square page="0" rect="112.120,476.670,469.490,671.710" color="#E44234" flags="print" name="f74be6c4-2831-7987-8702-373fd279e700" title="Guest" subject="Rectangle" date="D:20231003140042-07'00'" creationdate="D:20231003140041-07'00'" dashes=""/></annots><pages><defmtx matrix="1,0,0,-1,0,792" /></pages></xfdf>`;

      documentViewer.addEventListener('documentLoaded', async () => {
        // import annotations via xfdf
        // https://docs.apryse.com/documentation/web/guides/annotation/import-export/files/
        await annotationManager.importAnnotations(xfdfString);

        const annotationList = annotationManager.getAnnotationsList();
        if (annotationList.length > 0) {
          const firstAnnot = annotationList[0];
          // https://docs.apryse.com/api/web/Core.Annotations.Annotation.html#setCustomData__anchor
          firstAnnot.setCustomData('myCustomAttribute', customData);
        }
      });

      annotationManager.addEventListener('annotationChanged', (annots, action) => {
        if (action === 'modify') {
          // https://docs.apryse.com/api/web/Core.Annotations.Annotation.html#getCustomData
          // If no data is available an empty string is returned
          console.log(annots[0].getCustomData('myCustomAttribute'));
        }
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
