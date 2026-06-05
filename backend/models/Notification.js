import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String, // Clerk user ID (can be seller or admin)
        required: true,
        index: true,
    },
    title: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['order', 'system', 'store'],
        default: 'system',
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String, // Optional URL to navigate to when clicked
        default: '',
    },
}, { timestamps: true });

export default mongoose.model('Notification', notificationSchema);
