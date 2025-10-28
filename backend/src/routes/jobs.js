const express = require('express');
const router = express.Router();
const OCRJob = require('../models/OCRJob');
const Document = require('../models/Document');
const { optionalAuth } = require('../utils/jwtMiddleware');

// Get job status by document ID
router.get('/document/:documentId', optionalAuth, async (req, res) => {
  try {
    const { documentId } = req.params;
    const job = await OCRJob.findOne({ document: documentId }).populate('document');
    
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

// Get all jobs (with pagination)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, size = 20, status } = req.query;
    const filter = {};
    if (status) filter.status = status;

    const jobs = await OCRJob.find(filter)
      .populate('document')
      .sort({ createdAt: -1 })
      .skip((page - 1) * size)
      .limit(Number(size))
      .lean();

    const total = await OCRJob.countDocuments(filter);

    res.json({ jobs, total, page: Number(page), size: Number(size) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Cancel a job (mark as cancelled)
router.post('/:jobId/cancel', optionalAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await OCRJob.findByIdAndUpdate(
      jobId,
      { status: 'cancelled', updatedAt: new Date() },
      { new: true }
    );

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json({ ok: true, job });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to cancel job' });
  }
});

// Retry a failed job
router.post('/:jobId/retry', optionalAuth, async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await OCRJob.findById(jobId).populate('document');

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (job.status !== 'failed') {
      return res.status(400).json({ error: 'Only failed jobs can be retried' });
    }

    // Reset job and document status
    await OCRJob.findByIdAndUpdate(jobId, {
      status: 'queued',
      progress: 0,
      error: null,
      updatedAt: new Date()
    });

    await Document.findByIdAndUpdate(job.document._id, {
      ocrState: 'queued'
    });

    // Re-add to queue
    const { ocrQueue } = require('../queue');
    await ocrQueue.add('process-document', {
      documentId: job.document._id.toString(),
      filepath: job.document.filename,
      languages: 'eng'
    });

    res.json({ ok: true, message: 'Job requeued' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retry job' });
  }
});

module.exports = router;
