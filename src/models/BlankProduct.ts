import mongoose from "mongoose";

const PrintZoneSchema = new mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    x: { type: Number, required: true },       // % from left
    y: { type: Number, required: true },       // % from top
    width: { type: Number, required: true },   // % of image width
    height: { type: Number, required: true },  // % of image height
    maxLayers: { type: Number, default: 5 },
    locked: { type: Boolean, default: false }, // if true, design is pinned to zone center
}, { _id: false });

const ProductViewSchema = new mongoose.Schema({
    name: { type: String, required: true },          // "Front", "Back", "Left Sleeve"
    mockupImage: { type: String, default: "" },      // Cloudinary URL
    printZones: { type: [PrintZoneSchema], default: [] },
}, { _id: false });

const VariantSchema = new mongoose.Schema({
    color: { type: String, required: true },
    colorHex: { type: String, default: "#FFFFFF" },
    sizes: { type: [String], default: ["S", "M", "L", "XL"] },
    available: { type: Boolean, default: true },
}, { _id: false });

const BlankProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, default: "" },
    basePrice: { type: Number, required: true, min: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },
    tags: { type: [String], default: [] },
    variants: { type: [VariantSchema], default: [] },
    views: { type: [ProductViewSchema], default: [] },
    allowText: { type: Boolean, default: true },
    allowMultipleZones: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.BlankProduct || mongoose.model("BlankProduct", BlankProductSchema);
