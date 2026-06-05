// ─── Seed Admin User ──────────────────────────────────────────
// Run: node seed-admin.js
// This creates the default admin account in MongoDB

import 'dotenv/config';
import connectDB from './db.js';
import Admin from './models/Admin.js';

const seedAdmin = async () => {
    await connectDB();

    const email    = 'aniruddhasali@748gmail.com';
    const password = 'admin@1234';
    const name     = 'Aniruddha Sali';

    const existing = await Admin.findOne({ email });
    if (existing) {
        console.log('⚠️  Admin already exists with email:', email);
        console.log('   Updating password to admin@1234 ...');
        existing.password = password;
        existing.name     = name;
        await existing.save();
        console.log('✅ Admin password reset successfully!');
        process.exit(0);
    }

    const admin = new Admin({
        name,
        email,
        password,
        phone:        '',
        profileImage: '',
        bio:          'GoCart Administrator',
        address:      '',
    });

    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log('   Email   :', email);
    console.log('   Password:', password);
    console.log('   Login at: http://localhost:5000');
    process.exit(0);
};

seedAdmin().catch(err => {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
});
