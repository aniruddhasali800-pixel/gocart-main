import express from 'express';
import Order from '../models/Order.js';
import Address from '../models/Address.js';
import Coupon from '../models/Coupon.js';
import Product from '../models/Product.js';
import Store from '../models/Store.js';
import Notification from '../models/Notification.js';
import { requireAuth, requireSeller } from '../middleware/authMiddleware.js';

const router = express.Router();

// ─── GET /api/orders/user ──────────────────────────────────────
// User: get their own orders
router.get('/user', requireAuth, async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.userId })
            .populate({ path: 'addressId', model: Address })
            .populate({ path: 'couponId', model: Coupon })
            .populate({ path: 'orderItems.productId', model: Product })
            .sort({ createdAt: -1 });

        const normalized = orders.map(order => normalizeOrder(order));
        res.json({ success: true, orders: normalized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── GET /api/orders/store ─────────────────────────────────────
// Seller: get orders for their store
router.get('/store', requireSeller, async (req, res) => {
    try {
        const orders = await Order.find({ storeId: req.storeId })
            .populate({ path: 'addressId', model: Address })
            .populate({ path: 'couponId', model: Coupon })
            .populate({ path: 'orderItems.productId', model: Product })
            .sort({ createdAt: -1 });

        const normalized = orders.map(order => normalizeOrder(order));
        res.json({ success: true, orders: normalized });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── POST /api/orders ──────────────────────────────────────────
// User: place an order
router.post('/', requireAuth, async (req, res) => {
    try {
        const { addressId, paymentMethod, items, couponCode } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'Order must have at least one item' });
        }

        // Validate address belongs to user
        const address = await Address.findOne({ _id: addressId, userId: req.userId });
        if (!address) return res.status(400).json({ success: false, message: 'Invalid address' });

        // Build order items and compute total
        let total = 0;
        const orderItems = [];
        let storeId = null;

        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) return res.status(400).json({ success: false, message: `Product ${item.productId} not found` });
            if (!product.inStock) return res.status(400).json({ success: false, message: `${product.name} is out of stock` });

            total += product.price * item.quantity;
            storeId = product.storeId;
            orderItems.push({ productId: product._id, quantity: item.quantity, price: product.price });
        }

        // Apply coupon if provided
        let couponId = null;
        let isCouponUsed = false;

        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (coupon && new Date(coupon.expiresAt) > new Date() && !coupon.usedBy.includes(req.userId)) {
                total = total - (coupon.discount / 100 * total);
                couponId = coupon._id;
                isCouponUsed = true;
                coupon.usedBy.push(req.userId);
                await coupon.save();
            }
        }

        const order = await Order.create({
            userId: req.userId,
            storeId,
            addressId,
            total: parseFloat(total.toFixed(2)),
            paymentMethod,
            isPaid: paymentMethod === 'STRIPE',
            isCouponUsed,
            couponId,
            orderItems,
            status: 'ORDER_PLACED',
        });

        // Trigger Notification to Seller
        if (storeId) {
            const store = await Store.findById(storeId);
            if (store) {
                await Notification.create({
                    userId: store.userId,
                    title: 'New Order Received',
                    message: `You received a new order of $${order.total}.`,
                    type: 'order',
                    link: '/store/orders'
                });
            }
        }

        res.status(201).json({ success: true, message: 'Order placed successfully', orderId: order._id });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── PATCH /api/orders/:id/status ─────────────────────────────
// Seller: update order status
router.patch('/:id/status', requireSeller, async (req, res) => {
    try {
        const { status } = req.body;
        const order = await Order.findOneAndUpdate(
            { _id: req.params.id, storeId: req.storeId },
            { status },
            { new: true }
        );
        if (!order) return res.status(404).json({ success: false, message: 'Order not found' });
        res.json({ success: true, message: 'Status updated', status: order.status });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── Helper: normalize order for frontend ─────────────────────
function normalizeOrder(order) {
    const obj = order.toObject({ virtuals: true });
    obj.id = obj._id.toString();
    obj.address = obj.addressId;
    if (obj.address) obj.address.id = obj.address._id?.toString();
    obj.coupon = obj.couponId;
    if (obj.coupon) obj.coupon.id = obj.coupon._id?.toString();
    obj.orderItems = (obj.orderItems || []).map(item => ({
        ...item,
        product: item.productId,
    }));
    return obj;
}

export default router;
