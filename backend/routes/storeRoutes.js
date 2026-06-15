import express from 'express';
import Store from '../models/Store.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdminJWT } from './adminAuthRoutes.js';
import { clerkClient } from '@clerk/express';

const router = express.Router();


// ─── GET /api/stores ───────────────────────────────────────────
// Admin: list all stores
router.get('/', requireAdminJWT, async (req, res) => {
    try {
        const stores = await Store.find().sort({ createdAt: -1 });
        const normalized = await Promise.all(stores.map(async (s) => {
            const obj = s.toObject();
            obj.id = obj._id.toString();

            try {
                const clerkUser = await clerkClient.users.getUser(s.userId);
                obj.user = {
                    name:  `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'No Name',
                    email: clerkUser.emailAddresses?.[0]?.emailAddress || 'No Email',
                    image: clerkUser.imageUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                };
            } catch {
                obj.user = {
                    name:  'Unknown Seller',
                    email: s.email || 'No Email',
                    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
                };
            }

            return obj;
        }));
        res.json({ success: true, stores: normalized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── GET /api/stores/me ────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
    try {
        const store = await Store.findOne({ userId: req.userId });
        if (!store) return res.status(404).json({ success: false, message: 'No store found for this user' });

        const obj = store.toObject();
        obj.id = obj._id.toString();

        res.json({ success: true, store: obj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── POST /api/stores ──────────────────────────────────────────
router.post('/', requireAuth, async (req, res) => {
    try {
        const existing = await Store.findOne({ userId: req.userId });
        if (existing) return res.status(409).json({ success: false, message: 'You already have a store' });

        const { name, description, username, address, email, contact, logo, phone, gstNumber } = req.body;
        const store = await Store.create({
            userId: req.userId,
            name, description, username, address, email,
            contact: contact || '',
            phone, gstNumber,
            logo: logo || '',
            status: 'pending',
        });

        const obj = store.toObject();
        obj.id = obj._id.toString();

        res.status(201).json({ success: true, message: 'Store created. Awaiting admin approval.', store: obj });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ success: false, message: 'Username already taken' });
        }
        res.status(400).json({ success: false, message: error.message });
    }
});

// ─── PATCH /api/stores/:id/approve ────────────────────────────
// Admin: approve or reject a store
router.patch('/:id/approve', requireAdminJWT, async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const isActive = status === 'approved';
        const store = await Store.findByIdAndUpdate(req.params.id, { status, isActive }, { new: true });
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

        res.json({ success: true, message: `Store ${status}`, store });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── PATCH /api/stores/:id/commission ─────────────────────────
// Admin: set commission rate for a specific vendor
router.patch('/:id/commission', requireAdminJWT, async (req, res) => {
    try {
        const { commissionRate } = req.body;
        if (commissionRate === undefined || commissionRate < 0 || commissionRate > 100) {
            return res.status(400).json({ success: false, message: 'commissionRate must be 0–100' });
        }

        const store = await Store.findByIdAndUpdate(
            req.params.id,
            { commissionRate: Number(commissionRate) },
            { new: true }
        );
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

        res.json({ success: true, message: `Commission updated to ${commissionRate}%`, store });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── PATCH /api/stores/me ──────────────────────────────────────
router.patch('/me', requireAuth, async (req, res) => {
    try {
        const { name, description, address, email, contact, logo, isActive } = req.body;
        const store = await Store.findOneAndUpdate(
            { userId: req.userId },
            { name, description, address, email, contact, logo, isActive },
            { new: true, runValidators: true }
        );
        if (!store) return res.status(404).json({ success: false, message: 'Store not found' });

        const obj = store.toObject();
        obj.id = obj._id.toString();

        res.json({ success: true, message: 'Store updated', store: obj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
