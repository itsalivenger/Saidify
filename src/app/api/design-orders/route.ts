import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import DesignOrder from "@/models/DesignOrder";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

async function getCurrentUser() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return null;
        return jwt.verify(token, JWT_SECRET) as any;
    } catch {
        return null;
    }
}

// GET: list design orders for the current user (or all if admin authenticated)
export async function GET() {
    try {
        await connectToDatabase();
        const isAdminUser = await isAdmin();
        let filter = {};

        if (!isAdminUser) {
            const user = await getCurrentUser();
            if (!user) return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
            filter = { userId: user.userId };
        }

        const orders = await DesignOrder.find(filter)
            .populate("blankProduct", "name views")
            .populate("userId", "name email")
            .sort({ createdAt: -1 });
        return NextResponse.json(orders);
    } catch (error) {
        console.error("Fetch design orders error:", error);
        return NextResponse.json({ message: "Error fetching design orders" }, { status: 500 });
    }
}

// POST: save/create a design order (draft or submit)
export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const user = await getCurrentUser();
        const body = await req.json();
        const order = await DesignOrder.create({
            ...body,
            userId: user?.userId || null,
        });
        return NextResponse.json(order, { status: 201 });
    } catch (error) {
        console.error("Create design order error:", error);
        return NextResponse.json({ message: "Error creating design order" }, { status: 500 });
    }
}
