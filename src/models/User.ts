import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please provide a name"],
            maxlength: [60, "Name cannot be more than 60 characters"],
        },
        email: {
            type: String,
            required: [true, "Please provide an email"],
            unique: true,
            maxlength: [100, "Email cannot be more than 100 characters"],
        },
        password: {
            type: String,
            required: [true, "Please provide a password"],
        },
        phone: {
            type: String,
            required: [true, "Please provide a phone number"],
            maxlength: [20, "Phone number cannot be more than 20 characters"],
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        cart: [
            {
                productId: { type: String, required: true },
                title: { type: String, required: true },
                price: { type: String, required: true },
                image: { type: String },
                quantity: { type: Number, default: 1 },
                selectedSize: { type: String },
                selectedColor: { type: String },
            },
        ],
        wishlist: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
