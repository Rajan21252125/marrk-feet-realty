'use client';

import { useState, useEffect } from 'react';
import { IProperty } from '@/models/Property';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { FadeIn } from '@/components/ui/FadeIn';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HeartOff, ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function LikedPropertiesPage() {
    const [properties, setProperties] = useState<IProperty[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLikedProperties = async () => {
            try {
                const savedIds = JSON.parse(localStorage.getItem('savedProperties') || '[]');
                if (savedIds.length === 0) {
                    setProperties([]);
                    setLoading(false);
                    return;
                }

                const res = await fetch('/api/properties');
                const data = await res.json();

                if (Array.isArray(data)) {
                    const liked = data.filter((p: IProperty) => savedIds.includes(p._id.toString()));
                    setProperties(liked);
                }
            } catch (error) {
                console.error("Failed to fetch liked properties", error);
                toast.error("Failed to load your saved properties");
            } finally {
                setLoading(false);
            }
        };

        fetchLikedProperties();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-accent animate-spin mb-4" />
                <p className="text-muted-foreground">Loading your saved properties...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-24">
            <FadeIn>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight text-primary-dark dark:text-white">Your Saved Properties</h1>
                        <p className="text-muted-foreground mt-2">Properties you've marked as favorite for easy access.</p>
                    </div>
                    <Link href="/properties">
                        <Button variant="outline" className="gap-2">
                            <ArrowLeft size={18} /> Browse More
                        </Button>
                    </Link>
                </div>
            </FadeIn>

            {properties.length === 0 ? (
                <FadeIn delay={0.2}>
                    <div className="text-center py-20 bg-gray-50 dark:bg-neutral-900/50 rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 dark:bg-white/5 text-gray-400 dark:text-gray-600 mb-6">
                            <HeartOff size={40} />
                        </div>
                        <h2 className="text-2xl font-bold mb-4">No saved properties yet</h2>
                        <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
                            Start exploring our exclusive listings and click the heart icon to save properties you like.
                        </p>
                        <Link href="/properties">
                            <Button className="bg-accent hover:bg-accent/90">Explore Properties</Button>
                        </Link>
                    </div>
                </FadeIn>
            ) : (
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                    {properties.map((property, index) => (
                        <FadeIn key={property._id.toString()} delay={index * 0.1}>
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
        </div>
    );
}
