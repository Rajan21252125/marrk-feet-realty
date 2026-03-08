import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import logger from '@/lib/logger';
import bcrypt from 'bcrypt';
import { sendVerificationEmail } from '@/lib/email';
import crypto from 'node:crypto';
import { authOptions } from '@/lib/auth';

const MASTER_KEY = process.env.ADMIN_CREATION_SECRET;
const SUPER_ADMIN = process.env.SUPER_ADMIN_EMAIL;

const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (!local || !domain) return '***';
    return `${local.slice(0, 2)}***@${domain}`;
};

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!MASTER_KEY || !SUPER_ADMIN) {
            logger.error('Admin creation failed: ADMIN_CREATION_SECRET or SUPER_ADMIN_EMAIL is not set in environment.');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        // Check permissions: Must be super admin if a session exists
        if (session && session.user?.email?.toLowerCase() !== SUPER_ADMIN.toLowerCase()) {
            logger.warn(`Admin creation attempt by non-super admin: ${maskEmail(session.user?.email || 'unknown')}`);
            return NextResponse.json({ error: 'Only the super admin can create new accounts' }, { status: 403 });
        }

        const { masterKey, email, password } = await req.json();

        if (!masterKey || masterKey !== MASTER_KEY) {
            logger.warn(`Admin creation failed: Invalid master key`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!email || !password) {
            logger.warn(`Admin creation failed: Missing email or password`);
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        // bcrypt has a 72-byte limit for passwords
        if (Buffer.byteLength(password, 'utf8') > 72) {
            logger.warn(`Admin creation failed: Password too long (max 72 bytes) for ${email}`);
            return NextResponse.json({ error: 'Password is too long' }, { status: 400 });
        }

        await dbConnect();

        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            logger.warn(`Admin creation failed: Admin already exists`);
            return NextResponse.json({ error: 'Admin already exists' }, { status: 409 });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        // Generate a simple 6-digit code for verification
        const verificationCode = crypto.randomInt(100000, 1000000).toString();

        const newAdmin = await Admin.create({
            email,
            passwordHash,
            isVerified: false,
            verificationCode,
        });

        logger.info(`New admin created: ${maskEmail(email)} (Unverified)`);

        let emailSent = true;
        try {
            await sendVerificationEmail(email, verificationCode);
        } catch (emailError) {
            emailSent = false;
            logger.error(`Admin created but verification email failed for ${maskEmail(email)}: ${emailError}`);
        }

        return NextResponse.json({
            message: emailSent
                ? 'Admin created successfully. Please verify your account.'
                : 'Admin created, but verification email could not be sent. Please retry resend verification.',
            verificationCode: process.env.NODE_ENV === 'development' ? verificationCode : undefined
        }, { status: 201 });

    } catch (error) {
        logger.error(`Error creating admin: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
