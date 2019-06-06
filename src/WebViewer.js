import React, { Component } from 'react';
import './WebViewer.css';

class WebViewer extends Component {
  constructor() {
    super();
    this.viewer = React.createRef();
  }

  componentDidMount() {
    this.myWebViewer = new window.PDFTron.WebViewer({
      path: 'lib',
      initialDoc: 'files/webviewer-demo-annotated.pdf'
    }, this.viewer.current);
  }

  getInstance() {
    return this.myWebViewer.getInstance();
  }

  getWindow() {
    return this.viewer.current.querySelector('iframe').contentWindow;
  }

  getElement() {
    return this.viewer.current;
  }

  render() {
    return (
      <div className="webviewer" ref={this.viewer}></div>
    );
  }
}

export default WebViewer;
