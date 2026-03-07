import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import { authOptions } from '@/lib/auth';
import logger from '@/lib/logger';
import { rateLimit } from '@/lib/rate-limit';
import { sanitize } from '@/lib/sanitization';
import { sendInquiryNotification } from '@/lib/email';

export async function GET() {
    logger.info(`GET /api/messages - Fetching messages`);
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            logger.warn(`GET /api/messages - Unauthorized access attempt`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();

        const messages = await Message.find({}).sort({ createdAt: -1 });
        logger.info(`GET /api/messages - Successfully fetched ${messages.length} messages`);

        return NextResponse.json({ messages });
    } catch (error) {
        logger.error(`GET /api/messages - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    logger.info(`POST /api/messages - Creating new message`);
    try {
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const { success } = rateLimit(ip, 3, 60000); // 3 requests per minute for contact form

        if (!success) {
            logger.warn(`POST /api/messages - Rate limit exceeded for IP: ${ip}`);
            return NextResponse.json(
                { error: 'Too many messages. Please try again later.' },
                { status: 429 }
            );
        }

        const body = await req.json();
        const { name, email, phone, message, propertyId } = sanitize(body);

        if (!name || !message) {
            logger.warn(`POST /api/messages - Validation failed: Missing required fields (name or message)`);
            return NextResponse.json({ error: 'Name and message are required' }, { status: 400 });
        }

        await dbConnect();

        const newMessage = await Message.create({
            name,
            email: email || '', // Optional email
            phone: phone || '', // Optional phone
            message,
            propertyId: propertyId || undefined
        });

        logger.info(`POST /api/messages - Message created successfully: ${newMessage._id}`);

        // Trigger email notification (don't block the response)
        try {
            sendInquiryNotification({
                name: newMessage.name,
                email: newMessage.email,
                phone: newMessage.phone,
                message: newMessage.message,
                propertyId: newMessage.propertyId ? newMessage.propertyId.toString() : undefined
            }).catch(err => logger.error(`[EMAIL ERROR] Email notification failed: ${err}`));
        } catch (emailError) {
            logger.error(`[EMAIL ERROR] Sync error in notification call: ${emailError}`);
        }

        return NextResponse.json({ message: 'Message sent successfully', data: newMessage }, { status: 201 });
    } catch (error) {
        logger.error(`POST /api/messages - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    logger.info(`DELETE /api/messages - Deleting message ${id}`);

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            logger.warn(`DELETE /api/messages - Unauthorized access attempt`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!id) {
            logger.warn(`DELETE /api/messages - Missing ID`);
            return NextResponse.json({ error: 'Message ID required' }, { status: 400 });
        }

        await dbConnect();

        await Message.findByIdAndDelete(id);

        logger.info(`DELETE /api/messages - Message ${id} deleted`);
        return NextResponse.json({ message: 'Message deleted' });
    } catch (error) {
        logger.error(`DELETE /api/messages - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
