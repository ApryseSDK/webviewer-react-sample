const fs = require('fs');
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const opn = require('opn');
const ip = require('ip');

const app = express();

app.use(express.static(path.resolve(__dirname), {
  setHeaders: (res) => {
    res.set('Service-Worker-Allowed', '/');
    res.set('Access-Control-Allow-Origin', '*')
  },
}));

app.listen(3001, '0.0.0.0', (err) => {
  if (err) {
    console.error(err);
  } else {
    console.info(`Listening at localhost:3001 (http://${ip.address()}:3001)`);
    if (process.argv[2] === 'samples') {
      opn('http://localhost:3001/samples');
    } else if (process.argv[2] === 'doc') {
      opn('http://localhost:3001/doc/PDFTron.WebViewer.html');
    }
  }
});