import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    rating: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        trim: true
    },
    stock: {
        type: Number,
        default: 0
    },
    sizes: {
        type: [String],
        default: []
    },
    colors: {
        type: [{
            name: String,
            value: String
        }],
        default: []
    },
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isNewArrival: {
        type: Boolean,
        default: false
    },
    featured: {
        type: Boolean,
        default: false
    },
    // Integration with Custom Designer
    isBlank: {
        type: Boolean,
        default: false
    },
    designOrderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DesignOrder',
        required: false
    },
    blankProductId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BlankProduct',
        required: false
    }
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model('Product', ProductSchema);
