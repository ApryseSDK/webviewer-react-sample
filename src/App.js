import React, { Component } from 'react';
import './App.css';
import WebViewer from './WebViewer';

class App extends Component {
  constructor() {
    super();
    this.webviewer = React.createRef();
  }

  componentDidMount() {
    this.webviewer.current.getElement().addEventListener('ready', this.wvReadyHandler);
    this.webviewer.current.getElement().addEventListener('documentLoaded', this.wvDocumentLoadedHandler);
  }

  wvReadyHandler = () => {
    // now you can access APIs through this.webviewer.current.getInstance()
    this.webviewer.current.getInstance().openElement('notesPanel');
    // see https://www.pdftron.com/documentation/web/guides/ui/apis for the full list of APIs

    // or listen to events from the viewer element
    this.webviewer.current.getElement().addEventListener('pageChanged', (e) => {
      const [ pageNumber ] = e.detail;
      console.log(`Current page is ${pageNumber}`);
    });

    // or from the docViewer instance
    this.webviewer.current.getInstance().docViewer.on('annotationsLoaded', () => {
      console.log('annotations loaded');
    });
  }

  wvDocumentLoadedHandler = () => {
    // you can access docViewer object for low-level APIs
    const { docViewer } = this.webviewer.current.getInstance();
    const annotManager = docViewer.getAnnotationManager();
    // and access classes defined in the WebViewer iframe
    const { Annotations } = this.webviewer.current.getWindow();
    const rectangle = new Annotations.RectangleAnnotation();
    rectangle.PageNumber = 1;
    rectangle.X = 100;
    rectangle.Y = 100;
    rectangle.Width = 250;
    rectangle.Height = 250;
    rectangle.StrokeThickness = 5;
    rectangle.Author = annotManager.getCurrentUser();
    annotManager.addAnnotation(rectangle);
    annotManager.drawAnnotations(rectangle.PageNumber);
    // see https://www.pdftron.com/api/web/PDFTron.WebViewer.html for the full list of low-level APIs
  }

  render() {
    return (
      <div className="App">
        <div className="header">React sample</div>
        <WebViewer ref={this.webviewer}/>
      </div>
    );
  }
}

export default App;
