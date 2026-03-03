'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyCarouselProps {
    images: string[];
    title: string;
    youtubeUrl?: string;
    hero?: boolean;
}

export default function PropertyCarousel({ images, title, youtubeUrl, hero = false }: PropertyCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const displayImages = images.length > 0 ? images : ['https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11'];

    const getYoutubeId = (url: string) => {
        const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
        const match = url.match(regExp);
        return (match && match[1].length === 11) ? match[1] : null;
    };

    const videoId = youtubeUrl ? getYoutubeId(youtubeUrl) : null;
    const hasVideo = !!videoId;
    const totalSlides = displayImages.length + (hasVideo ? 1 : 0);
    const isVideoSlide = hasVideo && currentIndex === displayImages.length;

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev === totalSlides - 1 ? 0 : prev + 1));
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1));
    };

    return (
        <div className={`relative w-full overflow-hidden ${hero ? 'h-full bg-brand-navy' : 'mb-12 group'}`}>
            {/* Main Content Area */}
            <div className={`relative w-full overflow-hidden transition-all duration-700 ${hero
                ? 'h-full'
                : 'h-[450px] md:h-[700px] rounded-4xl md:rounded-[3.5rem] bg-gray-100 dark:bg-brand-navy border-4 md:border-12 border-white dark:border-white/5 shadow-2xl'
                }`}>
                <AnimatePresence mode="wait">
                    {isVideoSlide ? (
                        <motion.div
                            key="video"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="w-full h-full bg-black"
                        >
                            <iframe
                                width="100%"
                                height="100%"
                                src={`https://www.youtube.com/embed/${videoId}?rel=0`}
                                title="Property Video"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full"
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                            className={`relative w-full h-full ${!hero && 'cursor-zoom-in'}`}
                            onClick={() => !hero && setIsZoomed(!isZoomed)}
                        >
                            <Image
                                src={displayImages[currentIndex]}
                                alt={`${title} - Image ${currentIndex + 1}`}
                                fill
                                className={`object-cover transition-transform duration-[1.5s] ease-out ${isZoomed ? 'scale-110' : 'scale-100 group-hover:scale-105'}`}
                                priority
                            />
                            {/* Cinematic Overlay */}
                            <div className={`absolute inset-0 bg-linear-to-t pointer-events-none transition-opacity duration-700 ${hero
                                ? 'from-brand-navy/80 via-brand-navy/20 to-transparent'
                                : 'from-brand-navy/60 via-transparent to-brand-navy/10'
                                }`} />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Glassmorphic Controls */}
                {totalSlides > 1 && (
                    <>
                        <div className={`absolute inset-y-0 left-6 flex items-center z-20 ${hero ? 'opacity-40 group-hover:opacity-100 transition-opacity' : ''}`}>
                            <Button
                                variant="outline"
                                onClick={(e) => { e.stopPropagation(); prevSlide(); }}
                                className="bg-white/10 backdrop-blur-2xl hover:bg-brand-orange text-white border-white/20 rounded-full h-16 w-16 p-0 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 shadow-2xl"
                            >
                                <ChevronLeft size={36} />
                            </Button>
                        </div>
                        <div className={`absolute inset-y-0 right-6 flex items-center z-20 ${hero ? 'opacity-40 group-hover:opacity-100 transition-opacity' : ''}`}>
                            <Button
                                variant="outline"
                                onClick={(e) => { e.stopPropagation(); nextSlide(); }}
                                className="bg-white/10 backdrop-blur-2xl hover:bg-brand-orange text-white border-white/20 rounded-full h-16 w-16 p-0 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 shadow-2xl"
                            >
                                <ChevronRight size={36} />
                            </Button>
                        </div>

                        {/* Pagination/Status - Floating Bar */}
                        <div className={`absolute left-1/2 -translate-x-1/2 flex items-center gap-3 z-20 px-8 py-3 bg-black/30 backdrop-blur-2xl rounded-full border border-white/10 ${hero ? 'bottom-12' : 'bottom-10'
                            }`}>
                            {Array.from({ length: totalSlides }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={(e) => { e.stopPropagation(); setCurrentIndex(index); }}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${index === currentIndex ? 'w-10 bg-brand-orange shadow-[0_0_15px_rgba(255,107,0,0.5)]' : 'w-2 bg-white/30 hover:bg-white/60'
                                        }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Thumbnail Navigation - Only in normal mode */}
            {!hero && totalSlides > 1 && (
                <div className="mt-8 flex gap-6 overflow-x-auto pb-4 no-scrollbar px-2 snap-x">
                    {displayImages.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`relative h-24 w-40 shrink-0 rounded-3xl overflow-hidden border-2 transition-all duration-500 snap-center ${index === currentIndex ? 'border-brand-orange scale-105 shadow-xl shadow-brand-orange/20' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-102'
                                }`}
                        >
                            <Image
                                src={img}
                                alt={`${title} Thumbnail ${index + 1}`}
                                fill
                                className="object-cover"
                            />
                        </button>
                    ))}
                    {hasVideo && (
                        <button
                            onClick={() => setCurrentIndex(displayImages.length)}
                            className={`relative h-24 w-40 shrink-0 rounded-3xl overflow-hidden border-2 transition-all duration-500 snap-center bg-black flex items-center justify-center group/thumb ${currentIndex === displayImages.length ? 'border-brand-orange scale-105 shadow-xl shadow-brand-orange/20' : 'border-white/10 opacity-60 hover:opacity-100 hover:scale-102'
                                }`}
                        >
                            <Play size={32} className="text-brand-orange group-hover/thumb:scale-125 transition-transform" />
                            <div className="absolute inset-0 bg-brand-orange/10" />
                            <span className="absolute bottom-2 text-[8px] font-black uppercase tracking-widest text-white/50">Virtual Tour</span>
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
