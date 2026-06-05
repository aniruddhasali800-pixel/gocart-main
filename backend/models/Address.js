import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk user ID
        required: true,
        index: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
    },
    street: {
        type: String,
        required: [true, 'Street is required'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
    state: {
        type: String,
        required: [true, 'State is required'],
    },
    zip: {
        type: String,
        required: [true, 'ZIP code is required'],
    },
    country: {
        type: String,
        required: [true, 'Country is required'],
        default: 'USA',
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
    },
}, { timestamps: true });

export default mongoose.model('Address', addressSchema);
