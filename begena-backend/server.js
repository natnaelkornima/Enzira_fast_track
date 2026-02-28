const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for photo uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'photo-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    }
});

// API Routes
app.post('/api/register', upload.single('photo'), (req, res) => {
    try {
        const { fullName, countryCode, phoneNumber, telegram } = req.body;
        const photo = req.file;

        if (!fullName || !countryCode || !phoneNumber || !telegram || !photo) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const photoPath = `/uploads/${photo.filename}`;

        // Insert into database
        const query = `INSERT INTO users (full_name, country_code, phone_number, telegram, photo_path) VALUES (?, ?, ?, ?, ?)`;
        db.run(query, [fullName, countryCode, phoneNumber, telegram, photoPath], function (err) {
            if (err) {
                console.error('Database Error:', err.message);
                return res.status(500).json({ error: 'Failed to save registration.' });
            }

            console.log(`New registration added: ${fullName} (ID: ${this.lastID})`);

            res.status(201).json({
                message: 'Registration successful!',
                user: {
                    id: this.lastID,
                    fullName,
                    telegram,
                    photoPath
                }
            });
        });

    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
