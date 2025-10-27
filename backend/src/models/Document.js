const mongoose = require('mongoose');
const { Schema } = mongoose;

const WordSchema = new Schema({
  text: String,
  bbox: { x0: Number, y0: Number, x1: Number, y1: Number },
  conf: Number
}, { _id: false });

const PageSchema = new Schema({
  pageNumber: Number,
  text: String,
  words: [WordSchema],
  confidence: Number,
  width: Number,
  height: Number,
  processedAt: Date,
  lowQuality: { type: Boolean, default: false }
});

const DocumentSchema = new Schema({
  title: String,
  filename: String,
  mimetype: String,
  size: Number,
  uploader: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: [String],
  uploadedAt: { type: Date, default: Date.now },
  fileHash: String,
  pages: [PageSchema],
  ocrState: { type: String, enum: ['queued','processing','done','failed'], default: 'queued' },
  metadata: Schema.Types.Mixed
});

DocumentSchema.index({ 'pages.text': 'text', title: 'text', tags: 'text' });

module.exports = mongoose.model('Document', DocumentSchema);
