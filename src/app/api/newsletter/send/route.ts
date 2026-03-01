import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Subscriber from '@/models/Subscriber';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { subject, body, recipientType, selectedEmails } = await req.json();

        if (!subject || !body) {
            return NextResponse.json({ message: 'Subject and body are required' }, { status: 400 });
        }

        await connectToDatabase();

        let recipients: string[] = [];

        if (recipientType === 'selected' && Array.isArray(selectedEmails) && selectedEmails.length > 0) {
            recipients = selectedEmails;
        } else {
            // Send to all active subscribers
            const subscribers = await Subscriber.find({ active: true });
            recipients = subscribers.map((s) => s.email);
        }

        if (recipients.length === 0) {
            return NextResponse.json({ message: 'No recipients found' }, { status: 400 });
        }

        // Build HTML email
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${subject}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #0a0a0a;">
            <div style="max-width: 600px; margin: 32px auto; background: #111; border-radius: 24px; overflow: hidden; border: 1px solid #222;">
                <!-- Header -->
                <div style="background: linear-gradient(135deg, #7c3aed, #4f46e5); padding: 40px 40px 32px; text-align: center;">
                    <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 900; letter-spacing: -1px;">
                        ${process.env.EMAIL_FROM_NAME || 'Newsletter'}
                    </h1>
                </div>
                <!-- Body -->
                <div style="padding: 40px; color: #e5e5e5; line-height: 1.7; font-size: 16px;">
                    ${body.replace(/\n/g, '<br>')}
                </div>
                <!-- Footer -->
                <div style="background: #0a0a0a; padding: 24px 40px; text-align: center; border-top: 1px solid #222;">
                    <p style="margin: 0; color: #666; font-size: 12px;">
                        © ${new Date().getFullYear()} ${process.env.EMAIL_FROM_NAME}. All rights reserved.
                    </p>
                    <p style="margin: 8px 0 0; color: #444; font-size: 11px;">
                        You are receiving this because you subscribed to our newsletter.
                    </p>
                </div>
            </div>
        </body>
        </html>
        `;

        // Send emails (batched so we don't hit rate limits)
        let sentCount = 0;
        let failedCount = 0;

        for (const email of recipients) {
            try {
                await sendEmail({ to: email, subject, html });
                sentCount++;
            } catch (err) {
                console.error(`Failed to send to ${email}:`, err);
                failedCount++;
            }
        }

        return NextResponse.json({
            message: `Campaign sent! ${sentCount} delivered, ${failedCount} failed.`,
            sentCount,
            failedCount,
        });
    } catch (error) {
        console.error('Newsletter send error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
