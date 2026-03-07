import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { sanitize } from '@/lib/sanitization';
import { escapeRegex } from '@/lib/utils';

export async function GET(req: Request) {
    logger.info(`GET /api/properties - Fetching properties`);
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const query: Record<string, any> = { isActive: true };

        const title = searchParams.get('title');
        const location = searchParams.get('location');
        const type = searchParams.get('type');
        const listingType = searchParams.get('listingType');
        const bhkType = searchParams.get('bhkType');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const ids = searchParams.get('ids');

        if (title) query.title = { $regex: escapeRegex(title), $options: 'i' };
        if (location) query.location = { $regex: escapeRegex(location), $options: 'i' };

        // listingType can be 'Sale' or 'Rent'
        if (listingType && listingType !== 'All') {
            query.listingType = listingType;
        }

        if (type && type !== 'All' && type !== 'Any Type') {
            query.propertyType = type;
        }

        if (bhkType && bhkType !== 'Any') {
            query.bhkType = bhkType;
        }

        if (minPrice || maxPrice) {
            const hasMin = minPrice !== null;
            const hasMax = maxPrice !== null;
            const min = hasMin ? Number(minPrice) : 0;
            const max = hasMax ? Number(maxPrice) : Number.MAX_SAFE_INTEGER;

            if ((hasMin && !Number.isFinite(min)) || (hasMax && !Number.isFinite(max))) {
                return NextResponse.json({ error: 'Price parameters must be valid numbers' }, { status: 400 });
            }

            if (min > max) {
                return NextResponse.json({ error: 'Minimum price cannot be greater than maximum price' }, { status: 400 });
            }

            if (listingType && listingType !== 'All') {
                query.price = { $gte: min, $lte: max };
            } else {
                // If status is 'All' (no listingType provided), apply listing-specific logic
                // to prevent high 'Buy' budgets (e.g. 50 Lac+) from filtering out all Rent properties.
                // If the min price is high (> 500,000), we treat it as a Scale filter but don't 
                // apply it to Rent category, unless max is also small.
                query.$or = [
                    { listingType: 'Sale', price: { $gte: min, $lte: max } },
                    {
                        listingType: 'Rent',
                        // For rentals, only apply the filter if it's within a reasonable rental range (0-500k)
                        // otherwise match all rentals if the filter is clearly for Sale properties.
                        price: min > 500000 ? { $gte: 0 } : { $gte: min, $lte: max }
                    }
                ];
            }
        }

        if (ids) {
            const idArray = ids
                .split(',')
                .map(id => id.trim())
                .filter(id => /^[a-f\d]{24}$/i.test(id));
            if (idArray.length === 0) {
                return NextResponse.json({ error: 'Invalid ids parameter' }, { status: 400 });
            }
            query._id = { $in: idArray };
        }

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
        const sanitizedBody = sanitize(body);
        logger.info(`POST /api/properties - Payload received`);

        const property = await Property.create(sanitizedBody);
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

        if (!id) {
            return NextResponse.json({ error: 'Missing id or isActive status' }, { status: 400 });
        }
        if (!/^[a-f\d]{24}$/i.test(String(id))) {
            return NextResponse.json({ error: 'Invalid property id' }, { status: 400 });
        }
        if (typeof isActive !== 'boolean') {
            return NextResponse.json({ error: 'isActive must be boolean' }, { status: 400 });
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
        logger.error(`PATCH /api/properties - Error: ${error}`);
        return NextResponse.json({ error: 'Failed to update properties' }, { status: 500 });
    }
}
