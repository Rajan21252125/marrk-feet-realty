'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { MapPin, ArrowRight, BedDouble, Bath, Maximize, Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from 'react-hot-toast';

export default function PropertiesContent() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [filterQuery, setFilterQuery] = useState('');
    const [propertyType, setPropertyType] = useState('');
    const itemsPerPage = 9;

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await fetch('/api/properties');
            const data = await res.json();
            if (Array.isArray(data)) {
                // Only show active properties
                setProperties(data.filter((p: any) => p.isActive));
            }
        } catch (error) {
            console.error("Failed to fetch properties", error);
            toast.error("Failed to load properties");
        } finally {
            setLoading(false);
        }
    };

    // Filter logic
    const filteredProperties = properties.filter(p => {
        const matchesSearch =
            p.title.toLowerCase().includes(filterQuery.toLowerCase()) ||
            p.location.toLowerCase().includes(filterQuery.toLowerCase());

        const matchesType = propertyType ? p.propertyType === propertyType : true;

        return matchesSearch && matchesType;
    });

    // Pagination logic
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    const currentProperties = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 400, behavior: 'smooth' }); // Scroll to top of list
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            {/* Page Hero - Solves the transparent header issue */}
            <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <div
                        className="h-full w-full bg-cover bg-center"
                        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1920&q=80')" }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                <div className="container relative z-10 mx-auto px-4 text-center ">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
                        Exclusive Properties
                    </h1>
                    <p className="text-xl text-gray-200 max-w-2xl mx-auto font-light">
                        Discover our hand-picked collection of the world's finest homes.
                    </p>
                </div>
            </section>

            <div className="container mx-auto px-4 py-16">
                {/* Search & Filter Bar */}
                <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-lg border border-gray-100 dark:border-white/5 p-4 mb-12 -mt-24 relative z-20 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search by title, location..."
                            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-accent focus:border-transparent outline-none transition-all"
                            value={filterQuery}
                            onChange={(e) => setFilterQuery(e.target.value)}
                        />
                    </div>
                    <div className="w-full md:w-auto flex gap-4">
                        <select
                            className="px-4 py-3 rounded-lg border border-gray-200 dark:border-white/10 bg-transparent focus:ring-2 focus:ring-accent outline-none cursor-pointer text-gray-700 dark:text-gray-300 bg-white dark:bg-neutral-900"
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                        >
                            <option value="">All Types</option>
                            <option value="Villa">Villa</option>
                            <option value="Apartment">Apartment</option>
                            <option value="House">House</option>
                            <option value="Cottage">Cottage</option>
                            <option value="Penthouse">Penthouse</option>
                            <option value="Plot">Plot</option>
                        </select>
                        <Button className="bg-primary-dark text-white px-8 h-full">Search</Button>
                    </div>
                </div>

                {/* Properties Grid */}
                {loading ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-[450px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <>
                        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 mb-16">
                            {currentProperties.map((property) => (
                                <div key={property._id} className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-white/5">
                                    <div className="aspect-[4/3] relative overflow-hidden bg-gray-200">
                                        <Image
                                            src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                            alt={property.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            unoptimized
                                        />
                                        <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/90 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                                            {property.propertyType}
                                        </div>
                                        <div className="absolute bottom-4 right-4 bg-accent/90 text-white px-4 py-2 rounded-lg text-lg font-bold backdrop-blur-sm shadow-lg">
                                            ${property.price?.toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="p-6">
                                        <div className="flex items-center text-gray-500 mb-3 text-sm">
                                            <MapPin size={14} className="mr-1 text-accent" />
                                            {property.location}
                                        </div>

                                        <h3 className="text-xl font-bold mb-4 text-primary-dark dark:text-white group-hover:text-accent transition-colors line-clamp-1">
                                            {property.title}
                                        </h3>

                                        <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-white/5 mb-4 max-w-[95%]">
                                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                <BedDouble size={18} />
                                                <span className="text-sm font-medium">{property.beds} Beds</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                <Bath size={18} />
                                                <span className="text-sm font-medium">{property.baths} Baths</span>
                                            </div>
                                            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                                                <Maximize size={18} />
                                                <span className="text-sm font-medium">{property.area} sqft</span>
                                            </div>
                                        </div>

                                        <Link href={`/properties/${property._id}`} className="block">
                                            <Button className="w-full bg-transparent border border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white dark:border-white dark:text-white dark:hover:bg-white dark:hover:text-black transition-all">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredProperties.length === 0 && (
                            <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-xl border border-dashed border-gray-300">
                                <h3 className="text-xl text-gray-500 mb-2">No properties found matching your criteria.</h3>
                                <p className="text-gray-400">Try adjusting your filters.</p>
                            </div>
                        )}

                        {/* Pagination Controls */}
                        {filteredProperties.length > 0 && (
                            <div className="flex justify-center items-center gap-2">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                <div className="flex gap-2">
                                    {[...Array(totalPages)].map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handlePageChange(i + 1)}
                                            className={`w-10 h-10 rounded-lg font-medium transition-colors ${currentPage === i + 1
                                                ? 'bg-primary-dark text-white'
                                                : 'bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                                                }`}
                                        >
                                            {i + 1}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
