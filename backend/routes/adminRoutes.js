import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Store from '../models/Store.js';
import { requireAdminJWT } from './adminAuthRoutes.js';

const router = express.Router();

// ─── GET /api/admin/dashboard ──────────────────────────────────
router.get('/dashboard', requireAdminJWT, async (req, res) => {
    try {
        const [products, stores, orders] = await Promise.all([
            Product.countDocuments(),
            Store.countDocuments({ status: 'approved' }),
            Order.find({}).select('total createdAt paymentMethod isPaid storeId'),
        ]);

        // Revenue split
        let onlineRevenue = 0;
        let codRevenue    = 0;
        let totalRevenue  = 0;

        orders.forEach(o => {
            const amt = o.total || 0;
            totalRevenue += amt;
            if (o.paymentMethod === 'STRIPE') onlineRevenue += amt;
            else                               codRevenue    += amt;
        });

        // Commission revenue: sum up commissionRate * storeRevenue per store
        const storeIds = [...new Set(orders.map(o => o.storeId?.toString()).filter(Boolean))];
        const storeList = await Store.find({ _id: { $in: storeIds } }).select('commissionRate');
        const commissionMap = {};
        storeList.forEach(s => { commissionMap[s._id.toString()] = s.commissionRate || 10; });

        let commissionRevenue = 0;
        orders.forEach(o => {
            if (o.storeId) {
                const rate = commissionMap[o.storeId.toString()] || 10;
                commissionRevenue += (o.total || 0) * (rate / 100);
            }
        });

        const allOrders = orders.map(o => ({
            createdAt:     o.createdAt,
            total:         o.total,
            paymentMethod: o.paymentMethod,
        }));

        res.json({
            success: true,
            dashboard: {
                products,
                stores,
                orders:           orders.length,
                revenue:          totalRevenue.toFixed(2),
                onlineRevenue:    onlineRevenue.toFixed(2),
                codRevenue:       codRevenue.toFixed(2),
                commissionRevenue: commissionRevenue.toFixed(2),
                allOrders,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── GET /api/admin/orders ─────────────────────────────────────
router.get('/orders', requireAdminJWT, async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate('addressId')
            .populate('couponId')
            .populate('orderItems.productId')
            .sort({ createdAt: -1 });

        const normalized = orders.map(o => {
            const obj = o.toObject();
            obj.id      = obj._id.toString();
            obj.address = obj.addressId;
            obj.coupon  = obj.couponId;
            return obj;
        });

        res.json({ success: true, orders: normalized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── ADMIN INVENTORY ROUTES ──────────────────────────────────
router.get('/products', requireAdminJWT, async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 }).populate('storeId', 'name');
        const normalized = products.map(p => {
            const obj = p.toObject();
            obj.id = obj._id.toString();
            return obj;
        });
        res.json({ success: true, products: normalized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/products', requireAdminJWT, async (req, res) => {
    try {
        const { name, description, mrp, price, images, category } = req.body;
        const product = await Product.create({
            name, description, mrp, price, images: images || [], category,
            // storeId is intentionally omitted for admin-added products
        });
        res.status(201).json({ success: true, message: 'Product created', product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.put('/products/:id', requireAdminJWT, async (req, res) => {
    try {
        const { name, description, mrp, price, images, category, inStock } = req.body;
        const product = await Product.findByIdAndUpdate(req.params.id, {
            name, description, mrp, price, images, category, inStock
        }, { new: true });
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, message: 'Product updated', product });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

router.delete('/products/:id', requireAdminJWT, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        res.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/products/:id/toggle-stock', requireAdminJWT, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
        product.inStock = !product.inStock;
        await product.save();
        res.json({ success: true, message: `Stock ${product.inStock ? 'enabled' : 'disabled'}`, inStock: product.inStock });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── ADMIN ORDER STATUS UPDATE ───────────────────────────────
router.put('/orders/:id/status', requireAdminJWT, async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }
        
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        
        res.json({ success: true, message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.patch('/orders/:id/tracking', requireAdminJWT, async (req, res) => {
    try {
        const { trackingId, carrier, expectedDeliveryDate } = req.body;
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { trackingId, carrier, expectedDeliveryDate },
            { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, message: 'Tracking details updated', order });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
