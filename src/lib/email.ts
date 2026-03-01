import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
        user: process.env.EMAIL_USER?.replace(/'/g, ''),
        pass: process.env.EMAIL_PASS?.replace(/'/g, ''),
    },
});

interface SendEmailOptions {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
}

export async function sendEmail({ to, subject, html, text }: SendEmailOptions) {
    const from = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM_ADDRESS}>`;
    const info = await transporter.sendMail({ from, to, subject, html, text });
    return info;
}

export default transporter;
