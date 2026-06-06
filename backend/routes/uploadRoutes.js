import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname.replace(/\s+/g, '-'));
    }
});

const upload = multer({ storage });

// ─── POST /api/upload ──────────────────────────────────────────
// Public: Upload an image and return the local URL
router.post('/', upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }
        // Return URL pointing to the static folder (dynamically from request)
        const backendUrl = process.env.BACKEND_URL || `${req.protocol}://${req.get('host')}`;
        const url = `${backendUrl}/uploads/${req.file.filename}`;
        res.json({ success: true, url });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
