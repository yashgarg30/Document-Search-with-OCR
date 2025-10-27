const Document = require('../models/Document');
const OCRJob = require('../models/OCRJob');
const hashFile = require('../utils/hashFile');
const { ocrQueue } = require('../queue');
const fs = require('fs');
const path = require('path');
const { getIo } = require('../utils/socket');

async function handleUpload(req, res) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file' });
    const { path: filepath, originalname, mimetype, size } = req.file;
    const fileHash = await hashFile(filepath);
    // duplicate detection
    const existing = await Document.findOne({ fileHash });
    if (existing) {
      // optionally remove new file
      fs.unlinkSync(filepath);
      return res.json({ duplicated: true, documentId: existing._id });
    }
    const doc = await Document.create({
      title: originalname,
      filename: filepath,
      mimetype,
      size,
      fileHash,
      ocrState: 'queued'
    });

    // create job document
    const jobDoc = await OCRJob.create({ document: doc._id });

    // push to queue with language default and preprocess options
    const job = await ocrQueue.add('process-document', {
      documentId: doc._id.toString(),
      filepath,
      languages: req.body.languages || 'eng',
      preprocess: req.body.preprocess || { deskew:false }
    }, { removeOnComplete: true, attempts: 3 });

    return res.json({ ok: true, documentId: doc._id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'upload failed' });
  }
}

module.exports = { handleUpload };
