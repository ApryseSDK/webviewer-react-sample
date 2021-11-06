import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  const jsonData = {
    COMPANYNAME: 'PDFTron',
    CUSTOMERNAME: 'Andrey Safonov',
    CompanyAddressLine1: '838 W Hastings St 5th floor',
    CompanyAddressLine2: 'Vancouver, BC V6C 0A6',
    CustomerAddressLine1: '123 Main Street',
    CustomerAddressLine2: 'Vancouver, BC V6A 2S5',
    Date: 'Nov 5th, 2021',
    ExpiryDate: 'Dec 5th, 2021',
    QuoteNumber: '134',
    WEBSITE: 'www.pdftron.com',
    billed_items: {
      insert_rows: [
        ['Apples', '3', '$5.00', '$15.00'],
        ['Oranges', '2', '$5.00', '$10.00'],
      ],
    },
    days: '30',
    total: '$25.00',
  };

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/quote.docx',
      },
      viewer.current
    ).then(async (instance) => {
      const { documentViewer } = instance.Core;

      documentViewer.addEventListener('documentLoaded', async () => {
        await documentViewer.getDocument().documentCompletePromise();
        documentViewer.updateView();

        // const doc = documentViewer.getDocument();
        // const keys = doc.getTemplateKeys();
        // console.log(keys);

        await documentViewer.getDocument().applyTemplateValues(jsonData);
      });
    });
  }, []);

  return (
    <div className='App'>
      <div className='header'>React sample</div>
      <div className='webviewer' ref={viewer}></div>
    </div>
  );
};

export default App;
