import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Subscriber from '@/models/Subscriber';

// POST /api/newsletter — subscribe
export async function POST(req: Request) {
    try {
        const { email, name } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
        }

        await connectToDatabase();

        const existing = await Subscriber.findOne({ email: email.toLowerCase() });
        if (existing) {
            if (!existing.active) {
                existing.active = true;
                await existing.save();
                return NextResponse.json({ message: 'Welcome back! You are now re-subscribed.' });
            }
            return NextResponse.json({ message: 'You are already subscribed!' }, { status: 409 });
        }

        await Subscriber.create({ email: email.toLowerCase(), name });

        return NextResponse.json({ message: 'Successfully subscribed to the newsletter! 🎉' });
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// GET /api/newsletter — list subscribers (admin only)
export async function GET(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        await connectToDatabase();
        const subscribers = await Subscriber.find({}).sort({ subscribedAt: -1 });
        return NextResponse.json(subscribers);
    } catch (error) {
        console.error('Newsletter list error:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// PATCH /api/newsletter — update subscriber (unsubscribe/reactivate)
export async function PATCH(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id, active } = await req.json();
        await connectToDatabase();

        const subscriber = await Subscriber.findByIdAndUpdate(id, { active }, { new: true });
        if (!subscriber) return NextResponse.json({ message: 'Subscriber not found' }, { status: 404 });

        return NextResponse.json(subscriber);
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

// DELETE /api/newsletter — remove subscriber
export async function DELETE(req: Request) {
    try {
        const authHeader = req.headers.get('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await req.json();
        await connectToDatabase();

        await Subscriber.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Subscriber removed' });
    } catch (error) {
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
