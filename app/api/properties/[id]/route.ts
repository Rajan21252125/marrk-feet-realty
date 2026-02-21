import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';
import { sanitize } from '@/lib/sanitization';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Helper to extract public_id from Cloudinary URL
function extractPublicId(url: string): string | null {
    try {
        // Matches: .../upload/(v1234/)?(folder/public_id).jpg
        // We need to capture everything after /upload/ (and optional version) up to the extension
        const regex = /\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/;
        const match = url.match(regex);
        return match ? match[1] : null;
    } catch (error) {
        logger.error(`Error extracting publicId from ${url}: ${error}`);
        return null;
    }
}

async function deleteFromCloudinary(urls: string[]) {
    if (!urls || urls.length === 0) return;

    const publicIds = urls
        .map(url => extractPublicId(url))
        .filter((id): id is string => id !== null);

    if (publicIds.length === 0) return;

    logger.info(`Deleting from Cloudinary: ${publicIds.join(', ')}`);

    // Use cloudinary.api.delete_resources for batch deletion (requires Admin API)
    // Or loop uploader.destroy. Property deletion might have many images.
    // Let's use loop for safety if Admin API keys aren't fully set up for management (though they seem to be).
    // Actually, uploader.destroy is safer for standard API keys.

    const promises = publicIds.map(id => cloudinary.uploader.destroy(id));
    const results = await Promise.allSettled(promises);

    results.forEach((result, index) => {
        if (result.status === 'rejected') {
            logger.error(`Failed to delete ${publicIds[index]}: ${result.reason}`);
        }
    });
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    logger.info(`GET /api/properties/${id} - Fetching property`);
    try {
        await dbConnect();
        const property = await Property.findById(id);

        if (!property) {
            logger.warn(`GET /api/properties/${id} - Not found`);
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        return NextResponse.json(property);
    } catch (error) {
        logger.error(`GET /api/properties/${id} - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    logger.info(`PUT /api/properties/${id} - Updating property`);
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const body = await req.json();
        const sanitizedBody = sanitize(body);

        // Check for removed images
        const existingProperty = await Property.findById(id);
        if (!existingProperty) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        const oldImages: string[] = existingProperty.images || [];
        const newImages: string[] = body.images || [];

        // Images present in old but not in new need to be deleted
        const imagesToDelete = oldImages.filter(img => !newImages.includes(img));

        if (imagesToDelete.length > 0) {
            logger.info(`PUT /api/properties/${id} - Found ${imagesToDelete.length} images to delete`);
            await deleteFromCloudinary(imagesToDelete);
        }

        const property = await Property.findByIdAndUpdate(id, sanitizedBody, { new: true });

        logger.info(`PUT /api/properties/${id} - Updated`);
        return NextResponse.json(property);
    } catch (error) {
        logger.error(`PUT /api/properties/${id} - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    logger.info(`DELETE /api/properties/${id} - Deleting property`);
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await dbConnect();
        const property = await Property.findById(id);

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

        // Delete all images
        if (property.images && property.images.length > 0) {
            await deleteFromCloudinary(property.images);
        }

        await Property.findByIdAndDelete(id);
        logger.info(`DELETE /api/properties/${id} - Deleted from DB`);

        return NextResponse.json({ message: 'Property deleted' });
    } catch (error) {
        logger.error(`DELETE /api/properties/${id} - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

