const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ProductSchema = new Schema({
    name: { type: String, required: true},
    price: { type: Number, required: true},
    quantity: { type: Number, required: true},
    description: { type: String, đefault: 'No description'},
    image: { type: [String], required: true},
    category: { type: [String], required: true},
    discount: { type: Number, default: 0},
}, {
    timestamps: true,
});

module.exports = mongoose.model('Product', ProductSchema);
