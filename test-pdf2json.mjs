import fs from 'fs';
import PDFParser from 'pdf2json';

const parsePDF = (buffer) => {
  return new Promise((resolve, reject) => {
    const pdfParser = new PDFParser(this, 1);
    pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError));
    pdfParser.on("pdfParser_dataReady", pdfData => {
      resolve(pdfParser.getRawTextContent());
    });
    pdfParser.parseBuffer(buffer);
  });
};

(async () => {
  const buffer = fs.readFileSync('test_incident.pdf');
  try {
    const text = await parsePDF(buffer);
    console.log("TEXT EXTRACTED:\n", text.substring(0, 500));
  } catch (e) {
    console.error("ERROR:", e);
  }
})();
