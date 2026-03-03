'use client';

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

import { IPropertyData } from "@/models/Property";
import { FadeIn } from "@/components/ui/FadeIn";
import { PropertyCard } from "@/components/ui/PropertyCard";

export function Listings() {
    const [properties, setProperties] = useState<IPropertyData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const res = await fetch('/api/properties');
                const data = await res.json();
                if (Array.isArray(data)) {
                    setProperties(data.filter((p: IPropertyData) => p.isActive).slice(0, 6));
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
        <section id="listings" className="py-24 bg-white dark:bg-brand-navy/20">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-16">
                    <span className="text-brand-orange font-bold tracking-[0.3em] text-xs uppercase">Premium Collection</span>
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight mt-4 text-brand-navy dark:text-white">Featured Properties</h2>
                    <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
                        Explore our handpicked selection of top-rated properties in Mumbai's most sought-after locations.
                    </p>
                </div>

                {loading ? (
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-[450px] bg-gray-100 dark:bg-white/5 animate-pulse rounded-[2rem]" />
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
                                    builder={property.builder}
                                    tags={property.tags}
                                />
                            </FadeIn>
                        ))}
                    </div>
                )}

                <div className="mt-16 text-center">
                    <Link
                        href="/properties"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-brand-navy dark:bg-brand-orange text-white font-bold rounded-2xl hover:bg-brand-orange transition-all duration-300 hover:shadow-xl hover:shadow-brand-orange/20 group"
                    >
                        View All Listings
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
