import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        await connectToDatabase();
        const { email, password, name } = await req.json();

        const hashedPassword = await bcrypt.hash(password, 10);

        // Use findOneAndUpdate with upsert to avoid duplicates
        const admin = await Admin.findOneAndUpdate(
            { email },
            {
                email,
                password: hashedPassword,
                name
            },
            { upsert: true, new: true }
        );

        return NextResponse.json({ message: 'Admin seeded/updated successfully', email: admin.email });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json({ message: 'Error seeding admin' }, { status: 500 });
    }
}
