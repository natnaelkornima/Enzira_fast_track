const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connectDB = require('./database');
const Registration = require('./models/Registration');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for payment receipt uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'receipt-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// --- API Routes ---

// Create new registration
app.post('/api/register', upload.single('receipt'), async (req, res) => {
    try {
        const { fullName, countryCode, phoneNumber, telegram } = req.body;
        const receipt = req.file;

        if (!fullName || !countryCode || !phoneNumber || !telegram || !receipt) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const paymentReceiptPath = `/uploads/${receipt.filename}`;

        const newRegistration = new Registration({
            fullName,
            countryCode,
            phoneNumber,
            telegram,
            paymentReceiptPath
        });

        const savedRegistration = await newRegistration.save();
        console.log(`New registration added: ${fullName} (ID: ${savedRegistration._id})`);

        res.status(201).json({
            message: 'Registration successful! Payment is under verification.',
            user: {
                id: savedRegistration._id,
                fullName,
                telegram,
                status: savedRegistration.status
            }
        });

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Failed to process registration.' });
    }
});

// Admin Route: Get all registrations
app.get('/api/admin/registrations', async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ registrationDate: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch registrations.' });
    }
});

// Admin Route: Verify a payment
app.put('/api/admin/registrations/:id/verify', async (req, res) => {
    try {
        const { id } = req.params;
        const registration = await Registration.findByIdAndUpdate(
            id,
            { status: 'verified' },
            { new: true }
        );

        if (!registration) {
            return res.status(404).json({ error: 'Registration not found.' });
        }

        // Simulate sending a confirmation message here
        console.log(`[SYSTEM SIMULATION] Send Telegram/SMS to ${registration.countryCode}${registration.phoneNumber} or @${registration.telegram}: "Your payment of Begena training is verified!"`);

        res.status(200).json({
            message: 'Payment verified and notification sent.',
            registration
        });

    } catch (error) {
        console.error('Verification Error:', error);
        res.status(500).json({ error: 'Failed to verify payment.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
