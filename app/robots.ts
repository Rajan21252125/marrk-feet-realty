import { MetadataRoute } from 'next';

/**
 * Generates a robots.txt file for the application.
 * This instructs search engines on which pages to crawl or avoid.
 */
export default function robots(): MetadataRoute.Robots {
    const baseUrl = process.env.NEXTAUTH_URL || 'https://marrkfeetrealty.in';

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/admin',
                    '/api',
                    '/_next',
                    '/static',
                    '/admin/*',
                    '/api/*'
                ],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
