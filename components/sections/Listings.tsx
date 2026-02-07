'use client';

import { MapPin, ArrowRight, BedDouble, Bath, Maximize } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export function Listings() {
    const [properties, setProperties] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch('/api/properties');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter active properties and take top 6
                    setProperties(data.filter((p: any) => p.isActive).slice(0, 6));
                }
            } catch (error) {
                console.error("Failed to fetch properties", error);
                toast.error("Failed to load listings");
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, []);

    return (
        <section id="listings" className="py-24 bg-gray-50 dark:bg-neutral-900/50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
                    <div>
                        <span className="text-accent font-semibold tracking-wider text-sm uppercase">Exclusive Inventory</span>
                        <h2 className="text-4xl font-bold tracking-tight mt-2 text-primary-dark dark:text-foreground">Latest Properties</h2>
                    </div>

                    <Link href="/properties" className="hidden md:flex items-center gap-2 group text-primary-dark dark:text-white font-medium">
                        View All Properties
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                        ))}
                    </div>
                ) : (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {properties.map((property) => (
                            <div key={property._id} className="group relative bg-white dark:bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-border">
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-200">
                                    <Image
                                        src={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                                        alt={property.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
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

                                    <h3 className="text-xl font-bold mb-4 text-primary-dark dark:text-foreground group-hover:text-accent transition-colors line-clamp-1">
                                        {property.title}
                                    </h3>

                                    <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-white/5 mb-4 max-w-[90%]">
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
                )}

                {properties.length === 0 && !loading && (
                    <div className="text-center py-20">
                        <h3 className="text-xl text-gray-500">No active listings found. Check back soon.</h3>
                    </div>
                )}

                <div className="mt-12 text-center md:hidden">
                    <Link href="#" className="inline-flex items-center gap-2 text-accent font-bold">
                        View All Properties <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
}
