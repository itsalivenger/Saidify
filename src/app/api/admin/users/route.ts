import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import User from "@/models/User";
import { isAdmin } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        if (!(await isAdmin())) {
            console.log("Admin check failed in GET /api/admin/users");
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();

        // Fetch users who are NOT admins, excluding their passwords
        const users = await User.find({ role: { $ne: "admin" } }).select("-password").sort({ createdAt: -1 });

        return NextResponse.json(users);
    } catch (error) {
        console.error("Fetch users error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
