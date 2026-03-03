import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';

export async function POST(req: Request) {
    logger.info('POST /api/admin/sign-cloudinary - Generating signature');
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            logger.warn('POST /api/admin/sign-cloudinary - Unauthorized');
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json().catch(() => null);
        const paramsToSign = body?.paramsToSign;
        if (!paramsToSign || typeof paramsToSign !== 'object' || Array.isArray(paramsToSign)) {
            return NextResponse.json({ error: 'Invalid paramsToSign payload' }, { status: 400 });
        }

        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        if (!apiSecret) {
            logger.error('POST /api/admin/sign-cloudinary - CLOUDINARY_API_SECRET is not set');
            return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
        }

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            apiSecret
        );

        logger.info('POST /api/admin/sign-cloudinary - Signature generated');
        return NextResponse.json({ signature });

    } catch (error) {
        logger.error(`POST /api/admin/sign-cloudinary - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
