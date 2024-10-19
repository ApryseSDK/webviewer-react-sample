import React, { useRef, useEffect, useCallback } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';
import {
  Box,
  Button,
} from 'gestalt';



const App = () => {
  let isOverlapping = false;
  const viewer = useRef(null);

  const addField = useCallback((type, point = {}, instance, name = '', value = '', flag = {},) => {
    const { documentViewer, Annotations } = instance.Core;
    const annotationManager = documentViewer.getAnnotationManager();
    const doc = documentViewer.getDocument();
    const displayMode = documentViewer.getDisplayModeManager().getDisplayMode();
    const page = displayMode.getSelectedPages(point, point);
    if (!!point.x && page.first == null) {
      return; //don't add field to an invalid page location
    }
    const page_idx =
      page.first !== null ? page.first : documentViewer.getCurrentPage();
    const page_info = doc.getPageInfo(page_idx);
    const page_point = displayMode.windowToPage(point, page_idx);
    const zoom = documentViewer.getZoomLevel();

    var textAnnot = new Annotations.FreeTextAnnotation();
    textAnnot.PageNumber = page_idx;
    const rotation = documentViewer.getCompleteRotation(page_idx) * 90;
    textAnnot.Rotation = rotation;
    if (rotation === 270 || rotation === 90) {
      textAnnot.Width = 50.0 / zoom;
      textAnnot.Height = 250.0 / zoom;
    } else {
      textAnnot.Width = 250.0 / zoom;
      textAnnot.Height = 50.0 / zoom;
    }
    textAnnot.X = (page_point.x || page_info.width / 2) - textAnnot.Width / 2;
    textAnnot.Y = (page_point.y || page_info.height / 2) - textAnnot.Height / 2;

    textAnnot.setPadding(new Annotations.Rect(0, 0, 0, 0));
    textAnnot.custom = {
      type,
      value,
      flag,
      name: `${"test"}_${type}_`,
    };

    // set the type of annot
    textAnnot.setContents(textAnnot.custom.name);
    textAnnot.FontSize = '' + 20.0 / zoom + 'px';
    textAnnot.FillColor = new Annotations.Color(211, 211, 211, 0.5);
    textAnnot.TextColor = new Annotations.Color(0, 165, 228);
    textAnnot.StrokeThickness = 1;
    textAnnot.StrokeColor = new Annotations.Color(0, 165, 228);
    textAnnot.TextAlign = 'center';

    textAnnot.Author = annotationManager.getCurrentUser();

    annotationManager.deselectAllAnnotations();
    annotationManager.addAnnotation(textAnnot, true);
    annotationManager.redrawAnnotation(textAnnot);
    annotationManager.selectAnnotation(textAnnot);
  }, []);

  const dragOver = (e, _instance) => {
    console.log('dragover');
    const { annotationManager } = _instance.Core;
    const annotation = annotationManager.getAnnotationByMouseEvent(e);
    isOverlapping = false;
    if (annotation) {
      console.log(annotation);
      isOverlapping = true;
    }
    e.preventDefault();
    return false;
  };

  const drop = useCallback((e, instance) => {
    console.log('drop');
    const { documentViewer } = instance.Core;
    const scrollElement = documentViewer.getScrollViewElement();
    const scrollLeft = scrollElement.scrollLeft || 0;
    const scrollTop = scrollElement.scrollTop || 0;

    console.log(isOverlapping);
    if (!isOverlapping) {
      addField('SIGNATURE', { x: e.pageX + scrollLeft, y: e.pageY + scrollTop }, instance);
    }

    return false;
  }, [addField]);

  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/PDFTRON_about.pdf',
        licenseKey: 'your_license_key',
      },
      viewer.current,
    ).then((_instance) => {
      const { iframeWindow } = _instance.UI;

      const iframeDoc = iframeWindow.document.body;
      iframeDoc.addEventListener('dragover', e => {
        dragOver(e, _instance)
      });
      iframeDoc.addEventListener('drop', e => {
        drop(e, _instance);
      });

    const { documentViewer, annotationManager } = _instance.Core;
      documentViewer.addEventListener('mouseMove',(e)=>{
        const annotUnderMouse = annotationManager.getAnnotationByMouseEvent(e);
        // console.log({ annotUnderMouse });
      });

    });
  }, [drop]);

  const dragStart = e => {
    console.log('dragstart');
    e.target.style.opacity = 0.5;
    const copy = e.target.cloneNode(true);
    copy.id = 'form-build-drag-image-copy';
    copy.style.width = '250px';
    document.body.appendChild(copy);
    e.dataTransfer.setDragImage(copy, 125, 25);
    e.dataTransfer.setData('text', '');
  };

  const dragEnd = (e) => {
    console.log('dragend');
    e.target.style.opacity = 1;
    document.body.removeChild(
      document.getElementById('form-build-drag-image-copy'),
    );
    e.preventDefault();
  };

  return (
    <div className="App">
      <div className="webviewer" ref={viewer}></div>
      <div>
        <Box padding={2}>
          <div
            draggable
            onDragStart={e => dragStart(e)}
            onDragEnd={e => dragEnd(e)}
          >
            <Button
              accessibilityLabel="add signature"
              text="Add signature"
              iconEnd="compose"
            />
          </div>
        </Box>
      </div>
    </div>
  );
};

export default App;
