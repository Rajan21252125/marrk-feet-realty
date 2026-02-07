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

        const body = await req.json();
        const { paramsToSign } = body;

        const signature = cloudinary.utils.api_sign_request(
            paramsToSign,
            process.env.CLOUDINARY_API_SECRET as string
        );

        logger.info('POST /api/admin/sign-cloudinary - Signature generated');
        return NextResponse.json({ signature });

    } catch (error) {
        logger.error(`POST /api/admin/sign-cloudinary - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
