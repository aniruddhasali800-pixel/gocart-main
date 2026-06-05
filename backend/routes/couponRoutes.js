import express from 'express';
import Coupon from '../models/Coupon.js';
import { requireAuth, requireAdmin, requireSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── POST /api/coupons/verify ──────────────────────────────────
// User: verify a coupon code before placing order
router.post('/verify', requireAuth, async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) return res.status(400).json({ success: false, message: 'Coupon code is required' });

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
        if (new Date(coupon.expiresAt) < new Date()) return res.status(400).json({ success: false, message: 'Coupon has expired' });
        if (coupon.usedBy.includes(req.userId)) return res.status(400).json({ success: false, message: 'You have already used this coupon' });

        const obj = coupon.toObject();
        obj.id = obj._id.toString();

        res.json({ success: true, coupon: { ...obj, usedBy: undefined } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── GET /api/coupons ──────────────────────────────────────────
// Admin: list all coupons
router.get('/', requireAdmin, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        const normalized = coupons.map(c => {
            const obj = c.toObject();
            obj.id = obj._id.toString();
            return obj;
        });
        res.json({ success: true, coupons: normalized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── POST /api/coupons ─────────────────────────────────────────
// Admin: create a global coupon
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { code, description, discount, forNewUser, forMember, isPublic, expiresAt } = req.body;
        const coupon = await Coupon.create({
            code, description, discount, forNewUser, forMember, isPublic, expiresAt,
        });

        const obj = coupon.toObject();
        obj.id = obj._id.toString();

        res.status(201).json({ success: true, message: 'Coupon created', coupon: obj });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ─── POST /api/coupons/seller ──────────────────────────────────
// Seller: create a coupon for their store
router.post('/seller', requireSeller, async (req, res) => {
    try {
        const { code, description, discount, expiresAt } = req.body;
        const coupon = await Coupon.create({
            code, 
            description, 
            discount, 
            expiresAt,
            storeId: req.storeId, // attach to the seller's store
            isPublic: true,
            forNewUser: false,
            forMember: false
        });

        const obj = coupon.toObject();
        obj.id = obj._id.toString();

        res.status(201).json({ success: true, message: 'Store Coupon created', coupon: obj });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ─── DELETE /api/coupons/:id ───────────────────────────────────
// Admin: delete a coupon
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        const deleted = await Coupon.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ success: false, message: 'Coupon not found' });
        res.json({ success: true, message: 'Coupon deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
