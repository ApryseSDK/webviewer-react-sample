export const runBookmarkTest = () => {
    const PDFNet = exports.Core.PDFNet;

    const addIndent = async (item, str) => {
      const ident = (await item.getIndent()) - 1;
      for (let i = 0; i < ident; ++i) {
        str += '  ';
        // note: must manually set IndentString to empty after this function is called.
      }
      return str;
    };

    const printOutlineTree = async item => {
      for (; item != null; item = await item.getNext()) {
        let IndentString = '';
        let ActionString = '';
        let TitleString = '';

        IndentString = await addIndent(item, IndentString);
        TitleString = await item.getTitle();

        ActionString = (IndentString + (await item.isOpen()) ? '- ' : '+ ') + TitleString + ' ACTION -> ';

        const action = await item.getAction();
        if (await action.isValid()) {
          const actionType = await action.getType();
          if (actionType === PDFNet.Action.Type.e_GoTo) {
            const dest = await action.getDest();
            if (await dest.isValid()) {
              const page = await dest.getPage();
              console.log(ActionString + 'GoTo Page # ' + (await page.getIndex()));
            }
          } else {
            console.log(ActionString + 'Not a "GoTo" action');
          }
        } else {
          console.log(ActionString + 'NULL');
        }

        if (await item.hasChildren()) {
          await printOutlineTree(await item.getFirstChild());
        }
      }
    };

    const main = async () => {
      const ret = 0;

      // Relative path to the folder containing test files.
      const inputPath = '../TestFiles/';

      // The following example illustrates how to create and edit the outline tree
      // using high-level Bookmark methods.

      let doc = await PDFNet.PDFDoc.createFromURL(inputPath + 'numbered.pdf');
      doc.initSecurityHandler();
      doc.lock();

      // Lets first create the root bookmark items.
      const red = await PDFNet.Bookmark.create(doc, 'Red');
      const green = await PDFNet.Bookmark.create(doc, 'Green');
      const blue = await PDFNet.Bookmark.create(doc, 'Blue');

      doc.addRootBookmark(red);
      doc.addRootBookmark(green);
      doc.addRootBookmark(blue);

      // You can also add new root bookmarks using Bookmark.addNext("...")
      blue.addNewNext('foo');
      blue.addNewNext('bar');

      // We can now associate new bookmarks with page destinations:

      // The following example creates an 'explicit' destination (see
      // section '8.2.1 Destinations' in PDF Reference for more details)

      const redIter = await doc.getPageIterator(1);

      const redCurrpage = await redIter.current();
      // eslint-disable-next-line no-unused-vars
      const redCurrpageActual = await doc.getPage(1);
      const redDest = await PDFNet.Destination.createFit(redCurrpage);
      red.setAction(await PDFNet.Action.createGoto(redDest));

      // Create an explicit destination to the first green page in the document
      const tenthPage = await doc.getPage(10);
      const greenDest = await PDFNet.Destination.createFit(tenthPage);
      green.setAction(await PDFNet.Action.createGoto(greenDest));

      // The following example creates a 'named' destination (see
      // section '8.2.1 Destinations' in PDF Reference for more details)
      // Named destinations have certain advantages over explicit destinations.
      const key = 'blue1';
      const nineteenthPage = await doc.getPage(19);
      const blueDest = await PDFNet.Destination.createFit(nineteenthPage);
      const blueAction = await PDFNet.Action.createGotoWithKey(key, blueDest); // TODO FIND FIX

      blue.setAction(blueAction);

      // We can now add children Bookmarks subRed1 instanceof Promise
      const subRed1 = await red.addNewChild('Red - Page 1');
      subRed1.setAction(await PDFNet.Action.createGoto(await PDFNet.Destination.createFit(await doc.getPage(1))));
      const subRed2 = await red.addNewChild('Red - Page 2');
      subRed2.setAction(await PDFNet.Action.createGoto(await PDFNet.Destination.createFit(await doc.getPage(2))));
      const subRed3 = await red.addNewChild('Red - Page 3');
      subRed3.setAction(await PDFNet.Action.createGoto(await PDFNet.Destination.createFit(await doc.getPage(3))));
      const subRed4 = await subRed3.addNewChild('Red - Page 4');
      subRed4.setAction(await PDFNet.Action.createGoto(await PDFNet.Destination.createFit(await doc.getPage(4))));
      const subRed5 = await subRed3.addNewChild('Red - Page 5');
      subRed5.setAction(await PDFNet.Action.createGoto(await PDFNet.Destination.createFit(await doc.getPage(5))));
      const subRed6 = await subRed3.addNewChild('Red - Page 6');
      subRed6.setAction(await PDFNet.Action.createGoto(await PDFNet.Destination.createFit(await doc.getPage(6))));

      // Example of how to find and delete a bookmark by title text.
      const firstbookmark = await doc.getFirstBookmark();
      const foo = await firstbookmark.find('foo');
      if (await foo.isValid()) {
        foo.delete();
      } else {
        console.log('Bookmark foo is invalid');
      }
      const bar = await firstbookmark.find('bar');
      if (await bar.isValid()) {
        bar.delete();
      } else {
        console.log('Bookmark bar is invalid');
      }

      // Adding color to Bookmarks. Color and other formatting can help readers
      // get around more easily in large PDF documents.
      red.setColor(1, 0, 0);
      green.setColor(0, 1, 0);
      green.setFlags(2); // set bold font
      blue.setColor(0, 0, 1);
      blue.setFlags(3); // set bold and italic

      const bookmarkBuffer = await doc.saveMemoryBuffer(0);
      // saveBufferAsPDFDoc(bookmarkBuffer, 'bookmark.pdf');
      console.log('Done. Result saved in bookmark.pdf');

      // The following example illustrates how to traverse the outline tree using
      // Bookmark navigation methods: Bookmark.getNext(), Bookmark.getPrev(),
      // Bookmark.getFirstChild () and Bookmark.getLastChild ().

      // Open the document that was saved in the previous code sample
      const docOut = await PDFNet.PDFDoc.createFromBuffer(bookmarkBuffer);
      docOut.initSecurityHandler();
      docOut.lock();

      const root = await docOut.getFirstBookmark();
      await printOutlineTree(root);

      console.log('Done.');

      // The following example illustrates how to create a Bookmark to a page
      // in a remote document. A remote go-to action is similar to an ordinary
      // go-to action, but jumps to a destination in another PDF file instead
      // of the current file. See Section 8.5.3 'Remote Go-To Actions' in PDF
      // Reference Manual for details.

      // Use the document from the previous sample. The sample is done this way
      // since we cannot guarantee that bookmarkBuffer is still valid since it
      // may have been sent using transfers to the worker
      doc = docOut;

      doc.initSecurityHandler();

      // Create file specification (the file referred to by the remote bookmark)
      const fileSpec = await doc.createIndirectDict();
      fileSpec.putName('Type', 'Filespec');
      fileSpec.putString('F', 'bookmark.pdf');
      const spec = await PDFNet.FileSpec.createFromObj(fileSpec);
      const gotoRemote = await PDFNet.Action.createGotoRemoteSetNewWindow(spec, 5, true);

      const remoteBookmark1 = await PDFNet.Bookmark.create(doc, 'REMOTE BOOKMARK 1');
      remoteBookmark1.setAction(gotoRemote);
      doc.addRootBookmark(remoteBookmark1);

      // Create another remote bookmark, but this time using the low-level SDF/Cos API.
      // Create a remote action
      const remoteBookmark2 = await PDFNet.Bookmark.create(doc, 'REMOTE BOOKMARK 2');
      doc.addRootBookmark(remoteBookmark2);

      const gotoR = await (await remoteBookmark2.getSDFObj()).putDict('A');
      {
        gotoR.putName('S', 'GoToR'); // Set action type
        gotoR.putBool('NewWindow', true);

        // Set the file specification
        gotoR.put('F', fileSpec);

        // jump to the first page. Note that pages are indexed from 0.
        const dest = await gotoR.putArray('D');
        dest.pushBackNumber(9);
        dest.pushBackName('Fit');
      }

      const docbuf = await doc.saveMemoryBuffer(PDFNet.SDFDoc.SaveOptions.e_remove_unused);
      // saveBufferAsPDFDoc(docbuf, 'bookmark_remote.pdf');

      console.log('Done. Result saved in bookmark_remote.pdf');
      return ret;
    };
    // add your own license key as the second parameter, e.g. PDFNet.runWithCleanup(main, 'YOUR_LICENSE_KEY')
    PDFNet.runWithCleanup(main);
  };
