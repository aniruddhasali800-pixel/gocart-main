import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Coupon code is required'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    storeId: {
        type: String,
        default: null, // Null means it's a global coupon created by Admin
    },
    discount: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
    forNewUser: {
        type: Boolean,
        default: false,
    },
    forMember: {
        type: Boolean,
        default: false,
    },
    isPublic: {
        type: Boolean,
        default: false,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
    usedBy: {
        type: [String], // array of Clerk user IDs
        default: [],
    },
}, { timestamps: true });

export default mongoose.model('Coupon', couponSchema);
