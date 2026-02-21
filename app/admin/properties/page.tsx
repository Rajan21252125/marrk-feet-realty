'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all'); // all, visible, hidden
    const [sortOption, setSortOption] = useState('newest'); // newest, oldest, price-high, price-low

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await fetch('/api/properties');
            const data = await res.json();
            if (Array.isArray(data)) {
                setProperties(data);
            }
            setLoading(false);
        } catch (error) {
            toast.error('Failed to load properties');
            setLoading(false);
        }
    };

    const toggleVisibility = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch('/api/properties', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, isActive: !currentStatus }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(`Property is now ${!currentStatus ? 'Visible' : 'Hidden'}`);
                setProperties(properties.map(p =>
                    p._id === id ? { ...p, isActive: !currentStatus } : p
                ));
            } else {
                toast.error(data.error || 'Failed to update property');
            }
        } catch (error) {
            toast.error('Failed to update property');
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this property? This will also delete associated images.')) return;

        try {
            const res = await fetch(`/api/properties/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Property deleted successfully');
                setProperties(properties.filter(p => p._id !== id));
            } else {
                const data = await res.json();
                toast.error(data.error || 'Failed to delete property');
            }
        } catch (error) {
            console.error('Delete error:', error);
            toast.error('Failed to delete property');
        }
    };

    const filteredProperties = properties
        .filter(property => {
            const matchesSearch = (property.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
                (property.location?.toLowerCase() || '').includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all'
                ? true
                : filterStatus === 'visible'
                    ? property.isActive
                    : !property.isActive;
            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            if (sortOption === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (sortOption === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (sortOption === 'price-high') return (b.price || 0) - (a.price || 0);
            if (sortOption === 'price-low') return (a.price || 0) - (b.price || 0);
            return 0;
        });

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
    );

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Properties</h1>
                    <p className="text-gray-400">Manage your real estate inventory</p>
                </div>
                <Link href="/admin/properties/add">
                    <Button className="bg-accent hover:bg-accent/80 text-white shadow-lg shadow-accent/20 transition-all hover:scale-105">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Property
                    </Button>
                </Link>
            </div>

            {/* Search, Filter, Sort Toolbar */}
            <div className="bg-primary/20 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-96">
                    <input
                        type="text"
                        placeholder="Search visibility, location, or title..."
                        className="w-full bg-black/20 border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 placeholder:text-gray-500"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
                    </div>
                </div>

                <div className="flex w-full md:w-auto gap-3">
                    <Select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        containerClassName="w-full md:w-40"
                        className="bg-black/20 border-white/10"
                    >
                        <option value="all" className="bg-neutral-900">All Status</option>
                        <option value="visible" className="bg-neutral-900">Visible</option>
                        <option value="hidden" className="bg-neutral-900">Hidden</option>
                    </Select>

                    <Select
                        value={sortOption}
                        onChange={(e) => setSortOption(e.target.value)}
                        containerClassName="w-full md:w-52"
                        className="bg-black/20 border-white/10"
                    >
                        <option value="newest" className="bg-neutral-900">Newest First</option>
                        <option value="oldest" className="bg-neutral-900">Oldest First</option>
                        <option value="price-high" className="bg-neutral-900">Price: High to Low</option>
                        <option value="price-low" className="bg-neutral-900">Price: Low to High</option>
                    </Select>
                </div>
            </div>

            <div className="bg-primary/30 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-white/10 bg-white/5">
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Property</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Price</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">List Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">Sale Status</th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProperties.map((property) => (
                                <tr
                                    key={property._id}
                                    className="hover:bg-white/5 transition-colors group"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-16 w-24 shrink-0 rounded-lg overflow-hidden bg-gray-800 border border-white/10">
                                                {property.images && property.images[0] ? (
                                                    <img
                                                        src={property.images[0]}
                                                        alt={property.title}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center text-gray-600">
                                                        <EyeOff className="h-6 w-6" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <div className="font-semibold text-white group-hover:text-accent transition-colors">
                                                    {property.title}
                                                </div>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {property.bhkType || property.propertyType}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-300">{property.location}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-mono text-accent">
                                            ₹{property.price?.toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => toggleVisibility(property._id, property.isActive)}
                                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all ${property.isActive
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'
                                                : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20'
                                                }`}
                                        >
                                            {property.isActive ? (
                                                <><Eye className="w-3 h-3" /> Visible</>
                                            ) : (
                                                <><EyeOff className="w-3 h-3" /> Hidden</>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={`text-xs font-bold uppercase tracking-tight ${property.status === 'Sold' ? 'text-red-400' : 'text-blue-400'}`}>
                                            {property.status}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                            <Link href={`/properties/${property._id}`} target="_blank" prefetch={false}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 rounded-full hover:bg-blue-500/20 hover:text-blue-400 text-gray-400"
                                                    title="View Public Page"
                                                >
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link href={`/admin/properties/${property._id}/edit`} prefetch={false}>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="h-8 w-8 p-0 rounded-full hover:bg-amber-500/20 hover:text-amber-400 text-gray-400"
                                                    title="Edit Property"
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="h-8 w-8 p-0 rounded-full hover:bg-red-500/20 hover:text-red-400 text-gray-400"
                                                title="Delete Property"
                                                onClick={() => handleDelete(property._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProperties.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-gray-500">
                                            <div className="bg-white/5 p-4 rounded-full mb-3">
                                                <Plus className="h-6 w-6" />
                                            </div>
                                            <p className="text-lg font-medium text-gray-400">No properties yet</p>
                                            <p className="text-sm mb-4">Get started by adding your first property.</p>
                                            <Link href="/admin/properties/add">
                                                <Button variant="ghost" className="text-accent hover:text-accent/80 hover:bg-accent/10">
                                                    Add Property
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    );
}
