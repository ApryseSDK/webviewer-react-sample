const download = require('download');
const decompress = require('decompress');
const fs = require('fs-extra');

let downloadedSize = 0;

process.stdout.write('\n');

download(`https://www.pdftron.com/downloads/WebViewer.zip`, '.')
  .on('data', data => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    downloadedSize += data.length;
    process.stdout.write(`Downloading WebViewer... ${(downloadedSize / 100000000 * 100).toFixed(1)}%`);
  })
  .then(() => {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Downloading WebViewer... 100%\nDownload completed.\n\nExtracting WebViewer... `);
    fs.removeSync('public/lib')
    decompress('WebViewer.zip', 'public').then(() => {
      // Trim down office, pdf and ui-legacy
      // It's highly recommended to use XOD for cordova apps for highest performance
      fs.moveSync('public/WebViewer/lib', 'public/lib');
      fs.removeSync('public/WebViewer');
      fs.removeSync('public/lib/core/pdf/full');
      fs.removeSync('public/lib/ui-legacy');
      fs.removeSync('public/lib/package.json');
      fs.removeSync('public/lib/webviewer.js');
      fs.moveSync('public/lib/ui/build', 'public/lib/temp');
      fs.removeSync('public/lib/ui');
      fs.moveSync('public/lib/temp', 'public/lib/ui/build');
      fs.removeSync('WebViewer.zip');
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`Extracting WebViewer... 100%\nExtract completed.\n\n\n`);
    }).catch((err) => {
      console.log(err);
    });
  });