import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import logger from '@/lib/logger';
import bcrypt from 'bcrypt';

const MASTER_KEY = process.env.ADMIN_CREATION_SECRET || 'dev_secret_key';

export async function POST(req: Request) {
    try {
        const { masterKey, email, password } = await req.json();

        if (masterKey !== MASTER_KEY) {
            logger.warn(`Admin creation failed: Invalid master key`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        await dbConnect();

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return NextResponse.json({ error: 'Admin already exists' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        // Generate a simple 6-digit code for verification
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newAdmin = await Admin.create({
            email,
            passwordHash,
            isVerified: false,
            verificationCode,
        });

        logger.info(`New admin created: ${email} (Unverified)`);

        // In production, send email with code here.
        // For dev, return the code in response or log it.
        logger.info(`Verification Code for ${email}: ${verificationCode}`);

        return NextResponse.json({
            message: 'Admin created successfully. Please verify your account.',
            verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
        }, { status: 201 });

    } catch (error) {
        logger.error(`Error creating admin: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
