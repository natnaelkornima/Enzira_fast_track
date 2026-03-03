const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    countryCode: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true,
        trim: true
    },
    telegram: {
        type: String,
        required: true,
        trim: true
    },
    paymentReceiptPath: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'verified'],
        default: 'pending'
    },
    registrationDate: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Registration', registrationSchema);
