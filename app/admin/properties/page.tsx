'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/Button';

export default function AdminPropertiesPage() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

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

    if (loading) return <div className="p-8 text-center text-white">Loading...</div>;

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Properties</h1>
                    <p className="text-gray-400">Manage your property listings.</p>
                </div>
                <Link href="/admin/properties/add">
                    <Button className="bg-accent hover:bg-accent/80 text-white">
                        <Plus className="mr-2 h-4 w-4" />
                        Add New Property
                    </Button>
                </Link>
            </div>

            <div className="rounded-xl border border-white/10 bg-primary/20 backdrop-blur-md shadow-sm overflow-hidden">
                <div className="p-6">
                    <div className="rounded-md border border-white/10 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-gray-400">
                                <tr className="border-b border-white/10">
                                    <th className="h-12 px-4 font-medium">Property</th>
                                    <th className="h-12 px-4 font-medium">Location</th>
                                    <th className="h-12 px-4 font-medium">Price</th>
                                    <th className="h-12 px-4 font-medium">Visibility</th>
                                    <th className="h-12 px-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-200">
                                {properties.map((property) => (
                                    <tr key={property._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 font-medium">{property.title}</td>
                                        <td className="p-4">{property.location}</td>
                                        <td className="p-4">${property.price?.toLocaleString()}</td>
                                        <td className="p-4">
                                            <button
                                                onClick={() => toggleVisibility(property._id, property.isActive)}
                                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-colors ${property.isActive
                                                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                                                    : 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                                    }`}
                                            >
                                                {property.isActive ? (
                                                    <><Eye className="w-3 h-3" /> Visible</>
                                                ) : (
                                                    <><EyeOff className="w-3 h-3" /> Hidden</>
                                                )}
                                            </button>
                                        </td>
                                        <td className="p-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link href={`/properties/${property._id}`} target="_blank">
                                                    <Button variant="ghost" size="sm" title="View Public Page" className="text-gray-400 hover:text-white">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Link href={`/admin/properties/${property._id}/edit`}>
                                                    <Button variant="ghost" size="sm" title="Edit" className="text-blue-400 hover:text-blue-300">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                                                    title="Delete"
                                                    onClick={() => handleDelete(property._id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {properties.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="p-8 text-center text-gray-500">
                                            No properties found. Add one to get started.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
