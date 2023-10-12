import React, { useRef, useEffect } from 'react';
import WebViewer from '@pdftron/webviewer';
import './App.css';

const App = () => {
  const viewer = useRef(null);

  const jsonData = {
    COMPANYNAME: 'Apryse',
    CUSTOMERNAME: 'Huw Dickens',
    CompanyAddressLine1: '838 W Hastings St 5th floor',
    CompanyAddressLine2: 'Vancouver, BC V6C 0A6',
    CustomerAddressLine1: '123 Main Street',
    CustomerAddressLine2: 'Vancouver, BC V6A 2S5',
    Date: { html: "<span style='color: red'><b>Nov 5th, 2023</b></span>" },
    ExpiryDate: 'Nov 15th, 2023',
    QuoteNumber: '134',
    WEBSITE: 'www.apryse.com',
    rows: [{ 'item': 'Apples', 'item_qty': '3', 'item_price': '$5.00', 'item_total': '$15.00' },
    { 'item': 'Oranges', 'item_qty': '2', 'item_price': '$5.00', 'item_total': '$10.00' }],
    days: '30',
    total: '$25.00'
  };

  // if using a class, equivalent of componentDidMount
  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        licenseKey: 'your_license_key'  // sign up to get a free trial key at https://dev.apryse.com
      },
      viewer.current
    ).then(instance => {
      const { Feature } = instance.UI;
      instance.UI.enableFeatures([Feature.FilePicker]);
    });
  }, []);

  const handleClick = async () => {
    const instance = WebViewer.getInstance();
    if (instance) {
      const doc = instance.Core.documentViewer.getDocument();
      if (doc) {
        await doc.getDocumentCompletePromise();

        // get a  value from a RESTful API
        let response = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json")
        let data = await response.json();
        jsonData['UsdRate'] = data.bpi.USD.rate;

        //populate the PDF by filling the template place holders with data
        doc.applyTemplateValues(jsonData);
      }
    }
  };

  return (
    <div className='App'>
      <div className='header'>React sample</div>
      <div><button type="button" onClick={handleClick}>Click Me</button></div>
      <div className='webviewer' ref={viewer}></div>
    </div>
  );



};

export default App;
