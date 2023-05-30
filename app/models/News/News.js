const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const NewsSchema = new Schema({
    Title: { type: String, required: true},
    Content: { type: String, required: true},
    PulisherDate: { type: Date, required: true},
    ThumbImage: { type: String, required: true},
}, {
    timestamps: true,
});

module.exports = mongoose.model('News', NewsSchema);