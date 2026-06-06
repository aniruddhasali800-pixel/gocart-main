import express from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { v2 as cloudinary } from 'cloudinary';


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
// Public: Upload an image and return URL (Cloudinary or Base64 fallback)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No image uploaded' });
        }

        const isCloudinaryConfigured = 
            process.env.CLOUDINARY_CLOUD_NAME && 
            process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
            process.env.CLOUDINARY_API_KEY && 
            process.env.CLOUDINARY_API_KEY !== 'your_api_key' &&
            process.env.CLOUDINARY_API_SECRET && 
            process.env.CLOUDINARY_API_SECRET !== 'your_api_secret';

        if (isCloudinaryConfigured) {
            // Configure Cloudinary
            cloudinary.config({
                cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });

            // Upload to Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'gocart'
            });

            // Delete temporary local file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.json({ success: true, url: result.secure_url });
        } else {
            // Fallback: Convert to Base64 data URI
            const mimeType = req.file.mimetype;
            const fileBuffer = fs.readFileSync(req.file.path);
            const base64Data = fileBuffer.toString('base64');
            const dataUrl = `data:${mimeType};base64,${base64Data}`;

            // Delete temporary local file
            if (fs.existsSync(req.file.path)) {
                fs.unlinkSync(req.file.path);
            }

            return res.json({ success: true, url: dataUrl });
        }
    } catch (error) {
        // Clean up temporary local file if error occurred
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.error('Failed to delete temp file on error:', err);
            }
        }
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
