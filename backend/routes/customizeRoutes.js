import express from 'express';
import Customize from '../models/Customize.js';
import { requireAdminJWT } from './adminAuthRoutes.js';

const router = express.Router();

// GET /api/customize - Get website customization settings
router.get('/', async (req, res) => {
    try {
        let settings = await Customize.findOne();
        if (!settings) {
            // Create default settings if they don't exist
            settings = await Customize.create({});
        }
        res.json({ success: true, settings });
    } catch (error) {
        console.error('Error fetching customize settings:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

// PUT /api/customize - Update website customization settings (Admin only)
router.put('/', requireAdminJWT, async (req, res) => {
    try {
        const { logo, sliders, contactInfo, socialMedia } = req.body;

        let settings = await Customize.findOne();
        if (!settings) {
            settings = new Customize();
        }

        if (logo !== undefined) settings.logo = logo;
        if (sliders !== undefined) settings.sliders = sliders;
        if (contactInfo !== undefined) settings.contactInfo = contactInfo;
        if (socialMedia !== undefined) settings.socialMedia = socialMedia;

        await settings.save();

        res.json({ success: true, message: 'Settings updated successfully', settings });
    } catch (error) {
        console.error('Error updating customize settings:', error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
});

export default router;
