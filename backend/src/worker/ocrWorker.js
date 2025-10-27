const { Worker } = require('bullmq');
const { connection } = require('../queue');
const Tesseract = require('tesseract.js');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const Document = require('../models/Document');
const OCRJob = require('../models/OCRJob');
const config = require('../config');
const { getIo } = require('../utils/socket');
const { spawn } = require('child_process'); // for poppler/pdfimages if available

// helper to extract pages from PDF -> images using pdftoppm (poppler)
async function pdfToImages(pdfPath, outDir) {
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    // require pdftoppm in container
    const outPrefix = path.join(outDir, 'page');
    const cmd = 'pdftoppm';
    const args = ['-png', pdfPath, outPrefix];
    const p = spawn(cmd, args);
    p.on('close', code => {
      if (code === 0) {
        // collect pngs
        const files = fs.readdirSync(outDir)
          .filter(f => f.endsWith('.png'))
          .map(f => path.join(outDir, f))
          .sort();
        resolve(files);
      } else {
        reject(new Error('pdftoppm failed code ' + code));
      }
    });
    p.on('error', reject);
  });
}

// parse TSV line from tesseract to words and bboxes
function parseTSV(tsv) {
  const lines = tsv.trim().split('\n');
  const headers = lines.shift().split('\t');
  const rows = lines.map(l => {
    const parts = l.split('\t');
    const obj = {};
    headers.forEach((h,i) => obj[h] = parts[i]);
    return obj;
  });
  // only words level (level == 5)
  const words = rows.filter(r => r.level === '5').map(r => ({
    text: r.text || '',
    bbox: { x0: Number(r.left), y0: Number(r.top), x1: Number(r.left) + Number(r.width), y1: Number(r.top) + Number(r.height) },
    conf: Number(r.conf)
  }));
  const avgConf = words.length ? (words.reduce((s,w)=>s+w.conf,0)/words.length) : 0;
  const fullText = rows.filter(r => r.level === '1').map(r => r.text).join('\n') || '';
  return { words, avgConf, fullText };
}

const worker = new Worker('ocr', async job => {
  const { documentId, filepath, languages='eng', preprocess={} } = job.data;
  const io = getIo();
  const jobDoc = await OCRJob.findOne({ document: documentId });
  await OCRJob.findByIdAndUpdate(jobDoc._id, { status: 'processing', updatedAt: new Date() });

  try {
    let pageImages = [];
    if (filepath.toLowerCase().endsWith('.pdf')) {
      const outDir = path.join(path.dirname(filepath), `pages-${Date.now()}`);
      pageImages = await pdfToImages(filepath, outDir);
    } else {
      // treat as single image or multipage TIFF — for simplicity, single
      pageImages = [filepath];
    }

    const doc = await Document.findById(documentId);
    doc.ocrState = 'processing';
    doc.pages = []; // reset pages
    await doc.save();

    for (let i = 0; i < pageImages.length; i++) {
      const img = pageImages[i];
      const pageNumber = i + 1;
      // emit progress via socket
      if (io) io.to(documentId).emit('ocr:progress', { page: pageNumber, total: pageImages.length });

      // preprocessing with sharp (deskew is not implemented here; placeholder)
      let buffer = fs.readFileSync(img);
      let image = sharp(buffer);

      // optional operations
      if (preprocess.resize) image = image.resize(preprocess.resize.width, preprocess.resize.height, { fit: 'inside' });
      if (preprocess.binarize) {
        image = image.threshold(128);
      }
      // produce PNG buffer
      const processed = await image.png().toBuffer();

      // run Tesseract
      const workerResult = await Tesseract.recognize(processed, languages, {
        logger: m => {
          // m.progress is per step; we can emit partial progress if desired
          if (io) io.to(documentId).emit('ocr:log', { page: pageNumber, msg: m });
        }
      });

      // get TSV for positions
      const tsv = await workerResult.getTsv();
      const { words, avgConf } = parseTSV(tsv);
      const text = workerResult.data.text || words.map(w=>w.text).join(' ');

      // mark low-quality
      const lowQuality = avgConf < 70;

      doc.pages.push({
        pageNumber,
        text,
        words,
        confidence: avgConf,
        processedAt: new Date(),
      });
      await doc.save();

      // emit per-page completion
      if (io) io.to(documentId).emit('ocr:pageDone', { page: pageNumber, confidence: avgConf, lowQuality });

      // update job progress
      const progress = Math.round(((i+1)/pageImages.length) * 100);
      await OCRJob.findByIdAndUpdate(jobDoc._id, { progress, updatedAt: new Date() });
    }

    doc.ocrState = 'done';
    await doc.save();
    await OCRJob.findByIdAndUpdate(jobDoc._id, { status: 'done', progress: 100, updatedAt: new Date() });

    if (io) io.to(documentId).emit('ocr:done', { documentId });
    return { done: true };
  } catch (err) {
    console.error('worker error', err);
    await OCRJob.findByIdAndUpdate(jobDoc._id, { status: 'failed', error: err.message, updatedAt: new Date() });
    await Document.findByIdAndUpdate(documentId, { ocrState: 'failed' });
    const io = getIo();
    if (io) io.to(documentId).emit('ocr:error', { error: err.message });
    throw err;
  }
}, { connection, concurrency: config.WORKER_CONCURRENCY });

worker.on('failed', (job, err) => {
  console.error('job failed', job.id, err);
});
