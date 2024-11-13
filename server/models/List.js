const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  destinations: [{ name: String, details: String }],
  visibility: { type: String, enum: ['public', 'private'], default: 'private' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  lastModified: { type: Date, default: Date.now }
});

module.exports = mongoose.model('List', listSchema);
