import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import DesignOrder from "@/models/DesignOrder";
import { cookies } from "next/headers";
import { isAdmin } from "@/lib/auth";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-this";

async function getUserId() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return null;
        const decoded: any = jwt.verify(token, JWT_SECRET);
        return decoded.userId;
    } catch {
        return null;
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const isAdminUser = await isAdmin();
        const body = await req.json();

        let filter: any = { _id: params.id };

        if (!isAdminUser) {
            const userId = await getUserId();
            if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            filter.userId = userId;
        }

        const design = await DesignOrder.findOneAndUpdate(
            filter,
            { $set: body },
            { new: true }
        );

        if (!design) {
            return NextResponse.json({ message: "Design not found or no permission" }, { status: 404 });
        }

        return NextResponse.json(design);
    } catch (error) {
        console.error("Update design error:", error);
        return NextResponse.json({ message: "Error updating design" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const isAdminUser = await isAdmin();

        let filter: any = { _id: params.id };

        if (!isAdminUser) {
            const userId = await getUserId();
            if (!userId) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
            filter.userId = userId;
        }

        const design = await DesignOrder.findOneAndDelete(filter);

        if (!design) {
            return NextResponse.json({ message: "Design not found or no permission" }, { status: 404 });
        }

        return NextResponse.json({ message: "Design deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting design" }, { status: 500 });
    }
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDatabase();
        const design = await DesignOrder.findById(params.id).populate("blankProduct");
        if (!design) {
            return NextResponse.json({ message: "Design not found" }, { status: 404 });
        }
        return NextResponse.json(design);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching design" }, { status: 500 });
    }
}
