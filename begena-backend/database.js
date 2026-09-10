const mongoose = require('mongoose');
require('dotenv').config();

// Using local MongoDB by default if no URI is provided in .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/begena_registration';

const connectDB = async () => {
    try {
        mongoose.set('bufferCommands', false);
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB successfully connected.');
    } catch (err) {
        console.warn('MongoDB not connected — using fallback:', err.message);
    }
};

module.exports = connectDB;
