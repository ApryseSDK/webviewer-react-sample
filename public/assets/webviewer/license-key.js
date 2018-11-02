window.sampleL = '' || localStorage.getItem('wv-sample-license-key'); // enter your key here so that the sample will run

if (!window.sampleL) {
  const sampleL = window.prompt('No license key is specified.\nPlease enter your key here or add it to license-key.js inside the webviewer folder.', '');

  if (sampleL) {
    localStorage.setItem('wv-sample-license-key', sampleL);
    window.sampleL = sampleL;
  }
}