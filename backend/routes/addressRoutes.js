import express from 'express';
import Address from '../models/Address.js';
import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── GET /api/addresses ────────────────────────────────────────
// User: get their saved addresses
router.get('/', requireAuth, async (req, res) => {
    try {
        const addresses = await Address.find({ userId: req.userId }).sort({ createdAt: -1 });
        const normalized = addresses.map(a => {
            const obj = a.toObject();
            obj.id = obj._id.toString();
            return obj;
        });
        res.json({ success: true, addresses: normalized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── POST /api/addresses ───────────────────────────────────────
// User: add a new address
router.post('/', requireAuth, async (req, res) => {
    try {
        const { name, email, street, city, state, zip, country, phone } = req.body;
        const address = await Address.create({
            userId: req.userId,
            name, email, street, city, state, zip, country: country || 'USA', phone,
        });

        const obj = address.toObject();
        obj.id = obj._id.toString();

        res.status(201).json({ success: true, message: 'Address added', address: obj });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ─── DELETE /api/addresses/:id ─────────────────────────────────
// User: delete an address
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const deleted = await Address.findOneAndDelete({ _id: req.params.id, userId: req.userId });
        if (!deleted) return res.status(404).json({ success: false, message: 'Address not found' });
        res.json({ success: true, message: 'Address deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
