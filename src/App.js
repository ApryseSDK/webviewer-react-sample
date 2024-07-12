import React, { useRef, useEffect, useCallback, useState } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';
import {
  Box,
  Button,
} from 'gestalt';
import { addSetupField } from './utils';

const dragOver = (e) => {
  e.preventDefault();
  return false;
};

const App = () => {
  const viewer = useRef(null);
  const [instance, setInstance] = useState(null);

  const drop = useCallback((e, instance) => {
    const { documentViewer } = instance.Core;
    const scrollElement = documentViewer.getScrollViewElement();
    const scrollLeft = scrollElement.scrollLeft || 0;
    const scrollTop = scrollElement.scrollTop || 0;

    addSetupField({
      instance,
      point:{ x: e.pageX + scrollLeft, y: e.pageY + scrollTop },
    });

    return false;
  }, []);

  useEffect(() => {
    if(!instance) {
      WebViewer(
        {
          path: '/webviewer/lib',
          initialDoc: '/files/PDFTRON_about.pdf',
          licenseKey: 'your_license_key',
        },
        viewer.current,
      ).then((_instance) => {
        setInstance(_instance);
        const { iframeWindow } = _instance.UI;

        const iframeDoc = iframeWindow.document.body;

        iframeDoc.addEventListener('dragover', e => {
          dragOver(e, _instance)
        });
        iframeDoc.addEventListener('drop', e => {
          drop(e, _instance);
        });
      });
    }
  }, [drop, instance, setInstance]);

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
