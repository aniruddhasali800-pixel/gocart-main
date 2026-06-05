import express from 'express';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import { requireAuth, requireSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── GET /api/products ─────────────────────────────────────────
// Public: fetch all in-stock products with store info
router.get('/', async (req, res) => {
    try {
        const { category, search, storeId, limit = 100, page = 1 } = req.query;
        const query = {};

        if (category) query.category = category;
        if (storeId) query.storeId = storeId;
        if (search) query.name = { $regex: search, $options: 'i' };

        const products = await Product.find(query)
            .populate({ path: 'storeId', model: Store, as: 'store' })
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        // Normalize _id -> id for frontend compatibility
        const normalized = products.map(p => {
            const obj = p.toObject({ virtuals: true });
            obj.id = obj._id.toString();
            if (obj.storeId && typeof obj.storeId === 'object') {
                obj.store = obj.storeId;
                obj.store.id = obj.store._id?.toString();
            }
            return obj;
        });

        res.json({ success: true, products: normalized });
    } catch (error) {
        console.error('fetchProducts error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── GET /api/products/:id ─────────────────────────────────────
// Public: single product detail
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate({ path: 'storeId', model: Store, as: 'store' });

        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        const obj = product.toObject({ virtuals: true });
        obj.id = obj._id.toString();
        if (obj.storeId && typeof obj.storeId === 'object') {
            obj.store = obj.storeId;
            obj.store.id = obj.store._id?.toString();
        }

        res.json({ success: true, product: obj });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── POST /api/products ────────────────────────────────────────
// Seller: add a new product
router.post('/', requireSeller, async (req, res) => {
    try {
        const { name, description, mrp, price, images, category } = req.body;

        const product = await Product.create({
            name, description, mrp, price,
            images: images || [],
            category,
            storeId: req.storeId,
        });

        const obj = product.toObject();
        obj.id = obj._id.toString();

        res.status(201).json({ success: true, message: 'Product added successfully', product: obj });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// ─── PATCH /api/products/:id/toggle-stock ─────────────────────
// Seller: toggle inStock
router.patch('/:id/toggle-stock', requireSeller, async (req, res) => {
    try {
        const product = await Product.findOne({ _id: req.params.id, storeId: req.storeId });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

        product.inStock = !product.inStock;
        await product.save();

        res.json({ success: true, message: `Stock ${product.inStock ? 'enabled' : 'disabled'}`, inStock: product.inStock });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
