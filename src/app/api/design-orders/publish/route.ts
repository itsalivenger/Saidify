import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Product from "@/models/Product";
import DesignOrder from "@/models/DesignOrder";
import { isAdmin } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        await connectToDatabase();
        const body = await req.json();
        const { blankProductId, selectedVariant, fabricState, thumbnail, price, title, description } = body;

        // Create a DesignOrder first to store the technical details (layers)
        // This allows us to re-edit or track the design even after it's a product
        const design = await DesignOrder.create({
            blankProduct: blankProductId,
            selectedVariant,
            fabricState,
            thumbnail,
            status: "draft", // It's a shop reference design
            totalPrice: price,
        });

        // Now create the standard Product for the shop
        const product = await Product.create({
            title: title || "Custom Designed Product",
            description: description || "Exclusive design by our team.",
            price: price,
            image: thumbnail,
            category: "Custom Designs", // Or a default category
            stock: 99, // Designed items usually have high virtual stock
            isBlank: false,
            designOrderId: design._id,
            blankProductId: blankProductId,
            colors: [{ name: selectedVariant.color, value: selectedVariant.colorHex }],
            sizes: ["S", "M", "L", "XL"], // Default sizes for published items
        });

        return NextResponse.json({ product, design }, { status: 201 });
    } catch (error) {
        console.error("Publish design error:", error);
        return NextResponse.json({ message: "Error publishing design" }, { status: 500 });
    }
}
