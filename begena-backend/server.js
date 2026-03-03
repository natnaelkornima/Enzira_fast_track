const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const connectDB = require('./database');
const Registration = require('./models/Registration');
const Admin = require('./models/Admin');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'begena_super_secret_key_2026';

// Connect to MongoDB
connectDB().then(async () => {
    // Seed default admin if it doesn't exist
    const adminExists = await Admin.findOne({ email: 'admin@begena.com' });
    if (!adminExists) {
        const defaultAdmin = new Admin({
            email: 'admin@begena.com',
            password: 'securepassword123' // default password, will be hashed
        });
        await defaultAdmin.save();
        console.log('Default admin seeded: admin@begena.com / securepassword123');
    }
});

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

// --- Admin Authentication & Protected Routes ---

// Admin Login
app.post('/api/admin/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { id: admin._id },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.status(200).json({ token });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Server error during login' });
    }
});

// Authentication Middleware
const authenticateAdmin = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.adminId = decoded.id;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token.' });
    }
};

// Admin Route: Get all registrations
app.get('/api/admin/registrations', authenticateAdmin, async (req, res) => {
    try {
        const registrations = await Registration.find().sort({ registrationDate: -1 });
        res.status(200).json(registrations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch registrations.' });
    }
});

// Admin Route: Verify a payment
app.put('/api/admin/registrations/:id/verify', authenticateAdmin, async (req, res) => {
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
