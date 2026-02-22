import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import Product from "@/models/Product";

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

export async function GET() {
    try {
        const userId = await getUserId();
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        await connectToDatabase();
        const user = await User.findById(userId).populate("wishlist");
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        return NextResponse.json({ wishlist: user.wishlist }, { status: 200 });
    } catch (error) {
        console.error("Wishlist GET error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const userId = await getUserId();
        if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

        const { productId } = await req.json();
        await connectToDatabase();
        const user = await User.findById(userId);
        if (!user) return NextResponse.json({ message: "User not found" }, { status: 404 });

        // Ensure wishlist exists
        if (!user.wishlist) user.wishlist = [];

        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            user.wishlist.splice(index, 1);
        } else {
            user.wishlist.push(productId);
        }

        await user.save();
        return NextResponse.json({ message: "Wishlist updated", wishlist: user.wishlist }, { status: 200 });
    } catch (error) {
        console.error("Wishlist POST error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
