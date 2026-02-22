import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";
import { isAdmin } from "@/lib/auth";

// Public endpoint — storefront components use this
export async function GET() {
    try {
        await connectToDatabase();
        // Always work with a single document — create if not exists
        let settings = await SiteSettings.findOne().lean();
        if (!settings) {
            const newSettings = await SiteSettings.create({});
            settings = newSettings.toObject();
        }

        // Ensure mainSettings and socialLinks exist for frontend stability
        if (!settings.mainSettings) {
            settings.mainSettings = {
                siteName: "Said Store",
                logo: "",
                contactEmail: "",
                contactPhone: "",
                address: "",
                socialLinks: { facebook: "", instagram: "", twitter: "", linkedin: "" }
            };
        } else if (!settings.mainSettings.socialLinks) {
            settings.mainSettings.socialLinks = {
                facebook: "",
                instagram: "",
                twitter: "",
                linkedin: ""
            };
        }

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Fetch settings error:", error);
        return NextResponse.json({ message: "Error fetching settings" }, { status: 500 });
    }
}

// Admin-only: Update the settings document
export async function PUT(req: Request) {
    try {
        if (!(await isAdmin())) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        await connectToDatabase();
        const body = await req.json();
        console.log("Saving settings update:", JSON.stringify(body, null, 2));

        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({});
        }

        // Explicitly set each field to handle dot notation correctly in Mongoose
        Object.keys(body).forEach(key => {
            settings.set(key, body[key]);
        });

        await settings.save();
        console.log("Updated Social Links in DB:", JSON.stringify(settings?.mainSettings?.socialLinks, null, 2));

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Update settings error:", error);
        return NextResponse.json({ message: "Error updating settings" }, { status: 500 });
    }
}
