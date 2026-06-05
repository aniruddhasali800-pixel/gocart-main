import express from 'express';
import Notification from '../models/Notification.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── GET /api/notifications ────────────────────────────────────
// User: Get notifications for the authenticated user
router.get('/', requireAuth, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .limit(50);
            
        const normalized = notifications.map(n => {
            const obj = n.toObject();
            obj.id = obj._id.toString();
            return obj;
        });

        res.json({ success: true, notifications: normalized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── PATCH /api/notifications/:id/read ─────────────────────────
// User: Mark a single notification as read
router.patch('/:id/read', requireAuth, async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { isRead: true },
            { new: true }
        );

        if (!notification) return res.status(404).json({ success: false, message: 'Notification not found' });
        res.json({ success: true, message: 'Marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
