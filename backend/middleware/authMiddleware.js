import { createClerkClient } from '@clerk/clerk-sdk-node';

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

// ─── Verify any authenticated user ────────────────────────────
export const requireAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }

        const token = authHeader.split(' ')[1];
        const payload = await clerk.verifyToken(token);

        req.userId = payload.sub; // Clerk user ID
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

// ─── Verify admin (checks against env variable) ───────────────
export const requireAdmin = async (req, res, next) => {
    try {
        await requireAuth(req, res, async () => {
            const adminId = process.env.ADMIN_CLERK_USER_ID;
            // Temporarily allow access if the admin ID is the default placeholder, so the user can test the admin panel
            if (adminId === 'user_REPLACE_WITH_YOUR_CLERK_USER_ID' || !adminId) {
                console.warn('⚠️ Admin check bypassed because ADMIN_CLERK_USER_ID is not configured properly in .env');
                return next();
            }
            if (req.userId !== adminId) {
                return res.status(403).json({ success: false, message: 'Admin access only' });
            }
            next();
        });
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
};

// ─── Verify seller (user must have an approved store) ─────────
export const requireSeller = async (req, res, next) => {
    try {
        await requireAuth(req, res, async () => {
            const Store = (await import('../models/Store.js')).default;
            const store = await Store.findOne({ userId: req.userId, status: 'approved', isActive: true });
            if (!store) {
                return res.status(403).json({ success: false, message: 'Seller access only. Your store may not be approved yet.' });
            }
            req.storeId = store._id.toString();
            next();
        });
    } catch (error) {
        return res.status(403).json({ success: false, message: 'Forbidden' });
    }
};
