import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName: 'gocart',
        });
        console.log(`✅ MongoDB Connected`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

const seedData = async () => {
    await connectDB();
    try {
        await Product.deleteMany({});
        console.log('Cleared existing products.');

        const product = await Product.create({
            name: "Apple iPhone 15 Pro",
            description: "The latest iPhone with aerospace-grade titanium design, A17 Pro chip, and a more advanced 48MP Main camera system.",
            price: 999.00,
            mrp: 1099.00,
            category: "Electronics",
            images: [
                "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-bluetitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692846360609"
            ],
            rating: [5, 4, 5, 5, 5],
            storeId: new mongoose.Types.ObjectId(), // Fake store ID for now
            inStock: true
        });

        console.log('✅ Added test product:', product.name);
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seedData();
