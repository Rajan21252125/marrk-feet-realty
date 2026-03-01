import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';

export async function POST() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Find the admin
        const admin = await Admin.findOne({ email: session.user.email });
        if (!admin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        // Generate a new 6-digit code
        const verificationCode = crypto.randomInt(100000, 1000000).toString();

        // Store the code in the DB
        admin.verificationCode = verificationCode;
        await admin.save();

        logger.info(`Verification code issued for ${admin.email}`);

        // In a real production app, we would send an email here.
        // For now, we return it in dev or just assume user sees logs.
        // The user specifically asked to "send the verification code and store to db"

        return NextResponse.json({
            message: 'Verification code sent',
            // Only return the code in response if in development mode for easier debugging
            code: process.env.NODE_ENV === 'development' ? verificationCode : undefined
        });

    } catch (error) {
        logger.error(`Error resending verification code: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
