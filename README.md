# WebViewer - React sample

[WebViewer](https://docs.apryse.com/documentation/web/) is a powerful JavaScript-based PDF Library that is part of the [Apryse SDK](https://apryse.com/). It provides a slick out-of-the-box responsive UI that interacts with the core library to view, annotate and manipulate PDFs that can be embedded into web projects.

![WebViewer UI](https://www.pdftron.com/downloads/pl/webviewer-ui.png)

This repo is specifically designed for any users interested in integrating WebViewer into React project. You can watch [a video here](https://youtu.be/bVhWXuLSL0k) to help you get started.

## Demos

- [Customizable out-of-the-box UI](https://showcase.apryse.com/toolbar-customization)
- [PDF Viewer](https://showcase.apryse.com/)
- [DOCX Editor](https://showcase.apryse.com/office-editor)
- [Annotation & Markup](https://showcase.apryse.com/annotation-permissions)
- [Generate PDFs from DOCX template](https://showcase.apryse.com/office-template-fill)
- [Digital Signatures](https://showcase.apryse.com/digital-signatures)
- [PDF Text Editing](https://showcase.apryse.com/pdf-editing)
- [Page Manipulation](https://showcase.apryse.com/pdf-page-manipulation-api)
- [Redaction](https://showcase.apryse.com/redaction)
- [Form Building](https://showcase.apryse.com/pdf-form-build)
- [Annotate Videos](https://showcase.apryse.com/annotate-video-frames)
- [More](https://showcase.apryse.com/)

## Trial

You can obtain the trial key by signing-up on our [developer portal](https://dev.apryse.com/).


## Initial setup

Before you begin, make sure your development environment includes [Node.js](https://nodejs.org/en/).

This sample requires Node version 20. To check your version, run `node -v` in a terminal/console window.

In order to set the license key, you will need to set the string in the WebViewer sample. One such way is by passing it into the constructor of the WebViewer: https://docs.apryse.com/documentation/web/faq/add-license/#passing-into-constructor

Follow the steps below to set the license key in this sample:

- Locate the app.component.ts file at /src/app.js
- Replace "your_license_key" with your license
- Save the file


## Install

```
git clone https://github.com/ApryseSDK/webviewer-react-sample.git
cd webviewer-react-sample
npm install
```

## Run

```
npm start
```

After the app starts, you will be able to see WebViewer running on `localhost:3000`.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `build/` directory. See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

To test the build directory locally you can use [serve](https://www.npmjs.com/package/serve) or [http-server](https://www.npmjs.com/package/http-server). In case of serve, by default it strips the .html extension stripped from paths. We added serve.json configuration to disable cleanUrls option.

## GitHub Pages
You can deploy your app to [GitHub Pages](https://pdftron.github.io/webviewer-react-sample/). To do so, make sure to update paths accordingly, for example, to deploy on `pdftron.github.io/webviewer-react-sample`, modify the `path`:

```
WebViewer(
 {
   path: '/webviewer-react-sample/webviewer/lib',
   initialDoc: '/webviewer-react-sample/files/PDFTRON_about.pdf',
 },
 viewer.current,
).then((instance) => {
```

## WebViewer APIs

See [API documentation](https://docs.apryse.com/api/web/WebViewerInstance.html).

## Contributing

See [contributing](./CONTRIBUTING.md).

## License

See [license](./LICENSE).
![](https://onepixel.pdftron.com/webviewer-react-sample)
