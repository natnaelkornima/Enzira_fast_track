const mongoose = require('mongoose');
require('dotenv').config();

// Using local MongoDB by default if no URI is provided in .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/begena_registration';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB successfully connected.');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;
