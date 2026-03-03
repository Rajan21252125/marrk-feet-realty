import { Metadata } from 'next';
import { Suspense } from 'react';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import PropertiesContent from './PropertiesContent';

export const metadata: Metadata = {
    title: 'Properties in Mumbai | Buy & Rent',
    description: 'Explore the best residential and commercial properties in Mumbai. Filter by BHK, location (Andheri, Mira Road, Borivali), and budget to find your perfect home with MarrkFeet Realty.',
    keywords: ["Properties in Mumbai", "Buy Home Mumbai", "Rent Apartment Mumbai", "Mira Road Properties", "Real Estate Listings Mumbai"],
};

export default async function PropertiesPage() {
    await dbConnect();
    const initialProperties = await Property.find({ isActive: true })
        .sort({ createdAt: -1 })
        .lean();

    // Map _id to string for Client Component serialization
    const serializedProperties = JSON.parse(JSON.stringify(initialProperties));

    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-navy/10 pt-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Properties...</p>
                </div>
            </div>
        }>
            <PropertiesContent initialProperties={serializedProperties} />
        </Suspense>
    );
}
