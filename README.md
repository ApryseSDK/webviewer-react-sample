# WebViewer - React sample

[WebViewer](https://www.pdftron.com/documentation/web/) is a powerful JavaScript-based PDF Library that's part of the [PDFTron PDF SDK](https://www.pdftron.com). It provides a slick out-of-the-box responsive UI that interacts with the core library to view, annotate and manipulate PDFs that can be embedded into any web project.

![WebViewer UI](https://www.pdftron.com/downloads/pl/webviewer-ui.png)

This repo is specifically designed for any users interested in integrating WebViewer into React project. You can watch [a video here](https://youtu.be/bVhWXuLSL0k) to help you get started.

## Demo

You can explore all of the functionality in our [showcase](https://www.pdftron.com/webviewer/demo/).

## Initial setup

Before you begin, make sure your development environment includes [Node.js](https://nodejs.org/en/).

## Install

```
git clone https://github.com/PDFTron/webviewer-react-sample.git
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

See [API documentation](https://www.pdftron.com/documentation/web/guides/ui/apis).

## Contributing

See [contributing](./CONTRIBUTING.md).

## License

See [license](./LICENSE).
![](https://onepixel.pdftron.com/webviewer-react-sample)
