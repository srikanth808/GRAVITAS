import fs from 'fs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// Polyfills
global.DOMMatrix = class DOMMatrix {};
global.ImageData = class ImageData {};
global.Path2D = class Path2D {};

const { PDFParse } = require('pdf-parse');

(async () => {
  const buffer = fs.readFileSync('test_incident.pdf');
  try {
    const parser = new PDFParse({ data: buffer });
    const pdfData = await parser.getText();
    console.log("TEXT EXTRACTED:\n", pdfData.text.substring(0, 500));
    await parser.destroy();
  } catch (e) {
    console.error("ERROR:", e);
  }
})();
