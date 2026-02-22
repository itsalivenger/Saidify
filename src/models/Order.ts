import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                productId: { type: String, required: true },
                title: { type: String, required: true },
                price: { type: String, required: true },
                image: { type: String },
                quantity: { type: Number, required: true },
                selectedSize: { type: String },
                selectedColor: { type: String },
                designOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "DesignOrder" },
            },
        ],
        totalAmount: {
            type: Number,
            required: true,
        },
        shippingAddress: {
            firstName: String,
            lastName: String,
            email: String,
            phone: String,
            address: String,
            city: String,
            zipCode: String,
        },
        status: {
            type: String,
            enum: ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        paymentMethod: {
            type: String,
            required: true,
            default: "card",
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
    },
    { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
