import { notFound } from 'next/navigation';
import PropertyForm from '@/components/admin/PropertyForm';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';

// Force dynamic rendering to ensure fresh data
export const dynamic = 'force-dynamic';

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    await dbConnect();
    const property = await Property.findById(id).lean();

    if (!property) {
        notFound();
    }

    // Convert _id and dates to plain strings/objects for Client Component
    const plainProperty = {
        ...property,
        _id: property._id.toString(),
        createdAt: property.createdAt ? (property.createdAt as Date).toISOString() : null,
        updatedAt: property.updatedAt ? (property.updatedAt as Date).toISOString() : null,
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary-dark">Edit Property</h1>
                <p className="text-muted-foreground">Update the details of your listing.</p>
            </div>
            <PropertyForm initialData={plainProperty} />
        </div>
    );
}
