import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

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

export async function POST(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { items, totalAmount, shippingAddress, paymentMethod } = body;

        await connectToDatabase();

        const newOrder = await Order.create({
            userId,
            items,
            totalAmount,
            shippingAddress,
            paymentMethod,
            status: "confirmed"
        });

        // Clear user's cart after successful order
        await User.findByIdAndUpdate(userId, { cart: [] });

        return NextResponse.json({ message: "Order created successfully", order: newOrder }, { status: 201 });
    } catch (error) {
        console.error("Create order error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Fetch client orders error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
