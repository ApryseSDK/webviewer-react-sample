import React, { useRef, useEffect } from "react";
import WebViewer from "@pdftron/webviewer";
import { initializeVideoViewer, renderControlsToDOM } from '@pdftron/webviewer-video';

const ViewerVideo = () => {
  const viewer = useRef(null);

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: "/webviewer/lib",
        initialDoc: "/files/PDFTRON_about.pdf",
        selectAnnotationOnCreation: true,
      },
      viewer.current
    ).then(async (instance) => {
        const {
            loadVideo,
        } = await initializeVideoViewer(
            instance,
            '---- Insert commercial license key here after purchase ----',
        );

        // Load a video at a specific url. Can be a local or public link
        // If local it needs to be relative to lib/ui/index.html.
        // Or at the root. (eg '/video.mp4')
        const videoUrl = 'https://pdftron.s3.amazonaws.com/downloads/pl/video/video.mp4';
        loadVideo(videoUrl);

        instance.docViewer.on('documentLoaded', () => {
          const customContainer =
              instance.iframeWindow.document.querySelector('.custom-container');

          // Inject the video Controls into WebViewer
          renderControlsToDOM(instance, customContainer);
        });
    });
  }, []);

  return <div className="webviewer" ref={viewer}></div>;
};

export default ViewerVideo;
