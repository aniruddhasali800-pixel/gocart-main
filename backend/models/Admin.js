import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
    name:         { type: String, required: true, default: 'Admin' },
    email:        { type: String, required: true, unique: true, lowercase: true },
    password:     { type: String, required: true },
    phone:        { type: String, default: '' },
    profileImage: { type: String, default: '' },
    bio:          { type: String, default: '' },
    address:      { type: String, default: '' },
}, { timestamps: true });

// Hash password before saving
adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Compare password
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('Admin', adminSchema);
