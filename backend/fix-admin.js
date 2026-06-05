import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';

async function fix() {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: 'gocart' });
        console.log('Connected to DB');

        const Store = (await import('./models/Store.js')).default;
        
        const store = await Store.findOne();
        
        if (!store) {
            console.log('No store found in DB! User needs to create one first.');
            process.exit(0);
        }

        store.status = 'approved';
        store.isActive = true;
        await store.save();
        console.log('Store approved! User ID:', store.userId);

        let envContent = fs.readFileSync('.env', 'utf-8');
        envContent = envContent.replace(/ADMIN_CLERK_USER_ID=.*/, `ADMIN_CLERK_USER_ID=${store.userId}`);
        fs.writeFileSync('.env', envContent);
        console.log('.env updated with ADMIN_CLERK_USER_ID');

        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
fix();
