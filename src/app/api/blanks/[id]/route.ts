import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import BlankProduct from "@/models/BlankProduct";
import { isAdmin } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await connectToDatabase();
        const { id } = await params;
        const product = await BlankProduct.findById(id).populate("category", "name");
        if (!product) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }
        return NextResponse.json(product);
    } catch (error) {
        return NextResponse.json({ message: "Error fetching blank product" }, { status: 500 });
    }
}

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const { id } = await params;
        const body = await req.json();
        const updated = await BlankProduct.findByIdAndUpdate(id, body, { new: true, runValidators: false });
        if (!updated) return NextResponse.json({ message: "Not found" }, { status: 404 });
        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ message: "Error updating blank product" }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const { id } = await params;
        await BlankProduct.findByIdAndDelete(id);
        return NextResponse.json({ message: "Deleted" });
    } catch (error) {
        return NextResponse.json({ message: "Error deleting blank product" }, { status: 500 });
    }
}
