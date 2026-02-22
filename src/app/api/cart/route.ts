import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Helper to get authenticated user ID
async function getUserId() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return null;

    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch (error) {
        return null;
    }
}

export async function GET(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ cart: user.cart }, { status: 200 });
    } catch (error) {
        console.error("Cart GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// Update entire cart (Sync)
export async function PUT(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { cart } = body;

        await connectToDatabase();
        const user = await User.findByIdAndUpdate(
            userId,
            { cart: cart },
            { new: true }
        );

        return NextResponse.json({ message: "Cart updated", cart: user.cart }, { status: 200 });
    } catch (error) {
        console.error("Cart PUT error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

// Add/Update single item (Incremental)
export async function POST(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { item } = await req.json();
        await connectToDatabase();
        const user = await User.findById(userId);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if item exists in cart
        const existingItemIndex = user.cart.findIndex(
            (cartItem: any) =>
                String(cartItem.productId) === String(item.productId) &&
                cartItem.selectedSize === item.selectedSize &&
                cartItem.selectedColor === item.selectedColor
        );

        if (existingItemIndex > -1) {
            // Update quantity
            user.cart[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            user.cart.push(item);
        }

        await user.save();

        return NextResponse.json({ message: "Item added", cart: user.cart }, { status: 200 });
    } catch (error) {
        console.error("Cart POST error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
