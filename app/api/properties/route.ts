import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(req: Request) {
    logger.info(`GET /api/properties - Fetching properties`);
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query: Record<string, any> = {};

        const title = searchParams.get('title');
        const location = searchParams.get('location');
        const type = searchParams.get('type');

        if (title) query.title = { $regex: title, $options: 'i' };
        if (location) query.location = { $regex: location, $options: 'i' };
        if (type && type !== 'All Types') query.propertyType = type;

        const properties = await Property.find(query).sort({ createdAt: -1 });
        logger.info(`GET /api/properties - Fetched ${properties.length} properties`);

        return NextResponse.json(properties);
    } catch (error) {
        logger.error(`GET /api/properties - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    logger.info(`POST /api/properties - Creating property`);
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            logger.warn(`POST /api/properties - Unauthorized`);
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        logger.info(`POST /api/properties - Payload: ${JSON.stringify(body)}`);

        const property = await Property.create(body);
        logger.info(`POST /api/properties - Property created: ${property._id}`);

        return NextResponse.json(property, { status: 201 });
    } catch (error) {
        logger.error(`POST /api/properties - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const data = await req.json();
        const { id, isActive } = data;

        if (!id || isActive === undefined) {
            return NextResponse.json({ error: 'Missing id or isActive status' }, { status: 400 });
        }

        await dbConnect();

        const updatedProperty = await Property.findByIdAndUpdate(
            id,
            { isActive },
            { new: true }
        );

        if (!updatedProperty) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Property updated', property: updatedProperty });

    } catch (error) {
        console.error('Error updating property:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
