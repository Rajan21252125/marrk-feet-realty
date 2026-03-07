import { MetadataRoute } from 'next';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

/**
 * Generates a dynamic sitemap for the application.
 * This includes all static pages and dynamic property detail pages.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://marrkfeetrealty.in';

    // Static Routes
    const staticRoutes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/contact`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/services`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/privacy`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
        {
            url: `${baseUrl}/terms`,
            lastModified: new Date(),
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    // Dynamic Property Routes
    let propertyRoutes: MetadataRoute.Sitemap = [];
    try {
        await dbConnect();
        const activeProperties = await Property.find({ isActive: true }).select('_id updatedAt').lean();

        propertyRoutes = activeProperties.map((property: any) => ({
            url: `${baseUrl}/properties/${property._id}`,
            lastModified: property.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }));
    } catch (error) {
        console.error('Sitemap Error:', error);
    }

    return [...staticRoutes, ...propertyRoutes];
}
