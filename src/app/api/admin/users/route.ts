import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

// Simple Admin check
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

        await connectToDatabase();

        // Fetch users, but exclude their hashed passwords for security
        const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
