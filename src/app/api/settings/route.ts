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

        // Ensure aboutPage structure exists for stability
        if (!settings.aboutPage) {
            settings.aboutPage = {
                mission: { badge: "Our Mission", title: "Redefining modern luxury for everyone.", description: "We believe that style shouldn't come at the cost of sustainability or accessibility.", bgImage: "" },
                story: { title: "Our Journey", timeline: [] },
                values: [],
                team: { title: "Meet the Team", subtitle: "The creative minds behind the brand.", members: [] }
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

        // Use findOneAndUpdate with $set to handle both flat objects and dot-notation keys
        const settings = await SiteSettings.findOneAndUpdate(
            {},
            { $set: body },
            { new: true, upsert: true, runValidators: false }
        );

        console.log("Updated Social Links in DB:", JSON.stringify(settings?.mainSettings?.socialLinks, null, 2));

        return NextResponse.json(settings);
    } catch (error) {
        console.error("Update settings error:", error);
        return NextResponse.json({ message: "Error updating settings" }, { status: 500 });
    }
}
