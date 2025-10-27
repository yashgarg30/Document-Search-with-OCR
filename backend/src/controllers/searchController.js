const Document = require('../models/Document');
const mongoose = require('mongoose');

// search query supports phrase, prefix, filters, pagination
async function search(req, res) {
  const { q, page=1, size=10, tags, fromDate, toDate } = req.query;

  const filter = {};
  if (tags) filter.tags = { $in: tags.split(',') };
  if (fromDate || toDate) {
    filter.uploadedAt = {};
    if (fromDate) filter.uploadedAt.$gte = new Date(fromDate);
    if (toDate) filter.uploadedAt.$lte = new Date(toDate);
  }

  // For better relevance, use Atlas Search; fall back to text index
  if (q) {
    // Basic: text search across pages.text and title
    filter.$text = { $search: q };
    const projection = { score: { $meta: 'textScore' } };
    const docs = await Document.find(filter, projection)
      .sort({ score: { $meta: 'textScore' } })
      .skip((page-1)*size)
      .limit(Number(size))
      .lean();
    // highlight snippet: naive approach
    const results = docs.map(d => {
      // find first page with q
      let snippet = '';
      let pageNum = 1;
      for (const p of (d.pages||[])) {
        if (p.text && p.text.toLowerCase().includes(q.toLowerCase())) {
          const idx = p.text.toLowerCase().indexOf(q.toLowerCase());
          const start = Math.max(0, idx - 60);
          snippet = p.text.substr(start, 200);
          pageNum = p.pageNumber;
          break;
        }
      }
      return { document: d, snippet, pageNum };
    });
    return res.json({ results });
  } else {
    // no query: list documents with filters
    const docs = await Document.find(filter).skip((page-1)*size).limit(Number(size)).lean();
    return res.json({ results: docs.map(d=>({ document: d, snippet: '', pageNum: 1 })) });
  }
}

module.exports = { search };
