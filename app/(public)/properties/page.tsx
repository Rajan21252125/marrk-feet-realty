import { Metadata } from 'next';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import PropertiesContent from './PropertiesContent';

export const metadata: Metadata = {
    title: 'Properties',
    description: 'Browse our exclusive collection of luxury properties. Filter by type, location, and price to find your dream home.',
};

export default async function PropertiesPage() {
    await dbConnect();
    const initialProperties = await Property.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean();

    // Map _id to string for Client Component serialization
    const serializedProperties = JSON.parse(JSON.stringify(initialProperties));

    return <PropertiesContent initialProperties={serializedProperties} />;
}
