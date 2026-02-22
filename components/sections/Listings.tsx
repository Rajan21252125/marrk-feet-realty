'use client';

import { MapPin, ArrowRight, BedDouble, Bath, Maximize } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { IProperty } from "@/models/Property";
import { FadeIn } from "@/components/ui/FadeIn";
import { PropertyCard } from "@/components/ui/PropertyCard";

export function Listings({ showFilter = false }: { showFilter?: boolean }) {
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch('/api/properties');
                const data = await res.json();
                if (Array.isArray(data)) {
                    // Filter active properties and take top 6
                    setProperties(data.filter((p: IProperty) => p.isActive).slice(0, 6));
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
                        {properties.map((property, index) => (
                            <FadeIn key={property._id.toString()} delay={index * 0.1} direction="up">
                                <PropertyCard
                                    id={property._id.toString()}
                                    title={property.title}
                                    price={property.price}
                                    location={property.location}
                                    beds={property.beds}
                                    baths={property.baths}
                                    area={property.area}
                                    imageUrl={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11'}
                                    category={property.propertyType}
                                />
                            </FadeIn>
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
