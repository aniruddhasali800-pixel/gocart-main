import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    mrp: {
        type: Number,
        required: [true, 'MRP is required'],
        min: 0,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: 0,
    },
    images: {
        type: [String],
        default: [],
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: [
            'Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health',
            'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink',
            'Hobbies & Crafts', 'Headphones', 'Speakers', 'Watch', 'Earbuds',
            'Mouse', 'Decoration', 'Others'
        ],
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Store',
        required: false,
    },
    inStock: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Virtual to compute average rating
productSchema.virtual('avgRating', {
    ref: 'Rating',
    localField: '_id',
    foreignField: 'productId',
});

export default mongoose.model('Product', productSchema);
