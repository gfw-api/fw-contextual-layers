const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Layer = new Schema({
  public: { type: Boolean, required: true, default: false },
  name: { type: String, required: true, trim: true },
  url: { type: String, required: true, trim: true },
  user: { type: String, trim: true },
  createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Layer', Layer);