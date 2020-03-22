const mongoose = require('mongoose');

const { Schema } = mongoose;

const Layer = new Schema({
    isPublic: { type: Boolean, required: true, default: false },
    name: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    description: { type: String, required: false },
    owner: {
        id: { type: Schema.Types.ObjectId, required: true, trim: true },
        type: { type: String, required: true, trim: true }
    },
    enabled: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: Date.now }
});

module.exports = mongoose.model('Layer', Layer);
