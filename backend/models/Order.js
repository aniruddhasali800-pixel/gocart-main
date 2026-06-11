import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
    },
}, { _id: false });

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,  // Clerk user ID (string)
        required: true,
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
    },
    addressId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Address',
        required: true,
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['ORDER_PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
        default: 'ORDER_PLACED',
    },
    paymentMethod: {
        type: String,
        enum: ['COD', 'STRIPE'],
        required: true,
    },
    isPaid: {
        type: Boolean,
        default: false,
    },
    isCouponUsed: {
        type: Boolean,
        default: false,
    },
    couponId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Coupon',
        default: null,
    },
    orderItems: {
        type: [orderItemSchema],
        required: true,
    },
    trackingId: {
        type: String,
        default: null,
    },
    carrier: {
        type: String,
        default: null,
    },
    expectedDeliveryDate: {
        type: Date,
        default: null,
    },
}, { timestamps: true });

export default mongoose.model('Order', orderSchema);
