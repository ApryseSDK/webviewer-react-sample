import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";

const Viewer = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: "/files/PDFTRON_about.pdf",
      },
      viewer.current
    ).then((instance) => {
      const { docViewer, Annotations } = instance;
      const annotManager = docViewer.getAnnotationManager();

      docViewer.on("documentLoaded", () => {
        const rectangleAnnot = new Annotations.RectangleAnnotation();
        rectangleAnnot.PageNumber = 1;
        // values are in page coordinates with (0, 0) in the top left
        rectangleAnnot.X = 100;
        rectangleAnnot.Y = 150;
        rectangleAnnot.Width = 200;
        rectangleAnnot.Height = 50;
        rectangleAnnot.Author = annotManager.getCurrentUser();

        annotManager.addAnnotation(rectangleAnnot);
        // need to draw the annotation otherwise it won't show up until the page is refreshed
        annotManager.redrawAnnotation(rectangleAnnot);
      });
    });
  }, []);

  return <div className="webviewer" style={{margin:0}} ref={viewer}></div>;
};

export default Viewer;
