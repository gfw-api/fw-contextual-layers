const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Layer = new Schema({
  isPublic: { type: Boolean, required: true, default: false },
  name: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  user: { type: String, required: true, trim: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Layer', Layer);