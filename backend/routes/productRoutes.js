import express from 'express';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import { requireAuth, requireSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── GET /api/products ─────────────────────────────────────────
// Public: fetch all in-stock products with store info
router.get('/', async (req, res) => {
    try {
        const { category, search, storeId, limit = 100, page = 1, all = 'false' } = req.query;
        const query = {};

        if (category) query.category = category;

        if (all === 'true') {
            // Seller dashboard or admin fetch: no filtering by inStock or active stores
            if (storeId) query.storeId = storeId;
        } else {
            // Public fetch: only show inStock products from approved & active stores
            // OR admin-added products (storeId is null/undefined)
            query.inStock = true;

            if (storeId) {
                // Check if this specific store is approved and active
                const store = await Store.findOne({ _id: storeId, status: 'approved', isActive: true });
                if (!store) {
                    return res.json({ success: true, products: [] });
                }
                query.storeId = storeId;
            } else {
                // Fetch all approved and active stores
                const activeStores = await Store.find({ status: 'approved', isActive: true }, '_id');
                const activeStoreIds = activeStores.map(s => s._id);
                // Show products from active stores OR admin-added products (no storeId)
                query.$or = [
                    { storeId: { $in: activeStoreIds } },
                    { storeId: { $exists: false } },
                    { storeId: null }
                ];
            }
        }

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



export default router;
