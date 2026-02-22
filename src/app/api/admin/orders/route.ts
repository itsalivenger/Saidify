import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

async function isAdmin() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return false;
    try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.role === "admin";
    } catch (error) {
        return false;
    }
}

export async function GET(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        await connectToDatabase();

        let query = {};
        if (userId) {
            query = { userId };
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });

        return NextResponse.json(orders);
    } catch (error) {
        console.error("Fetch orders error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
