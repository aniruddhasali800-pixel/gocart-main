import mongoose from 'mongoose';

const storeSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk user ID
        required: true,
        unique: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Store name is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    address: {
        type: String,
        required: [true, 'Store address is required'],
    },
    gstNumber: {
        type: String,
        required: [true, 'GST Number is required'],
        trim: true,
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
    logo: {
        type: String,
        default: '',
    },
    email: {
        type: String,
        required: [true, 'Store email is required'],
        lowercase: true,
        trim: true,
    },
    contact: {
        type: String,
        default: '',
    },
    commissionRate: {
        type:    Number,
        default: 10,   // 10% default commission
        min:     0,
        max:     100,
    },
}, { timestamps: true });

export default mongoose.model('Store', storeSchema);
