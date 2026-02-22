import mongoose from "mongoose";

const LayerSchema = new mongoose.Schema({
    type: { type: String, enum: ["image", "text"], required: true },
    src: { type: String, default: "" },
    text: { type: String, default: "" },
    fontFamily: { type: String, default: "Inter" },
    fontSize: { type: Number, default: 40 },
    fill: { type: String, default: "#000000" },
    bold: { type: Boolean, default: false },
    italic: { type: Boolean, default: false },
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
    scaleX: { type: Number, default: 1 },
    scaleY: { type: Number, default: 1 },
    angle: { type: Number, default: 0 },
    flipX: { type: Boolean, default: false },
    flipY: { type: Boolean, default: false },
    opacity: { type: Number, default: 1 },
}, { _id: false });

const DesignZoneSchema = new mongoose.Schema({
    viewName: { type: String, required: true },
    zoneId: { type: String, required: true },
    zoneLabel: { type: String, default: "" },
    layers: { type: [LayerSchema], default: [] },
    previewImage: { type: String, default: "" }, // composite snapshot
}, { _id: false });

const DesignOrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
    blankProduct: { type: mongoose.Schema.Types.ObjectId, ref: "BlankProduct", required: true },
    selectedVariant: {
        color: { type: String, default: "" },
        colorHex: { type: String, default: "#ffffff" },
        size: { type: String, default: "M" },
    },
    designs: { type: [DesignZoneSchema], default: [] },
    fabricState: { type: String, default: "" }, // Full Fabric.js JSON for re-editing
    thumbnail: { type: String, default: "" },   // composite preview for cart
    status: {
        type: String,
        enum: ["draft", "pending", "in_production", "shipped", "delivered", "cancelled"],
        default: "draft",
    },
    totalPrice: { type: Number, default: 0 },
    notes: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.models.DesignOrder || mongoose.model("DesignOrder", DesignOrderSchema);
