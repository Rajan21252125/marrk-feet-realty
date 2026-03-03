'use client';

import { useState, useEffect } from 'react';
import { IPropertyData } from '@/models/Property';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { FadeIn } from '@/components/ui/FadeIn';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { HeartOff, ArrowLeft, Loader2, ChevronRight, Search } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function FavoritesPage() {
    const [properties, setProperties] = useState<IPropertyData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLikedProperties = async () => {
        try {
            const savedIds = JSON.parse(localStorage.getItem('savedProperties') || '[]');
            if (savedIds.length === 0) {
                setProperties([]);
                setLoading(false);
                return;
            }

            // Using the existing API with IDs filter
            const res = await fetch(`/api/properties?ids=${savedIds.join(',')}`);
            const data = await res.json();

            if (Array.isArray(data)) {
                setProperties(data);
            }
        } catch (error) {
            console.error("Failed to fetch favorites", error);
            // toast.error("Failed to load your favorites");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLikedProperties();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-brand-navy/10 pt-20">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Loading Favorites...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-brand-navy/5 pt-24 pb-20">
            {/* Hero Section */}
            <section className="relative py-16 bg-brand-navy overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
                <div className="container relative z-10 mx-auto px-4 text-center">
                    <FadeIn direction="down">
                        <span className="text-brand-orange font-bold tracking-[0.3em] text-xs uppercase underline underline-offset-8">Wishlist</span>
                        <h1 className="text-4xl md:text-5xl font-bold text-white mt-8 mb-4">Your <span className="text-brand-orange">Saved Properties</span></h1>
                        <p className="text-gray-400 max-w-2xl mx-auto font-medium">Keep track of the homes that caught your eye in one convenient place.</p>
                    </FadeIn>
                </div>
            </section>

            {/* Breadcrumbs */}
            <div className="bg-white dark:bg-brand-navy/10 py-4 border-b border-gray-100 dark:border-white/5">
                <div className="container mx-auto px-4">
                    <nav className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                        <Link href="/" className="hover:text-brand-orange">Home</Link>
                        <ChevronRight size={14} className="text-gray-300" />
                        <span className="text-brand-navy dark:text-white">Favorites</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 py-16">
                {properties.length === 0 ? (
                    <FadeIn delay={0.2}>
                        <div className="text-center py-24 bg-white dark:bg-brand-navy rounded-[3rem] border border-dashed border-gray-200 dark:border-white/10 shadow-sm max-w-4xl mx-auto">
                            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-orange/5 text-brand-orange mb-8">
                                <HeartOff size={48} />
                            </div>
                            <h2 className="text-3xl font-bold text-brand-navy dark:text-white mb-4">No Favorites Yet</h2>
                            <p className="text-gray-500 mb-10 max-w-sm mx-auto leading-relaxed">
                                You haven&apos;t saved any properties yet. Explore our latest listings and click the heart icon to start building your wishlist.
                            </p>
                            <Link href="/properties">
                                <Button className="bg-brand-orange hover:bg-brand-orange/90 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-brand-orange/20">
                                    Browse Properties
                                </Button>
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
                                    builder={property.builder}
                                    tags={property.tags}
                                />
                            </FadeIn>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
