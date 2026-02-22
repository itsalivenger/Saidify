import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import BlankProduct from "@/models/BlankProduct";
import { isAdmin } from "@/lib/auth";

// Public: list active blank products for the design studio
export async function GET(req: Request) {
    try {
        await connectToDatabase();
        const { searchParams } = new URL(req.url);
        const adminView = searchParams.get("admin") === "true";

        const filter = adminView ? {} : { active: true };
        const products = await BlankProduct.find(filter)
            .populate("category", "name")
            .sort({ createdAt: -1 });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Fetch blank products error:", error);
        return NextResponse.json({ message: "Error fetching blank products" }, { status: 500 });
    }
}

// Admin only: create a new blank product
export async function POST(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const body = await req.json();
        const product = await BlankProduct.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Create blank product error:", error);
        return NextResponse.json({ message: "Error creating blank product" }, { status: 500 });
    }
}
