'use client';

import PropertyForm from '@/components/admin/PropertyForm';

export default function AddPropertyPage() {
    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary-dark">Add New Property</h1>
                <p className="text-muted-foreground">Create a new listing for your portfolio.</p>
            </div>
            <PropertyForm />
        </div>
    );
}
