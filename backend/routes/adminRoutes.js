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

export default router;
