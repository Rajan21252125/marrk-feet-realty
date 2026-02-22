import Link from 'next/link';
import { Building, CheckCircle, Plus, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import dbConnect from '@/lib/db';
import Message from '@/models/Message';
import Property, { IProperty, IPropertyData } from '@/models/Property';

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
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                    <p className="text-gray-400">Overview of your real estate business</p>
                </div>
                <Link href="/admin/properties/add">
                    <Button className="bg-accent hover:bg-accent/80 text-white shadow-lg shadow-accent/20 transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Property
                    </Button>
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-3">
                <div className="relative group overflow-hidden rounded-2xl bg-primary/20 backdrop-blur-xl border border-white/10 p-6 shadow-lg transition-all hover:border-accent/30 hover:shadow-accent/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Building className="h-24 w-24 text-blue-500 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="rounded-xl bg-blue-500/20 p-3 text-blue-400">
                                <Building className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                +12% this month
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Total Properties</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{totalProperties}</h3>
                    </div>
                </div>

                <div className="relative group overflow-hidden rounded-2xl bg-primary/20 backdrop-blur-xl border border-white/10 p-6 shadow-lg transition-all hover:border-accent/30 hover:shadow-accent/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <CheckCircle className="h-24 w-24 text-green-500 transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="rounded-xl bg-green-500/20 p-3 text-green-400">
                                <CheckCircle className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-green-400 bg-green-500/10 px-2 py-1 rounded-full">
                                {Math.round((activeProperties / (totalProperties || 1)) * 100)}% Active
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Active Listings</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{activeProperties}</h3>
                        <p className="text-xs text-gray-500 mt-1">{totalProperties - activeProperties} inactive properties</p>
                    </div>
                </div>

                <div className="relative group overflow-hidden rounded-2xl bg-primary/20 backdrop-blur-xl border border-white/10 p-6 shadow-lg transition-all hover:border-accent/30 hover:shadow-accent/10">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <MessageSquare className="h-24 w-24 text-accent transform rotate-12 translate-x-4 -translate-y-4" />
                    </div>
                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div className="rounded-xl bg-accent/20 p-3 text-accent">
                                <MessageSquare className="h-6 w-6" />
                            </div>
                            <span className="text-xs font-medium text-gray-400 bg-white/5 px-2 py-1 rounded-full">
                                All time
                            </span>
                        </div>
                        <p className="text-sm font-medium text-gray-400">Total Inquiries</p>
                        <h3 className="text-3xl font-bold text-white mt-1">{totalMessages}</h3>
                    </div>
                </div>
            </div>

            {/* Recent Activity / Properties */}
            <div className="rounded-2xl bg-primary/20 backdrop-blur-xl border border-white/10 shadow-lg overflow-hidden">
                <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                    <h2 className="text-xl font-bold text-white">Recent Properties</h2>
                    <Link href="/admin/properties">
                        <Button variant="ghost" className="text-accent hover:text-accent/80 hover:bg-accent/10">
                            View All
                        </Button>
                    </Link>
                </div>
                <div className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-white/5">
                                <tr className="border-b border-white/10">
                                    <th className="h-12 px-6 text-left align-middle font-medium text-gray-400 uppercase tracking-wider text-xs">Property</th>
                                    <th className="h-12 px-6 text-left align-middle font-medium text-gray-400 uppercase tracking-wider text-xs">Location</th>
                                    <th className="h-12 px-6 text-left align-middle font-medium text-gray-400 uppercase tracking-wider text-xs">Price</th>
                                    <th className="h-12 px-6 text-left align-middle font-medium text-gray-400 uppercase tracking-wider text-xs">Status</th>
                                    <th className="h-12 px-6 text-right align-middle font-medium text-gray-400 uppercase tracking-wider text-xs">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {recentProperties.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No properties found.
                                        </td>
                                    </tr>
                                ) : (
                                    recentProperties.map((property: IPropertyData) => (
                                        <tr key={property._id.toString()} className="transition-colors hover:bg-white/5">
                                            <td className="p-6 align-middle">
                                                <div className="font-semibold text-white">{property.title}</div>
                                            </td>
                                            <td className="p-6 align-middle text-gray-300">{property.location}</td>
                                            <td className="p-6 align-middle font-mono text-accent">{formatPrice(property.price)}</td>
                                            <td className="p-6 align-middle">
                                                <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold border ${property.isActive
                                                    ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                    : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                                                    }`}>
                                                    {property.isActive ? 'Active' : 'Hidden'}
                                                </span>
                                            </td>
                                            <td className="p-6 align-middle text-right">
                                                <Link href={`/admin/properties/${property._id}/edit`}>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                                                    >
                                                        Edit
                                                    </Button>
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
