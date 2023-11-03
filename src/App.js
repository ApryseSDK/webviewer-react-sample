import React, { useRef, useEffect, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount 
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/PDFTRON_about.pdf',
        licenseKey: 'your_license_key'  // sign up to get a free trial key at https://dev.apryse.com
      },
      viewer.current,
    ).then(async (instance) => {
      window.localStorage.removeItem('init_timestamp');
      const { documentViewer, annotationManager } = instance.Core;

      let loadVisibleRectTimeOut = null;

      documentViewer.addEventListener('finishedRendering', () => {
        console.log("----finishedRendering----");
      });

      documentViewer.addEventListener('zoomUpdated', (zoomLevel) => {
        console.log("----zoomUpdated----");
        clearTimeout(loadVisibleRectTimeOut);

        const doc = documentViewer.getDocument();
        loadVisibleRectTimeOut = setTimeout(function() {
          doc.getDocumentCompletePromise().then(async () => {
            console.log("----getDocumentCompletePromise----")
            getDocCanvasImg(null, zoomLevel, "fullImageUrl");
            const visibleRect = await getVisibleRect();
            getDocCanvasImg(visibleRect, zoomLevel, "visibleImageUrl");
          });
        }, 500);
        // saveDocCanvasImg('photo', annotationManager.getAnnotationsList()[0].Id);
      });


      async function getVisibleRect() {
        documentViewer.enableViewportRenderMode();
        const visibleRect = documentViewer.getViewportRegionRect(1);
        console.log("visibleRect===", visibleRect);
        return visibleRect;
      }

      function getDocCanvasImg(rect, zoom, urlVariable) {
        const doc = documentViewer.getDocument();
        const pageNumber = documentViewer.getCurrentPage();

        const pageWidth = documentViewer.getPageWidth(pageNumber);
        const pageHeight = documentViewer.getPageHeight(pageNumber);

        let width = pageWidth, height = pageHeight;

        if (rect !== null) {
          const { x1, x2, y1, y2 } = rect;
          width = x2 - x1;
          height = y2 - y1;
        }

        const multiplier = instance.Core.getCanvasMultiplier();
        let rotation = documentViewer.getCompleteRotation(pageNumber);

        var canvasOption = {
          pageNumber,
          zoom,
          drawComplete: async (canvas) => {
            if (rotation < 0) {
              rotation += 4;
            }

            // if (rotation % 2 === 0) {
            //   // canvas.width = width;
            //   // canvas.height = height;
            //   zoom = width / pageWidth;
            //   zoom /= multiplier;
            // } else {
            //   // canvas.width = height;
            //   // canvas.height = width;

            //   zoom = canvas.height / pageWidth;
            //   zoom /= multiplier;
            // }
            // const corePageRotation = (doc.getPageRotation(pageNumber) / 90) % 4;
            annotationManager.setAnnotationCanvasTransform(canvas.getContext('2d'), zoom /= multiplier, rotation);
            await annotationManager.drawAnnotations(pageNumber, canvas, true);
            canvas.toBlob(function(blob) {
              if (blob) {
                const blobUrl = URL.createObjectURL(blob);
                console.log("---blobUrl----", blobUrl);
                downloadURI(blobUrl, urlVariable + '.png');
              }
            }, 'image/png');
          }
        }

        if (rect) {
          canvasOption['renderRect'] = rect;
        }
        doc.loadCanvas(canvasOption);
        documentViewer.refreshAll();
      }

      async function saveDocCanvasImg(annotationType, annotationId) {
        const doc = documentViewer.getDocument();
        if (annotationType === 'photo' || annotationType === 'taskStamp') {

          var annotation = annotationManager.getAnnotationById(annotationId);
          const pageNumber = annotation.PageNumber;
          // get the canvas for the page 
          const pageContainer = instance.UI.iframeWindow.document.getElementById('pageContainer' + pageNumber);
          const pageCanvas = pageContainer.querySelector('.canvas' + pageNumber);

          if (pageCanvas != null) {
            // Scale the coordinates using the devicePixelRatio 
            const scale = window.devicePixelRatio
            const topOffset = (parseFloat(pageCanvas.style.top) || 0) * scale;
            const leftOffset = (parseFloat(pageCanvas.style.left) || 0) * scale;
            const zoom = documentViewer.getZoomLevel() * scale;

            const offset = 500; // SPACE AROUND THE ANNOTATION TO BE CAPTURED
            const x = annotation.X * zoom - leftOffset - (offset / 2);
            const y = annotation.Y * zoom - topOffset - (offset / 2);
            const width = annotation.Width * zoom + offset;
            const height = annotation.Height * zoom + offset;

            const copyCanvas = document.createElement('canvas');
            copyCanvas.width = width;
            copyCanvas.height = height;
            const ctx = copyCanvas.getContext('2d');
            // copy the image data from the page to a new canvas so we can get the data URL 
            ctx.drawImage(pageCanvas, x, y, width, height, 0, 0, width, height);
            downloadURI(copyCanvas.toDataURL(), "snippet_1.png");  // THIS DOES NOT GIVE ANNOTATIONS IN IT. IF "doc.getPageRotation(pageNumber)" IS ROTATED. ITS NOT ACCURATE.

            const corePageRotation = (doc.getPageRotation(pageNumber) / 90) % 4;
            annotationManager.setAnnotationCanvasTransform(copyCanvas.getContext('2d'), zoom, corePageRotation);
            await annotationManager.drawAnnotations(pageNumber, copyCanvas);
            copyCanvas.toBlob(function(blob) {
              if (blob) {
                const blobUrl = URL.createObjectURL(blob);
                console.log("---vm.blobUrl----", blobUrl);
              }
            }, 'image/png');
            downloadURI(copyCanvas.toDataURL(), "snippet_2.png");

          }
        }
      }

      const downloadURI = (uri, name) => {
        const link = document.createElement("a");
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
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
