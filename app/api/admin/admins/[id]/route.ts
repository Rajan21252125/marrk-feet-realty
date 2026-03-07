import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const superAdminEmail = process.env.SUPER_ADMIN_EMAIL;
        if (!superAdminEmail) {
            return NextResponse.json(
                { error: 'Server misconfigured: SUPER_ADMIN_EMAIL is missing.' },
                { status: 500 }
            );
        }

        // Only super admin can delete other admins
        if (session.user.email.toLowerCase() !== superAdminEmail.toLowerCase()) {
            return NextResponse.json({ error: 'Only the super admin can delete admins.' }, { status: 403 });
        }

        await dbConnect();

        // Prevent deleting the last admin and prevent super-admin self-deletion.
        const adminCount = await Admin.countDocuments();
        if (adminCount <= 1) {
            return NextResponse.json({ error: 'Cannot delete the last admin account.' }, { status: 400 });
        }

        const targetAdmin = await Admin.findById(id).select('email');
        if (!targetAdmin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }
        if (targetAdmin.email?.toLowerCase() === session.user.email.toLowerCase()) {
            return NextResponse.json({ error: 'You cannot delete your own admin account.' }, { status: 400 });
        }

        const deletedAdmin = await Admin.findByIdAndDelete(id);

        if (!deletedAdmin) {
            return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Admin deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
