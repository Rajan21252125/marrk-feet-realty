import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { authOptions } from '@/lib/auth';
import bcrypt from 'bcrypt';
import logger from '@/lib/logger';

export async function GET() {
    logger.info(`GET /api/admin/settings - Fetching settings`);
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            logger.warn(`GET /api/admin/settings - Unauthorized`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Fetch current admin details
        const currentAdmin = await Admin.findOne({ email: session.user.email }).select('-passwordHash');

        // Fetch all admins for the list
        const allAdmins = await Admin.find({}).select('email name profileImage role isVerified createdAt');

        logger.info(`GET /api/admin/settings - Settings fetched for ${session.user.email}`);
        return NextResponse.json({
            profile: currentAdmin,
            admins: allAdmins,
        });
    } catch (error) {
        logger.error(`GET /api/admin/settings - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    logger.info(`PUT /api/admin/settings - Updating profile`);
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            logger.warn(`PUT /api/admin/settings - Unauthorized`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { name, companyName, profileImage, password } = data;

        await dbConnect();

        const updateData: any = {};
        if (name !== undefined) updateData.name = name;
        if (companyName !== undefined) updateData.companyName = companyName;
        if (profileImage !== undefined) updateData.profileImage = profileImage;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            updateData.passwordHash = await bcrypt.hash(password, salt);

            // Security: Invalidate session and require re-verification
            updateData.isVerified = false;
            updateData.verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
            // We need to fetch the current doc to increment sessionVersion safely or just use $inc
            // But since we are doing findOneAndUpdate below, we can't easily reference current value in $set for sessionVersion if not using $inc.
            // Let's use $inc for sessionVersion in the update call, or fetch first. 
            // Actually, we can use $inc in the same update operation.
        }

        const updateOps: any = { $set: updateData };
        if (password) {
            updateOps.$inc = { sessionVersion: 1 };
        }

        const updatedAdmin = await Admin.findOneAndUpdate(
            { email: session.user.email },
            updateOps,
            { new: true }
        ).select('-passwordHash');

        logger.info(`PUT /api/admin/settings - Profile updated for ${session.user.email}. Password changed: ${!!password}`);

        // Return a flag indicating if re-auth is needed
        return NextResponse.json({
            message: 'Profile updated',
            admin: updatedAdmin,
            reAuthRequired: !!password
        });
    } catch (error) {
        logger.error(`PUT /api/admin/settings - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    logger.info(`POST /api/admin/settings - Adding new admin`);
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            logger.warn(`POST /api/admin/settings - Unauthorized`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { email, password } = data;

        if (!email || !password) {
            return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
        }

        await dbConnect();

        // Check 5 admin limit
        const adminCount = await Admin.countDocuments({});
        if (adminCount >= 5) {
            logger.warn(`POST /api/admin/settings - Admin limit reached`);
            return NextResponse.json({ error: 'Admin limit reached (5 max)' }, { status: 403 });
        }

        // Check availability
        const existing = await Admin.findOne({ email });
        if (existing) {
            return NextResponse.json({ error: 'Admin already exists' }, { status: 400 });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Generate verification code
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

        const newAdmin = await Admin.create({
            email,
            passwordHash,
            role: 'admin',
            isVerified: false,
            verificationCode,
        });

        logger.info(`POST /api/admin/settings - New admin added: ${newAdmin.email}`);
        return NextResponse.json({ message: 'Admin added', admin: { email: newAdmin.email } });
    } catch (error) {
        logger.error(`POST /api/admin/settings - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
