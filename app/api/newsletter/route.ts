import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Newsletter from '@/models/Newsletter';
import { rateLimit } from '@/lib/rate-limit';
import { sanitize } from '@/lib/sanitization';

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const { success } = rateLimit(ip, 5, 60000); // 5 requests per minute

        if (!success) {
            return NextResponse.json(
                { error: 'Too many requests. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { email } = sanitize(body);

        if (!email || !email.includes('@')) {
            return NextResponse.json(
                { error: 'Invalid email address' },
                { status: 400 }
            );
        }

        await dbConnect();

        // Check if already subscribed
        const existingSubscription = await Newsletter.findOne({ email });
        if (existingSubscription) {
            return NextResponse.json(
                { message: 'You are already subscribed!' },
                { status: 200 }
            );
        }

        await Newsletter.create({ email });

        return NextResponse.json(
            { message: 'Successfully subscribed to newsletter!' },
            { status: 201 }
        );

    } catch (error: any) {
        console.error('Newsletter subscription error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
