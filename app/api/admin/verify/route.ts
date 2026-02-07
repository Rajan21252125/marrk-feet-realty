import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import logger from '@/lib/logger';

export async function POST(req: Request) {
    try {
        const { email, code } = await req.json();

        if (!email || !code) {
            return NextResponse.json({ error: 'Email and code required' }, { status: 400 });
        }

        await dbConnect();

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        if (admin.isVerified) {
            return NextResponse.json({ message: 'Already verified' });
        }

        if (admin.verificationCode !== code) {
            logger.warn(`Verification failed for ${email}: Invalid code`);
            return NextResponse.json({ error: 'Invalid verification code' }, { status: 400 });
        }

        admin.isVerified = true;
        admin.verificationCode = undefined; // Clear code after use
        await admin.save();

        logger.info(`Admin verified: ${email}`);
        return NextResponse.json({ message: 'Verification successful' });

    } catch (error) {
        logger.error(`Error verifying admin: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
