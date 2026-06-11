import 'dotenv/config';
import connectDB from './db.js';
import Product from './models/Product.js';

const fixImageUrls = async () => {
    try {
        await connectDB();
        
        const products = await Product.find({});
        let updatedCount = 0;

        for (const product of products) {
            let modified = false;
            const newImages = product.images.map(img => {
                if (img.startsWith('http://localhost:5000')) {
                    modified = true;
                    return img.replace('http://localhost:5000', 'https://gocart-main-4.onrender.com');
                }
                return img;
            });

            if (modified) {
                product.images = newImages;
                await product.save();
                updatedCount++;
                console.log(`Updated product: ${product.name}`);
            }
        }

        console.log(`Successfully updated ${updatedCount} products.`);
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

fixImageUrls();
