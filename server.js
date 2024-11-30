const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

const app = express();
const port = process.env.PORT || 4000;

app.get('*', (req, res, next) => {
  const filePath = path.join(__dirname, 'build', req.path);
  if(filePath.includes("InfixServerWasm") && filePath.includes("br")) {
    const read = util.promisify(fs.readFile);
    read(filePath)
      .then((content) => {
            res.set('Content-Encoding', 'br');
            res.set('Content-Type', 'application/octet-stream');
            res.send(content);
      })
      .catch(next);
  } else {
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
          next();
        } else {
          res.sendFile(filePath);
        }
      });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
