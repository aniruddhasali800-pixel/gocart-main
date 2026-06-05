import express from 'express';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Store from '../models/Store.js';
import { requireSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── GET /api/seller/dashboard ─────────────────────────────────
router.get('/dashboard', requireSeller, async (req, res) => {
    try {
        const [totalProducts, storeOrders, store] = await Promise.all([
            Product.countDocuments({ storeId: req.storeId }),
            Order.find({ storeId: req.storeId })
                .populate('orderItems.productId')
                .sort({ createdAt: -1 }),
            Store.findById(req.storeId).select('commissionRate name'),
        ]);

        const commissionRate = store?.commissionRate ?? 10;

        let onlineRevenue = 0;
        let codRevenue    = 0;

        storeOrders.forEach(o => {
            const amt = o.total || 0;
            if (o.paymentMethod === 'STRIPE') onlineRevenue += amt;
            else                               codRevenue    += amt;
        });

        const totalEarnings  = onlineRevenue + codRevenue;
        // Seller gets (100 - commissionRate)% of revenue
        const sellerEarnings = totalEarnings * ((100 - commissionRate) / 100);
        const commissionPaid = totalEarnings * (commissionRate / 100);

        const allOrders = storeOrders.map(o => ({
            createdAt:     o.createdAt,
            total:         o.total,
            paymentMethod: o.paymentMethod,
            status:        o.status,
        }));

        // Build ratings from all delivered orders' products
        const ratings = [];
        for (const order of storeOrders) {
            for (const item of order.orderItems || []) {
                if (item.productId?.rating) {
                    ratings.push(...(item.productId.rating || []));
                }
            }
        }

        res.json({
            success: true,
            dashboard: {
                totalProducts,
                totalOrders:    storeOrders.length,
                totalEarnings:  parseFloat(totalEarnings.toFixed(2)),
                onlineRevenue:  parseFloat(onlineRevenue.toFixed(2)),
                codRevenue:     parseFloat(codRevenue.toFixed(2)),
                sellerEarnings: parseFloat(sellerEarnings.toFixed(2)),
                commissionPaid: parseFloat(commissionPaid.toFixed(2)),
                commissionRate,
                allOrders,
                ratings: ratings.slice(0, 20),
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
