import mongoose from 'mongoose';

const LocalizedString = {
    en: { type: String, default: "" },
    fr: { type: String, default: "" },
    ar: { type: String, default: "" }
};

const CategorySchema = new mongoose.Schema({
    name: LocalizedString,
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    active: {
        type: Boolean,
        default: true
    },
    description: LocalizedString,
    image: {
        type: String,
        trim: true
    }
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
