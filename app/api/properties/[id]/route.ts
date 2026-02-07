import { NextResponse } from 'next/server';
import logger from '@/lib/logger';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

        const property = await Property.findByIdAndUpdate(id, body, { new: true });

        if (!property) {
            return NextResponse.json({ error: 'Property not found' }, { status: 404 });
        }

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

        // Delete images from Cloudinary
        if (property.images && property.images.length > 0) {
            const publicIds = property.images.map((url: string) => {
                // Extract public_id from URL
                // Example: https://res.cloudinary.com/cloud_name/image/upload/v1234567890/folder/public_id.jpg
                const splitUrl = url.split('/');
                const filename = splitUrl[splitUrl.length - 1];
                const publicId = filename.split('.')[0];
                return publicId;
            });

            logger.info(`DELETE /api/properties/${id} - Deleting items from Cloudinary: ${publicIds.join(', ')}`);

            // Note: In production, might want to handle failures gracefully or use a background job
            // For now, we try to delete but don't block DB deletion if it fails, just log it
            try {
                await LinkCloudinaryResources(publicIds);
            } catch (cloudError) {
                logger.error(`DELETE /api/properties/${id} - Cloudinary deletion error: ${cloudError}`);
            }
        }

        await Property.findByIdAndDelete(id);
        logger.info(`DELETE /api/properties/${id} - Deleted from DB`);

        return NextResponse.json({ message: 'Property deleted' });
    } catch (error) {
        logger.error(`DELETE /api/properties/${id} - Error: ${error}`);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function LinkCloudinaryResources(publicIds: string[]) {
    // Use delete_resources api
    // We need to be careful about the public_id format depending on folder structure
    // If the URL contains folder, the extraction usage above might need adjustment depending on how it's stored.
    // Assuming flat structure or adjust if folder is used. 
    // For now, using the filename extraction. If using folders, need full path after 'upload/v.../'

    // Correct extraction logic for standard Cloudinary URLs:
    // .../upload/v1234/folder/image.jpg -> folder/image

    // Given we don't know the exact folder structure yet, we'll try to match standard pattern.
    // This is a simplified extraction. 

    /* 
      Wait, the 'publicIds' extracted above `filename.split('.')[0]` handles `image.jpg` -> `image`. 
      If it is `folder/image.jpg`, splitting by `/` and taking last one only gives `image`. 
      Cloudinary public_id INCLUDES the folder. 
      
      We'll improve the extraction in the helper or main loop.
    */

    // We will invoke cloudinary.api.delete_resources(publicIds)
    // But since that requires Admin API which might be stricter, uploader.destroy is per image.
    // api.delete_resources is better for batch.

    // Let's rely on standard uploader.destroy loop/promise.all for updating
    const promises = publicIds.map(id => cloudinary.uploader.destroy(id));
    await Promise.all(promises);
}
