import express from 'express';
import Order from '../models/Order.js';
import { requireAdminJWT } from './adminAuthRoutes.js';

const router = express.Router();

// ─── GET /api/admin/users/analytics ────────────────────────────
// Aggregated analytics across ALL users
router.get('/analytics', requireAdminJWT, async (req, res) => {
    try {
        const orders = await Order.find({})
            .select('userId total createdAt paymentMethod status')
            .lean();

        // ── Unique users who placed orders ──
        const userOrderMap = {};   // userId → { totalSpent, orderCount, lastOrder }
        orders.forEach(o => {
            const uid = o.userId;
            if (!userOrderMap[uid]) {
                userOrderMap[uid] = { totalSpent: 0, orderCount: 0, lastOrder: o.createdAt };
            }
            userOrderMap[uid].totalSpent += o.total || 0;
            userOrderMap[uid].orderCount += 1;
            if (new Date(o.createdAt) > new Date(userOrderMap[uid].lastOrder)) {
                userOrderMap[uid].lastOrder = o.createdAt;
            }
        });

        const activeUsers = Object.keys(userOrderMap).length;
        const totalSpending = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const avgOrdersPerUser = activeUsers > 0
            ? (orders.length / activeUsers)
            : 0;

        // ── Top 10 spenders ──
        const topSpenders = Object.entries(userOrderMap)
            .map(([userId, data]) => ({
                userId,
                totalSpent: parseFloat(data.totalSpent.toFixed(2)),
                orderCount: data.orderCount,
            }))
            .sort((a, b) => b.totalSpent - a.totalSpent)
            .slice(0, 10);

        // ── Orders distribution buckets ──
        const orderCounts = Object.values(userOrderMap).map(u => u.orderCount);
        const distribution = { '1': 0, '2-5': 0, '6-10': 0, '10+': 0 };
        orderCounts.forEach(c => {
            if (c === 1)       distribution['1']++;
            else if (c <= 5)   distribution['2-5']++;
            else if (c <= 10)  distribution['6-10']++;
            else               distribution['10+']++;
        });
        const orderDistribution = Object.entries(distribution).map(([range, count]) => ({
            range, count,
        }));

        // ── Orders per day (for chart) ──
        const ordersPerDay = {};
        orders.forEach(o => {
            const day = new Date(o.createdAt).toISOString().split('T')[0];
            if (!ordersPerDay[day]) ordersPerDay[day] = { date: day, orders: 0, revenue: 0 };
            ordersPerDay[day].orders += 1;
            ordersPerDay[day].revenue += o.total || 0;
        });
        const dailyActivity = Object.values(ordersPerDay)
            .sort((a, b) => a.date.localeCompare(b.date))
            .map(d => ({ ...d, revenue: parseFloat(d.revenue.toFixed(2)) }));

        // ── Per-user summary list (for table) ──
        const userSummaries = Object.entries(userOrderMap)
            .map(([userId, data]) => ({
                userId,
                totalSpent: parseFloat(data.totalSpent.toFixed(2)),
                orderCount: data.orderCount,
                lastOrder: data.lastOrder,
            }))
            .sort((a, b) => b.totalSpent - a.totalSpent);

        res.json({
            success: true,
            analytics: {
                activeUsers,
                totalSpending: parseFloat(totalSpending.toFixed(2)),
                totalOrders: orders.length,
                avgOrdersPerUser: parseFloat(avgOrdersPerUser.toFixed(1)),
                topSpenders,
                orderDistribution,
                dailyActivity,
                userSummaries,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ─── GET /api/admin/users/:userId/analytics ────────────────────
// Detailed analytics for a SINGLE user
router.get('/:userId/analytics', requireAdminJWT, async (req, res) => {
    try {
        const { userId } = req.params;

        const orders = await Order.find({ userId })
            .populate('orderItems.productId', 'name images price')
            .sort({ createdAt: -1 })
            .lean();

        if (orders.length === 0) {
            return res.json({
                success: true,
                analytics: {
                    totalOrders: 0,
                    totalSpent: 0,
                    avgOrderValue: 0,
                    preferredPayment: 'N/A',
                    spendingOverTime: [],
                    statusBreakdown: [],
                    paymentSplit: [],
                    recentOrders: [],
                },
            });
        }

        const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
        const avgOrderValue = totalSpent / orders.length;

        // ── Payment method preference ──
        const paymentCounts = { COD: 0, STRIPE: 0 };
        orders.forEach(o => { paymentCounts[o.paymentMethod] = (paymentCounts[o.paymentMethod] || 0) + 1; });
        const preferredPayment = paymentCounts.STRIPE >= paymentCounts.COD ? 'Online' : 'COD';

        // ── Spending over time (monthly) ──
        const monthlySpend = {};
        orders.forEach(o => {
            const d = new Date(o.createdAt);
            const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (!monthlySpend[key]) monthlySpend[key] = { month: key, spent: 0, orders: 0 };
            monthlySpend[key].spent += o.total || 0;
            monthlySpend[key].orders += 1;
        });
        const spendingOverTime = Object.values(monthlySpend)
            .sort((a, b) => a.month.localeCompare(b.month))
            .map(m => ({ ...m, spent: parseFloat(m.spent.toFixed(2)) }));

        // ── Order status breakdown ──
        const statusMap = {};
        orders.forEach(o => { statusMap[o.status] = (statusMap[o.status] || 0) + 1; });
        const statusBreakdown = Object.entries(statusMap).map(([status, count]) => ({
            status: status.replace(/_/g, ' '),
            count,
        }));

        // ── Payment method split ──
        const paymentSplit = Object.entries(paymentCounts).map(([method, count]) => ({
            method: method === 'STRIPE' ? 'Online' : 'COD',
            count,
            amount: parseFloat(
                orders.filter(o => o.paymentMethod === method)
                    .reduce((s, o) => s + (o.total || 0), 0)
                    .toFixed(2)
            ),
        }));

        // ── Recent orders (last 20) ──
        const recentOrders = orders.slice(0, 20).map(o => ({
            id: o._id,
            total: o.total,
            status: o.status,
            paymentMethod: o.paymentMethod,
            createdAt: o.createdAt,
            itemCount: (o.orderItems || []).length,
        }));

        res.json({
            success: true,
            analytics: {
                totalOrders: orders.length,
                totalSpent: parseFloat(totalSpent.toFixed(2)),
                avgOrderValue: parseFloat(avgOrderValue.toFixed(2)),
                preferredPayment,
                spendingOverTime,
                statusBreakdown,
                paymentSplit,
                recentOrders,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

export default router;
