const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const OrderSchema = new Schema({
    user: {type: Schema.Types.ObjectId,ref: 'User', required: true},
    product: {type: [new Schema({
        product: { type: Schema.Types.ObjectId,ref: 'Product', required: true },
        quantity: { type: Number, required: true },
        currentPrice: { type: Number, required: true },
    })], required: true},
    status: { type: Number, required: true},
    address: { type: String, required: true},
    phone: { type: Number, required: true},
    total: { type: Number, required: true},
    note: { type: String, required: true},
    orderDate: { type: Date, required: true},
}, {
    timestamps: true,
});

module.exports = mongoose.model('Order', OrderSchema);
