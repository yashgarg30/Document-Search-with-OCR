const mongoose = require('mongoose');
const { Schema } = mongoose;

const OCRJobSchema = new Schema({
  document: { type: Schema.Types.ObjectId, ref: 'Document' },
  status: { type: String, enum: ['queued','processing','done','failed','cancelled'], default: 'queued' },
  progress: { type: Number, default: 0 },
  error: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

module.exports = mongoose.model('OCRJob', OCRJobSchema);
