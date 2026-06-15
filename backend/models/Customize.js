import mongoose from 'mongoose';

const customizeSchema = new mongoose.Schema({
    logo: {
        type: String,
        default: '/logo.png'
    },
    sliders: [
        {
            image: { type: String, required: true },
            badgeText: { type: String, default: 'NEWS' },
            badgeSub: { type: String, default: 'Free Shipping on Orders Above $50!' },
            title: { type: String, default: "Gadgets you'll love. Prices you'll trust." },
            priceText: { type: String, default: 'Starts from' },
            price: { type: String, default: '$4.90' },
            buttonText: { type: String, default: 'LEARN MORE' },
            link: { type: String, default: '/shop' }
        }
    ],
    contactInfo: {
        phone: { type: String, default: '9960752618' },
        email: { type: String, default: 'binarycomputersndbr@gmail.com' },
        address: { type: String, default: '22,1st Foor Saiachana Plaza, Bus Stand, Nandurbar-425412' }
    },
    socialMedia: {
        facebook: { type: String, default: 'https://www.facebook.com' },
        instagram: { type: String, default: 'https://www.instagram.com' },
        twitter: { type: String, default: 'https://twitter.com' },
        linkedin: { type: String, default: 'https://www.linkedin.com' }
    }
}, { timestamps: true });

export default mongoose.models.Customize || mongoose.model('Customize', customizeSchema);
