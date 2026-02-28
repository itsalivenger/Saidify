import mongoose from "mongoose";

const LocalizedString = {
    en: { type: String, default: "" },
    fr: { type: String, default: "" },
    ar: { type: String, default: "" }
};

const TestimonialSchema = new mongoose.Schema({
    author: { type: String, default: "" },
    role: LocalizedString,
    content: LocalizedString,
    rating: { type: Number, default: 5 },
});

const SiteSettingsSchema = new mongoose.Schema({
    homepage: {
        hero: {
            badge: LocalizedString,
            title: LocalizedString,
            subtitle: LocalizedString,
            image: { type: String, default: "" },
            ctaPrimary: LocalizedString,
            ctaSecondary: LocalizedString,
        },
        promoBanner: {
            title: LocalizedString,
            subtitle: LocalizedString,
            description: LocalizedString,
            image: { type: String, default: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=2574&auto=format&fit=crop" },
            ctaText: LocalizedString,
            active: { type: Boolean, default: true },
        },
        newsletter: {
            title: LocalizedString,
            subtitle: LocalizedString,
        },
        testimonials: {
            type: [TestimonialSchema],
            default: []
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
            badge: LocalizedString,
            title: LocalizedString,
            description: LocalizedString,
            bgImage: { type: String, default: "https://images.unsplash.com/photo-1529333446532-8180249c56b0?q=80&w=2600&auto=format&fit=crop" },
        },
        story: {
            title: LocalizedString,
            timeline: [{
                year: { type: String, default: "" },
                title: LocalizedString,
                description: LocalizedString,
            }],
        },
        values: [{
            title: LocalizedString,
            description: LocalizedString,
            iconName: { type: String, default: "Leaf" },
        }],
        team: {
            title: LocalizedString,
            subtitle: LocalizedString,
            members: [{
                name: { type: String, default: "" },
                role: LocalizedString,
                image: { type: String, default: "" },
            }],
        },
    },
}, { timestamps: true });

export default mongoose.models.SiteSettings || mongoose.model("SiteSettings", SiteSettingsSchema);
