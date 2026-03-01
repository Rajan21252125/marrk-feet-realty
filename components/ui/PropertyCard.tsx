import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button';
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
    listingType?: string;
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
    listingType,
    builder,
    tags
}: PropertyCardProps) {
    const [isLiked, setIsLiked] = useState(false);
    const [mounted, setMounted] = useState(false);

    // Safe helper for localStorage parsing
    const getSavedProperties = (): string[] => {
        try {
            return JSON.parse(localStorage.getItem('savedProperties') || '[]');
        } catch (error) {
            console.error('Error parsing savedProperties from localStorage:', error);
            return [];
        }
    };

    useEffect(() => {
        setMounted(true);
        const savedProperties = getSavedProperties();
        if (savedProperties.includes(id)) {
            setIsLiked(true);
        }
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
            localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
            setIsLiked(true);
            toast.success('Added to favorites');
        }

        window.dispatchEvent(new Event('favoritesUpdated'));
    };



    return (
        <div className="group relative overflow-hidden rounded-3xl bg-neutral-900 border border-white/5 transition-all hover:bg-neutral-800/50 hover:border-white/10 shadow-2xl">
            <Link href={`/properties/${id}`}>
                <div className="aspect-4/3 relative overflow-hidden m-2 rounded-2xl">
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Badge Overlay */}
                    <div className="absolute top-4 left-4">
                        <div className="rounded-full bg-orange-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white shadow-xl backdrop-blur-md">
                            {tags && tags.length > 0 ? tags[0] : category}
                        </div>
                    </div>

                    {/* Heart Button Overlay */}
                    <button
                        onClick={toggleLike}
                        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 transition-all hover:scale-110 active:scale-90"
                    >
                        <Heart
                            size={18}
                            className={`transition-colors ${isLiked ? 'fill-white text-white' : 'text-white/80'}`}
                        />
                    </button>

                    {/* Price Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-linear-to-t from-black/80 to-transparent flex items-end p-6">
                        <span className="text-2xl font-black text-white tracking-wide">
                            {formatPrice(price)}
                        </span>
                    </div>
                </div>

                <div className="p-6 pt-2">
                    <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-accent transition-colors">
                        {title}
                    </h3>

                    <div className="flex items-center text-sm text-gray-400 mb-6 font-medium">
                        <MapPin className="mr-1.5 h-3.5 w-3.5 text-accent" />
                        <span className="truncate">{location}</span>
                    </div>

                    <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/5">
                        <div className="flex items-center gap-1.5">
                            <Bed className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-bold text-gray-300">{beds} <span className="text-gray-500 font-medium">Bed</span></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Bath className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-bold text-gray-300">{baths} <span className="text-gray-500 font-medium">Bath</span></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Move className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-bold text-gray-300">{area.toLocaleString()} <span className="text-gray-500 font-medium">sqft</span></span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
                            {builder || 'Independent'}
                        </span>

                        <div className="flex items-center gap-1.5 text-sm font-bold text-accent group/btn">
                            View Details
                            <span className="transition-transform group-hover/btn:translate-x-1">→</span>
                        </div>
                    </div>
                </div>
            </Link>
        </div>
    );
}
