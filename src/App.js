import React, { Component } from 'react';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.viewer = React.createRef();
    this.docViewer = null;
    this.annotManager = null;
    this.instance = null;
  }

  componentDidMount() {
    window.WebViewer({
      path: '/lib',
      initialDoc: '/files/webviewer-demo-annotated.pdf'
    }, this.viewer.current).then(instance => {
      // at this point, the viewer is 'ready'
      // call methods from instance, docViewer and annotManager as needed
      this.instance = instance;
      this.docViewer = instance.docViewer;
      this.annotManager = instance.annotManager;

      // you can also access major namespaces from the instance as follows:
      // var Tools = instance.Tools;
      // var Annotations = instance.Annotations;

      // now you can access APIs through `this.instance`
      this.instance.openElement('notesPanel')

      // or listen to events from the viewer element
      this.viewer.current.addEventListener('pageChanged', (e) => {
        const [ pageNumber ] = e.detail;
        console.log(`Current page is ${pageNumber}`);
      });

      // or from the docViewer instance
      this.docViewer.on('annotationsLoaded', () => {
        console.log('annotations loaded');
      });

      this.docViewer.on('documentLoaded', this.wvDocumentLoadedHandler)
    })
  }


  wvDocumentLoadedHandler = () => {
    // call methods relating to the loaded document
    const { Annotations } = this.instance;
    const rectangle = new Annotations.RectangleAnnotation();
    rectangle.PageNumber = 1;
    rectangle.X = 100;
    rectangle.Y = 100;
    rectangle.Width = 250;
    rectangle.Height = 250;
    rectangle.StrokeThickness = 5;
    rectangle.Author = this.annotManager.getCurrentUser();
    this.annotManager.addAnnotation(rectangle);
    this.annotManager.drawAnnotations(rectangle.PageNumber);
    // see https://www.pdftron.com/api/web/WebViewer.html for the full list of low-level APIs
  }

  render() {
    return (
      <div className="App">
        <div className="header">React sample</div>
        <div className="webviewer" ref={this.viewer}></div>
      </div>
    );
  }
}

export default App;
