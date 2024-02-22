import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

export const MIN_DEVICE_PIXEL_RATIO = 5;


export const createCanvas = ({ width, height }) => {
  const canvas = document.createElement("canvas");

  canvas.width = width;
  canvas.height = height;

  const dpr = window.devicePixelRatio > MIN_DEVICE_PIXEL_RATIO ? window.devicePixelRatio : MIN_DEVICE_PIXEL_RATIO;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  const ctx = canvas.getContext("2d");

  ctx.scale(dpr, dpr);

  return { canvas, ctx };
};

/* function scalePoints(points, targetHeight, targetWidth, canvas) {
// Find the min and max coordinates
const minX = Math.min(...points.map(point => point.x));
const minY = Math.min(...points.map(point => point.y));
const maxX = Math.max(...points.map(point => point.x));
const maxY = Math.max(...points.map(point => point.y));

// Calculate the scale factor to fit the path within the canvas
const scaleX = canvas.width / (maxX - minX);
const scaleY = canvas.height / (maxY - minY);
const scale = Math.min(scaleX, scaleY);

  return points.map((point) => ({
    x: (point.x - minX) * scale,
    y: (point.y - minY) * scale,
  }));
} */

export const prepareCanvasToAppendAnnotationImage = async ({  signatureWidget, instance }) => {
  const box = {
      width: 500, /* signatureWidget?.Width */
      height: 500, /*  signatureWidget?.Height. commented temporarily, as I am yet to figure out how I can scale the ink annotation path points such that they would fit within box dimensions.*/
  };

  const { canvas, ctx } = createCanvas({
      height: box.height,
      width: box.width
  });

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#8C95A6";
  ctx.beginPath();
  ctx.rect(0, 0, box.width, box.height);
  ctx.stroke();


  ctx.textBaseline = "top";

  return {
      stamp: new instance.Core.Annotations.StampAnnotation({
          PageNumber: signatureWidget.PageNumber,
          X: signatureWidget?.X,
          Y: signatureWidget?.Y - 500,
          Width: box.width,
          Height: box.height
      }),
      ctx,
      canvas
  };
};

// https://support.apryse.com/support/tickets/61784

const App = () => {
  const viewer = useRef(null);

  const annotationRef = useRef({});

  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/apryse.pdf',
        licenseKey: 'your_license_key',  // sign up to get a free trial key at https://dev.apryse.com
      },
      viewer.current,
    ).then((instance) => {
      const { documentViewer, annotationManager, Annotations } = instance.Core;

      const onAnnotationChanged = (
        annotations,
        action,
        info
    ) => {
        if (info.imported) {
            return;
        }

        const [annotation] = annotations;

        if (action === "add") {
            annotationRef.current = annotation;
        }

    };

      annotationManager.addEventListener("annotationChanged", onAnnotationChanged);
      const signatureTool = documentViewer.getTool("AnnotationCreateSignature");

        let signatureWidget;
        let canvas;
        let ctx;
        let stamp;


        const onSignatureWidgetSelected = async (...args) => {
            [, signatureWidget] = args;
            ({ stamp, ctx, canvas } = await prepareCanvasToAppendAnnotationImage({
                signatureWidget,
                instance,
            }));
        };

        const onAnnotationAdded = async annotation => {
            if (signatureWidget) {

               const path = annotation.getPath(); //
              //  const path = scalePoints(annotation.getPath(), annotation.Height, annotation?.Width);
               console.log({path});

               ctx.strokeStyle = "#000";
               ctx.lineWidth = 2;
               ctx.beginPath();
               ctx.moveTo(path[0].X, path[0].Y);
               for (let i = 1; i < path.length; i++) {
                ctx.lineTo(path[i].X, path[i].Y);
               }
               ctx.stroke();
              await stamp.setImageData(canvas.toDataURL());
              await annotationManager.addAnnotation(stamp);
            }
        };

        signatureTool.addEventListener("locationSelected", onSignatureWidgetSelected);
        signatureTool.addEventListener("annotationAdded", onAnnotationAdded);


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
