import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes("@")) {
            return NextResponse.json({ message: "Invalid email address" }, { status: 400 });
        }

        // TODO: Integrate with Mailchimp, SendGrid, or save to database
        console.log("Newsletter subscription request for:", email);

        return NextResponse.json({ message: "Succesfully subscribed to the newsletter!" });
    } catch (error) {
        console.error("Newsletter API error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
