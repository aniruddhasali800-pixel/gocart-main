import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

const router = express.Router();

const JWT_SECRET  = process.env.ADMIN_JWT_SECRET || 'gocart_admin_secret_key';
const JWT_EXPIRES = '7d';

// ─── Middleware: verify admin JWT ──────────────────────────────
const requireAdminJWT = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        if (!auth || !auth.startsWith('Bearer ')) {
            return res.status(401).json({ success: false, message: 'No token provided' });
        }
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, JWT_SECRET);
        const admin = await Admin.findById(decoded.id).select('-password');
        if (!admin) return res.status(401).json({ success: false, message: 'Admin not found' });
        req.admin = admin;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
};

// ─── POST /api/admin/auth/login ────────────────────────────────
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password)
            return res.status(400).json({ success: false, message: 'Email and password are required' });

        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin)
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const match = await admin.comparePassword(password);
        if (!match)
            return res.status(401).json({ success: false, message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id, role: 'admin' }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

        res.json({
            success: true,
            token,
            admin: {
                id:           admin._id,
                name:         admin.name,
                email:        admin.email,
                phone:        admin.phone,
                profileImage: admin.profileImage,
                bio:          admin.bio,
                address:      admin.address,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

// ─── GET /api/admin/auth/profile ───────────────────────────────
router.get('/profile', requireAdminJWT, async (req, res) => {
    res.json({ success: true, admin: req.admin });
});

// ─── PUT /api/admin/auth/profile ───────────────────────────────
router.put('/profile', requireAdminJWT, async (req, res) => {
    try {
        const { name, phone, bio, address, profileImage, currentPassword, newPassword } = req.body;

        const admin = await Admin.findById(req.admin._id);

        if (name)         admin.name         = name;
        if (phone)        admin.phone        = phone;
        if (bio  !== undefined)     admin.bio  = bio;
        if (address !== undefined)  admin.address = address;
        if (profileImage) admin.profileImage = profileImage;

        // Change password if provided
        if (newPassword) {
            if (!currentPassword)
                return res.status(400).json({ success: false, message: 'Current password required to change password' });
            const match = await admin.comparePassword(currentPassword);
            if (!match)
                return res.status(401).json({ success: false, message: 'Current password is incorrect' });
            admin.password = newPassword; // pre-save hook will hash it
        }

        await admin.save();

        res.json({
            success: true,
            message: 'Profile updated successfully',
            admin: {
                id:           admin._id,
                name:         admin.name,
                email:        admin.email,
                phone:        admin.phone,
                profileImage: admin.profileImage,
                bio:          admin.bio,
                address:      admin.address,
            },
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
});

export { requireAdminJWT };
export default router;
