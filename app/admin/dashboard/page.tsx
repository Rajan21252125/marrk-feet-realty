import Link from 'next/link';
import { Building, CheckCircle, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import Message from '@/models/Message';

// Helper to format currency
const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(price);
};

export default async function AdminDashboard() {
    await dbConnect();

    // Fetch Stats
    const totalProperties = await Property.countDocuments({});
    const activeProperties = await Property.countDocuments({ isActive: true });
    const totalMessages = await Message.countDocuments({});

    // Fetch Recent Properties
    const recentProperties = await Property.find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold text-primary-dark">Dashboard</h1>
                <Link href="/admin/properties/add">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Property
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-6 sm:grid-cols-3">
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Properties</p>
                            <h3 className="text-2xl font-bold">{totalProperties}</h3>
                        </div>
                        <div className="rounded-full bg-blue-100 p-3 text-blue-600 dark:bg-blue-900/20">
                            <Building className="h-6 w-6" />
                        </div>
                    </div>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Active Listings</p>
                            <h3 className="text-2xl font-bold">{activeProperties}</h3>
                        </div>
                        <div className="rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/20">
                            <CheckCircle className="h-6 w-6" />
                        </div>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">{totalProperties - activeProperties} inactive</p>
                </div>
                <div className="rounded-xl border bg-card p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Total Inquiries</p>
                            <h3 className="text-2xl font-bold">{totalMessages}</h3>
                        </div>
                        <div className="rounded-full bg-orange-100 p-3 text-orange-600 dark:bg-orange-900/20">
                            <MessageSquare className="h-6 w-6" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Properties */}
            <div className="rounded-xl border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b p-6">
                    <h2 className="text-xl font-bold text-primary-dark">Recent Properties</h2>
                    <Link href="/admin/properties">
                        <Button variant="outline" size="sm">View All</Button>
                    </Link>
                </div>
                <div className="p-6">
                    <div className="rounded-md border overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-muted/50">
                                <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Property</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Location</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                    <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentProperties.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-4 text-center text-muted-foreground">
                                            No properties found.
                                        </td>
                                    </tr>
                                ) : (
                                    recentProperties.map((property: any) => (
                                        <tr key={property._id} className="border-b transition-colors hover:bg-muted/50">
                                            <td className="p-4 align-middle font-medium">{property.title}</td>
                                            <td className="p-4 align-middle">{property.location}</td>
                                            <td className="p-4 align-middle">{formatPrice(property.price)}</td>
                                            <td className="p-4 align-middle">
                                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent ${property.isActive
                                                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}>
                                                    {property.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle text-right">
                                                <Link href={`/admin/properties/${property._id}/edit`}>
                                                    <Button variant="ghost" size="sm">Edit</Button>
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
