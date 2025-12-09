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
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        cart: [
            {
                productId: { type: Number, required: true },
                title: { type: String, required: true },
                price: { type: String, required: true },
                image: { type: String },
                quantity: { type: Number, default: 1 },
                selectedSize: { type: String },
                selectedColor: { type: String },
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
