import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Order from "@/models/Order";
import { isAdmin } from "@/lib/auth";

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
