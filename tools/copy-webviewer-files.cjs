const fs = require('fs-extra');

const copyFiles = async () => {
  try {
    await fs.copy('./node_modules/@pdftron/webviewer/public', './public/webviewer/lib');
    console.log('WebViewer files copied over successfully');
  } catch (err) {
    console.error(err);
  }
};

copyFiles();
