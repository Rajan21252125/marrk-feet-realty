'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface ImageSliderProps {
    images: string[];
    title: string;
}

export default function ImageSlider({ images, title }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Use placeholder if no images
    const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'];

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
    };

    // If only one image, don't show controls
    const showControls = displayImages.length > 1;

    return (
        <div className="relative h-full w-full group">
            {/* Main Image - Normal View */}
            <div className="relative h-full w-full overflow-hidden">
                <Image
                    src={displayImages[currentIndex]}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            </div>

            {/* Desktop Hover Zoom Overlay */}
            {/* "hidden md:block" ensures this only happens on desktop/laptop */}
            {/* The group-hover on the parent triggers this opacity change */}
            <div className="hidden md:block absolute inset-0 z-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                <div className="relative w-full h-full bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                    {/* We use a separate image here for the 'whole image' view (object-contain) */}
                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] shadow-2xl rounded-lg overflow-hidden">
                        <Image
                            src={displayImages[currentIndex]}
                            alt={`${title} - Zoomed`}
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>

            {showControls && (
                <>
                    <div className="absolute inset-y-0 left-0 flex items-center px-4 z-50">
                        <Button
                            variant="outline"
                            onClick={prevSlide}
                            className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full h-12 w-12 p-0 hidden group-hover:flex"
                        >
                            <ChevronLeft size={24} />
                        </Button>
                    </div>
                    <div className="absolute inset-y-0 right-0 flex items-center px-4 z-50">
                        <Button
                            variant="outline"
                            onClick={nextSlide}
                            className="bg-black/30 hover:bg-black/50 text-white border-none rounded-full h-12 w-12 p-0 hidden group-hover:flex"
                        >
                            <ChevronRight size={24} />
                        </Button>
                    </div>

                    {/* Dots indicators */}
                    <div className="absolute bottom-32 left-0 right-0 flex justify-center gap-2 z-50">
                        {displayImages.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2.5 h-2.5 rounded-full transition-all ${index === currentIndex ? 'bg-white w-8' : 'bg-white/50 hover:bg-white/80'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
