import mongoose from "mongoose";

const TestimonialSchema = new mongoose.Schema({
    author: { type: String, default: "" },
    role: { type: String, default: "" },
    content: { type: String, default: "" },
    rating: { type: Number, default: 5 },
});

const SiteSettingsSchema = new mongoose.Schema({
    homepage: {
        hero: {
            badge: { type: String, default: "New Collection 2024" },
            title: { type: String, default: "Elevate Your Style with Premium Essentials" },
            subtitle: { type: String, default: "Discover the latest trends in fashion. High-quality materials, sustainable production, and timeless designs crafted just for you." },
            image: { type: String, default: "" },
            ctaPrimary: { type: String, default: "Shop Now" },
            ctaSecondary: { type: String, default: "Explore Collection" },
        },
        promoBanner: {
            title: { type: String, default: "End of Season" },
            subtitle: { type: String, default: "Clearance Sale" },
            description: { type: String, default: "Save up to 50% on selected premium styles. Don't miss out on the biggest deals of the year." },
            image: { type: String, default: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop" },
            ctaText: { type: String, default: "Shop The Sale" },
            active: { type: Boolean, default: true },
        },
        newsletter: {
            title: { type: String, default: "Join the Club" },
            subtitle: { type: String, default: "Subscribe to our newsletter and get 10% off your first order plus exclusive access to new drops." },
        },
        testimonials: {
            type: [TestimonialSchema],
            default: [
                { author: "Alex Morgan", role: "Verified Buyer", content: "The quality of the fabrics is outstanding. I've washed my hoodie multiple times and it still feels brand new. Fast shipping too!", rating: 5 },
                { author: "Sarah Chen", role: "Fashion Blogger", content: "I love the minimalist aesthetic of the new collection. It fits perfectly into my wardrobe. Definitely buying more.", rating: 5 },
                { author: "Michael Ross", role: "Loyal Customer", content: "Customer service was incredibly helpful when I needed to exchange for a different size. The process was seamless.", rating: 4 },
            ]
        },
        selectedCategories: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'Category',
            default: []
        },
    },
    mainSettings: {
        siteName: { type: String, default: "Said Store" },
        logo: { type: String, default: "" },
        contactEmail: { type: String, default: "" },
        contactPhone: { type: String, default: "" },
        address: { type: String, default: "" },
        whatsappNumber: { type: String, default: "" },
        socialLinks: {
            facebook: { type: String, default: "" },
            instagram: { type: String, default: "" },
            twitter: { type: String, default: "" },
            linkedin: { type: String, default: "" },
        },
    },
    aboutPage: {
        mission: {
            badge: { type: String, default: "Our Mission" },
            title: { type: String, default: "Redefining modern luxury for everyone." },
            description: { type: String, default: "We believe that style shouldn't come at the cost of sustainability or accessibility. Our goal is to create timeless pieces that empower you to express your unique self." },
            bgImage: { type: String, default: "https://images.unsplash.com/photo-1529333446532-8180249c56b0?q=80&w=2600&auto=format&fit=crop" },
        },
        story: {
            title: { type: String, default: "Our Journey" },
            timeline: [{
                year: { type: String, default: "" },
                title: { type: String, default: "" },
                description: { type: String, default: "" },
            }],
        },
        values: [{
            title: { type: String, default: "" },
            description: { type: String, default: "" },
            iconName: { type: String, default: "Leaf" },
        }],
        team: {
            title: { type: String, default: "Meet the Team" },
            subtitle: { type: String, default: "The creative minds behind the brand." },
            members: [{
                name: { type: String, default: "" },
                role: { type: String, default: "" },
                image: { type: String, default: "" },
            }],
        },
    },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
