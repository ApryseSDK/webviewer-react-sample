import React, { useRef, useEffect, useState } from 'react';
import WebViewer, { Core } from '@pdftron/webviewer';
import { saveAs } from 'file-saver'
import SignaturePad from 'react-signature-canvas'
import styles from './App.css';
import { Button, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [sigData, setSigData] = useState('')
  const [show, setShow] = useState(false);
  const [docViewerIns, setdocViewerIns] = useState();
  const [pdfnetIns, setPdfnetIns] = useState();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const viewer = useRef(null);
  const sigRef = useRef(null)


  useEffect(() => {
    WebViewer(
      {
        path: '/webviewer/lib',
        initialDoc: '/files/pdf-new.pdf',
        fullAPI: true,
      },
      viewer.current,
    ).then(async (instance) => {
      const { documentViewer, annotationManager, Annotations, PDFNet, SaveOptions } = instance.Core;
      instance.UI.setHeaderItems(header => {
        header.push({
          type: 'actionButton',
          img: 'data:image/png;base64,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',
          onClick: async () => {
            // const doc = await documentViewer.getDocument()
            // console.log("DOC _____", doc);
            // const xfdfString = await annotationManager.exportAnnotations()
            // const data = await doc.getFileData({
            //   xfdfString,
            //   flags: SaveOptions.LINEARIZED,
            //   downloadType: 'pdf'
            // })
            // console.log("DATA _____", data);
            // const arr = new Uint8Array(data)
            // console.log("arr   ----->", arr)
            // const blob = new Blob([arr], {
            //   type: 'application/pdf'
            // })
            // console.log("blob   ----->", blob)
            // saveAs(blob, 'updated.pdf')

            const mainFunc = async () => {
              try {
                console.log("IN MAIN");
                const newDoc = await documentViewer.getDocument()
                // newDoc.initSecurityHandler();
                // newDoc.lock();
                const builder = await PDFNet.ElementBuilder.create(); // ElementBuilder, used to build new element Objects
                // create a new page writer that allows us to add/change page elements
                const writer = await PDFNet.ElementWriter.create(); // ElementWriter, used to write elements to the page
                // // define new page dimensions
                const pageRect = await PDFNet.Rect.init(0, 0, 612, 794);
                // let page = await PDFNet.create(pageRect);

                await writer.beginOnPage(await (await newDoc.getPDFDoc()).getPage(1), PDFNet.ElementWriter.WriteMode.e_overlay);
                console.log("JUST BEFOR IMG ");

                let signImg = await localStorage.getItem("signImg")
                let img = await PDFNet.Image.createFromURL(await newDoc.getPDFDoc(), signImg);
                // let matrix = await PDFNet.Matrix2D.create(200, 0, 0, 250, 50, 500);
                // const matrix2 = await PDFNet.Matrix2D.createZeroMatrix();
                // await matrix2.set(200, 0, 0, 250, 50, 500);


                // getting search item from storage
                let searchTerm = await localStorage.getItem("field");
                const pageNumber = 1; // page to parse
                const pageText = await newDoc.loadPageText(pageNumber);
                let startIndex = 0;
                let endIndex = 0;

                startIndex = pageText.indexOf(searchTerm);
                console.log("Start index            ->        ", startIndex)
                if (startIndex >= 0) {


                  endIndex = startIndex + searchTerm.length;

                  // Get text position for each letter in the 'searchTerm' found
                  // 'quads' will contain an array for each character between the start and end indexes
                  const quads = await newDoc.getTextPosition(pageNumber, endIndex, endIndex + 1);
                  console.log("COODS: ---->", quads)

                  let pageHeight =  await documentViewer.getPageHeight(1)
                  console.log("PAGE Height: ---->", pageHeight)

                  
                  let element = await builder.createImageScaled(img, quads[0].x2 + 50, pageHeight  - quads[0].y2 - 50, 100, 100);
                  console.log(img, element);
                  writer.writePlacedElement(element);
                  console.log("END");
                  console.log(element);

                  writer.end();

                  // add the page to the document

                  let newPdfDoc = await newDoc.getPDFDoc()
                  if (newPdfDoc) {
                    let newPdfDocPage = await newPdfDoc.getPage(1)
                    if (newPdfDocPage) {
                      try {
                        newPdfDoc.pagePushBack(newPdfDocPage);


                        // save sign in local 
                        let signs = localStorage.getItem("signs")
                        if (signs) {
                          signs = JSON.parse(signs)
                          signs[searchTerm] = signImg
                          localStorage.setItem("signs", JSON.stringify(signs))
                        }
                        else {

                          let signingTerm = {}
                          signingTerm[searchTerm] = signImg
                          localStorage.setItem("signs", JSON.stringify(signingTerm))
                        }

                      } catch (error) {
                        console.log("ERROR IN PUSSHING BACK");
                        console.log(error);
                      }
                    } else {
                      console.log("newPdfDocPage");
                    }
                  } else {
                    console.log("newPdfDoc");
                  }



                  // Update viewer with new document
                  documentViewer.refreshAll();
                  documentViewer.updateView();




                // saving PDF 
                // const docbuf = await newPdfDoc.saveMemoryBuffer(PDFNet.SDFDoc.SaveOptions.e_linearized);
                // const blob = new Blob([docbuf], {
                //   type: 'application/pdf'
                // })
                // console.log("blob   ----->", blob)
                // saveAs(blob, 'updated.pdf',)





                // (docbuf, 'addimage.pdf');

                console.log('Done. Result saved in addimage.pdf...');


                }













                // const doc = await documentViewer.getDocument()
                // console.log("DOC _____", doc);
                // const xfdfString = await annotationManager.exportAnnotations()
                // const data = await doc.getFileData({
                //   xfdfString,
                //   flags: SaveOptions.LINEARIZED,
                //   downloadType: 'pdf'
                // })
                // console.log("DATA _____", data);
                // const arr = new Uint8Array(data)
                // console.log("arr   ----->", arr)
                // const blob = new Blob([arr], {
                //   type: 'application/pdf'
                // })
                // console.log("blob   ----->", blob)
                // saveAs(blob, 'updated.pdf')





                // For PNG
                // let img = await PDFNet.Image.createFromURL(newDoc, './assets/ss.png');
                // console.log("IMG PATH --> ", img)
                // let matrix = await PDFNet.Matrix2D.create(await img.getImageWidth(), 0, 0, await img.getImageHeight(), 300, 500);
                // console.log("after matrix")
                // let element = await builder.createImageFromMatrix(img, matrix);
                // writer.writePlacedElement(element)



              } catch (error) {
                console.log(error)
              }

            }
            PDFNet.runWithCleanup(mainFunc)
          }
        })
        header.push({
          type: 'actionButton',
          img: 'data:image/png;base64,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',
          onClick: async () => {
            async function main() {
              const newDoc = await documentViewer.getDocument()
              const doc = await newDoc.getPDFDoc()
              const page = await doc.getPage(1);
    
              const txt = await PDFNet.TextExtractor.create();
              const rect = await page.getCropBox();
              txt.begin(page, rect); // Read the page.
    
    
    
              let parsedData = {}
    
              // Extract words one by one.
              let line = await txt.getFirstLine();
    
    
              let docTitle = ''
              // extracting title 
              for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                docTitle += await word.getString() + " "
              }
              // parsedData.push({
              //   title: docTitle
              // })
              parsedData.title = docTitle
    
    
    
              line = await line.getNextLine()
    
    
    
              let key = ''
              let value = ''
    
    
              for (; (await line.isValid()); line = (await line.getNextLine())) {
                // console.log("in loop");
                // first word stats 
                let word = await line.getFirstWord();
                let wordStyle = await word.getStyle();
                let wordSize = await wordStyle.getFontSize()
                wordSize = parseInt(wordSize)
    
                // console.log(wordSize);
                // console.log(await wordStyle.getWeight());
    
                // next first word stats
                let nextFirstLine = await line.getNextLine()
    
                if (await nextFirstLine.isValid()) {
    
                  let nextFirstWord = await nextFirstLine.getFirstWord();
                  let nextFirstWordStyle = await nextFirstWord.getStyle();
                  let nextFirstWordSize = await nextFirstWordStyle.getFontSize()
                  nextFirstWordSize = parseInt(nextFirstWordSize)
    
    
                  // console.log(nextFirstWordSize);
                  // console.log(await wordStyle.getWeight());
    
                  if (wordSize == 12) {
                    for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                      // console.log("key");
                      key += await word.getString() + " "
                    }
                  }
                  else if (wordSize != 12 && nextFirstWordSize != 12) {
                    for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                      // console.log("value");
                      value += await word.getString() + " "
                    }
                  }
                  else if (wordSize != 12 && nextFirstWordSize == 12) {
                    // console.log("summing up");
                    for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                      value += await word.getString() + " "
                    }
                    let parsedInfo = {}
                    key = key.replace(":", '')
                    key = key.trim()
                    // if we want array of objects 
                    // parsedInfo[key] = value
                    // parsedData.push(parsedInfo)
                    
                    parsedData[key] = value
                    key = ''
                    value = ''
                  }
                }
                else {
                  // console.log("summing up");
                  for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                    value += await word.getString() + " "
                  }
                  let parsedInfo = {}
                  key = key.replace(":", '')
                  key = key.trim()
                  // if we want array of objects 
                  // parsedInfo[key] = value
                  // parsedData.push(parsedInfo)

                  parsedData[key] = value
                  key = ''
                  value = ''
                }
    
    
                // let word = await line.getFirstWord();
                // console.log(await word.getString())
                // const wordStyle = await word.getStyle()
                // // wordStyle.getWeight()
                // console.log(parseInt(await wordStyle.getFontSize()));
                // console.log(parseInt(await wordStyle.getWeight()));
                // for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) 
                // {
    
                //     console.log(await word.getString())
                //     const wordStyle = await word.getStyle()
                //     // wordStyle.getWeight()
                //     console.log(parseInt(await wordStyle.getFontSize()));
                //     console.log(parseInt(await wordStyle.getWeight()));
                //     console.log(parseInt(await wordStyle.getWeight()));
                //     console.log(parseInt(await wordStyle.getWeight()));
                //     console.log(parseInt(await wordStyle.getWeight()));
                // }
    
              }
              

              // add signatures in parsed data  


              let signs = localStorage.getItem("signs")
              let parsedDataNew;
              if (signs) {
                signs = JSON.parse(signs)
                parsedData ={...parsedData, ...signs}
              }
              console.log("parsedData")
              console.log(parsedData)
              console.log(parsedData["Desired Outcome"]);

              // localStorage.clear()
    
    
    
            }
            PDFNet.runWithCleanup(main);
    
          }})
      })



      documentViewer.addEventListener('documentLoaded', async () => {

        // linearizing a document 
        // const newDoc = await documentViewer.getDocument()
        // let newPdfDoc = await newDoc.getPDFDoc()
        // const docbuf = await newPdfDoc.saveMemoryBuffer(PDFNet.SDFDoc.SaveOptions.e_linearized);
        // const blob = new Blob([docbuf], {
        //   type: 'application/pdf'
        // })
        // console.log("blob   ----->", blob)
        // saveAs(blob, 'updated.pdf',)


        // await PDFNet.endDeallocateStack();
        // return


        async function main() {
          const newDoc = await documentViewer.getDocument()
          const doc = await newDoc.getPDFDoc()
          const page = await doc.getPage(1);

          const txt = await PDFNet.TextExtractor.create();
          const rect = await page.getCropBox();
          txt.begin(page, rect); // Read the page.



          let parsedData = []

          // Extract words one by one.
          let line = await txt.getFirstLine();


          let docTitle = ''
          // extracting title 
          for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
            docTitle += await word.getString() + " "
          }
          parsedData.push({
            title: docTitle
          })




          line = await line.getNextLine()



          let key = ''
          let value = ''


          for (; (await line.isValid()); line = (await line.getNextLine())) {
            // console.log("in loop");
            // first word stats 
            let word = await line.getFirstWord();
            let wordStyle = await word.getStyle();
            let wordSize = await wordStyle.getFontSize()
            wordSize = parseInt(wordSize)

            // console.log(wordSize);
            // console.log(await wordStyle.getWeight());

            // next first word stats
            let nextFirstLine = await line.getNextLine()

            if (await nextFirstLine.isValid()) {

              let nextFirstWord = await nextFirstLine.getFirstWord();
              let nextFirstWordStyle = await nextFirstWord.getStyle();
              let nextFirstWordSize = await nextFirstWordStyle.getFontSize()
              nextFirstWordSize = parseInt(nextFirstWordSize)


              // console.log(nextFirstWordSize);
              // console.log(await wordStyle.getWeight());

              if (wordSize == 12) {
                for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                  // console.log("key");
                  key += await word.getString() + " "
                }
              }
              else if (wordSize != 12 && nextFirstWordSize != 12) {
                for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                  // console.log("value");
                  value += await word.getString() + " "
                }
              }
              else if (wordSize != 12 && nextFirstWordSize == 12) {
                // console.log("summing up");
                for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                  value += await word.getString() + " "
                }
                let parsedInfo = {}
                key = key.replace(":", '')
                parsedInfo[key] = value
                parsedData.push(parsedInfo)
                key = ''
                value = ''
              }
            }
            else {
              // console.log("summing up");
              for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) {
                value += await word.getString() + " "
              }
              let parsedInfo = {}
              key = key.replace(":", '')
              parsedInfo[key] = value
              parsedData.push(parsedInfo)
              key = ''
              value = ''
            }


            // let word = await line.getFirstWord();
            // console.log(await word.getString())
            // const wordStyle = await word.getStyle()
            // // wordStyle.getWeight()
            // console.log(parseInt(await wordStyle.getFontSize()));
            // console.log(parseInt(await wordStyle.getWeight()));
            // for (let word = await line.getFirstWord(); (await word.isValid()); word = (await word.getNextWord())) 
            // {

            //     console.log(await word.getString())
            //     const wordStyle = await word.getStyle()
            //     // wordStyle.getWeight()
            //     console.log(parseInt(await wordStyle.getFontSize()));
            //     console.log(parseInt(await wordStyle.getWeight()));
            //     console.log(parseInt(await wordStyle.getWeight()));
            //     console.log(parseInt(await wordStyle.getWeight()));
            //     console.log(parseInt(await wordStyle.getWeight()));
            // }

          }

          console.log("parsedData")
          console.log(parsedData)



        }
        // PDFNet.runWithCleanup(main);


      });
    }).catch(err => console.log(err))
  }, []);


  const saveSigData = (bsString) => {
    console.log(bsString)
    setSigData(bsString)
    localStorage.setItem("signImg", bsString)

    handleClose()
    // fetch(bsString)
    //   .then(async (res) => {
    //     let blobData = await res.blob();
    //     saveAs(blobData, 'sig.jpg')

    //   })
    //   .then(console.log)
  }


  return (
    <div className="App">
      <div className="header">React sample</div>
      <Button variant="primary" onClick={handleShow}>
        Add Signature
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input onChange={e => localStorage.setItem("field", e.target.value)} style={{
            width: "100%"
          }} />

          <div style={{
            display: 'contents',
            alignItems: 'center',
            width: "100%"
          }}>
            <div style={
              {
                border: '2px solid red',
                width: "100%", height: 100,
                alignSelf: 'center',
                marginTop: 10,
                marginBottom: 10,
              }
            }>
              <SignaturePad
                penColor='green'
                canvasProps={{ width: 440, height: 100, className: 'sigCanvas' }}
                ref={sigRef}
              />

            </div>
          </div>
          <Button variant="primary" onClick={async () => saveSigData(await sigRef.current.toDataURL('base64string'))}>Add Signature</Button>
        </Modal.Body>
      </Modal>
      {/* <Button variant="primary" onClick={() => {
        docViewerIns.refreshAll();
        docViewerIns.updateView();

      }}>
        Update View
      </Button> */}
      <div className="webviewer" ref={viewer}></div>

    </div>
  );
};

export default App;
