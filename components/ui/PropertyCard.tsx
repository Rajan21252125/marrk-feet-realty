'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Bed, Bath, Move, MapPin, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface PropertyCardProps {
    id: string;
    title: string;
    price: number;
    location: string;
    beds: number;
    baths: number;
    area: number;
    imageUrl: string;
    category: string;
    builder?: string;
    tags?: string[];
}

export function PropertyCard({
    id,
    title,
    price,
    location,
    beds,
    baths,
    area,
    imageUrl,
    category,
    builder,
    tags
}: PropertyCardProps) {
    const [isLiked, setIsLiked] = useState(false);

    const getSavedProperties = (): string[] => {
        try {
            if (typeof window === 'undefined') return [];
            return JSON.parse(localStorage.getItem('savedProperties') || '[]');
        } catch (error) {
            console.error('Error parsing savedProperties:', error);
            return [];
        }
    };

    useEffect(() => {
        const syncLikedState = () => {
            const savedProperties = getSavedProperties();
            setIsLiked(savedProperties.includes(id));
        };

        syncLikedState();
        window.addEventListener('favoritesUpdated', syncLikedState);
        return () => window.removeEventListener('favoritesUpdated', syncLikedState);
    }, [id]);

    const toggleLike = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const savedProperties = getSavedProperties();
        let updatedProperties: string[];

        if (isLiked) {
            updatedProperties = savedProperties.filter((pid: string) => pid !== id);
            localStorage.setItem('savedProperties', JSON.stringify(updatedProperties));
            setIsLiked(false);
            toast.success('Removed from favorites');
        } else {
            updatedProperties = Array.from(new Set([...savedProperties, id]));
            localStorage.setItem('savedProperties', JSON.stringify(updatedProperties));
            setIsLiked(true);
            toast.success('Added to favorites');
        }

        window.dispatchEvent(new Event('favoritesUpdated'));
    };

    return (
        <div className="group bg-white dark:bg-brand-navy/40 rounded-[2rem] overflow-hidden border border-gray-100 dark:border-white/5 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:-translate-y-2 relative">
            <Link href={`/properties/${id}`} className="block">
                {/* Image Section */}
                <div className="aspect-[4/3] relative overflow-hidden">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        <div className="bg-brand-orange text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            {tags && tags.length > 0 ? tags[0] : category}
                        </div>
                        <div className="bg-brand-navy/80 backdrop-blur-md text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg">
                            RERA Approved
                        </div>
                    </div>

                    {/* Price Tag Overlay */}
                    <div className="absolute bottom-4 left-4">
                        <div className="bg-white/95 dark:bg-brand-navy/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-xl border border-white/20">
                            <span className="text-xl font-bold text-brand-orange leading-none">
                                {formatPrice(price)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="p-6 text-left">
                    <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-2 line-clamp-1 group-hover:text-brand-orange-text transition-colors duration-300">
                        {title}
                    </h3>

                    <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-6">
                        <MapPin size={16} className="mr-1.5 text-brand-orange-text" aria-hidden="true" />
                        <span className="truncate font-medium">{location}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100 dark:border-white/5">
                        <div className="flex flex-col items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-2xl py-3 px-2">
                            <Bed size={18} className="text-brand-orange-text" aria-hidden="true" />
                            <span className="text-xs font-bold text-brand-navy dark:text-white">{beds} BHK</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-2xl py-3 px-2">
                            <Bath size={18} className="text-brand-orange-text" aria-hidden="true" />
                            <span className="text-xs font-bold text-brand-navy dark:text-white">{baths} Bath</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 bg-gray-50 dark:bg-white/5 rounded-2xl py-3 px-2">
                            <Move size={18} className="text-brand-orange-text" aria-hidden="true" />
                            <span className="text-xs font-bold text-brand-navy dark:text-white truncate">{area} Sqft</span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-center justify-between">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Builder</span>
                            <span className="text-sm font-bold text-brand-navy dark:text-white">{builder || 'Independent'}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all duration-300">
                            <span className="text-lg font-bold" aria-hidden="true">→</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Wishlist Button - Moved outside Link to avoid nesting interactive elements */}
            <button
                onClick={toggleLike}
                aria-label={isLiked ? "Remove from favorites" : "Add to favorites"}
                className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 hover:scale-110 active:scale-95 z-20 ${isLiked ? 'bg-brand-orange text-white border-brand-orange' : 'bg-brand-navy/20 text-white hover:bg-brand-navy/40'
                    }`}
            >
                <Heart size={20} className={isLiked ? 'fill-current' : ''} aria-hidden="true" />
            </button>
        </div>
    );
}
