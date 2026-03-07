import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        // Exclude passwordHash and verificationCode
        const admins = await Admin.find({}, '-passwordHash -verificationCode').sort({ createdAt: -1 });

        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
        const adminsWithFlags = admins.map(admin => ({
            ...admin.toObject(),
            isSuperAdmin: admin.email?.toLowerCase() === superAdminEmail?.toLowerCase()
        }));

        return NextResponse.json(adminsWithFlags);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
