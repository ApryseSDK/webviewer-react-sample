import React, { useState } from 'react';
import Viewer from './components/Viewer';
import ViewerVideo from './components/ViewerVideo';
import './App.css';

const App = () => {
  const [fileType, setFileType] = useState('');
 
  return (
    <div className="App">
      <div className="header">React sample</div>
      {fileType === '' ? <div>
        <button onClick={() => setFileType('pdf')}>Open Documents</button>
        <button onClick={() => setFileType('video')}>Open Video</button>
      </div> : fileType === 'pdf' ? <Viewer/> : <ViewerVideo/>
      }
    </div>
  );
};

export default App;
