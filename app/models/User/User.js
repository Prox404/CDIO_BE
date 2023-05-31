const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    fullname: { type: String, default: 'User' },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, unique: true },
    address: { type: String},
    role: { type: String, default: 'user' }
}, {
    timestamps: true,
});

module.exports = mongoose.model('User', UserSchema);
