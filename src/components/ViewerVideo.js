import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import { initializeVideoViewer } from '@pdftron/webviewer-video';

const ViewerVideo = () => {
  const viewer = useRef(null);

  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        selectAnnotationOnCreation: true,
      },
      viewer.current
    ).then(async (instance) => {
      const license =
        '---- Insert commercial license key here after purchase ----';

      // Extends WebViewer to allow loading HTML5 videos (.mp4, ogg, webm).
      const { loadVideo } = await initializeVideoViewer(instance, { license });

      // Load a video at a specific url. Can be a local or public link
      // If local it needs to be relative to lib/ui/index.html.
      // Or at the root. (eg '/video.mp4')
      const videoUrl =
        'https://pdftron.s3.amazonaws.com/downloads/pl/video/video.mp4';
      loadVideo(videoUrl);
    });
  }, []);

  return <div className='webviewer' style={{margin:0}} ref={viewer}></div>;
};

export default ViewerVideo;
