'use client';

import { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp } from 'lucide-react';
import { CONTACT_INFO } from '@/lib/constants';

export function FloatingActions() {
    const [showScrollTop, setShowScrollTop] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const openWhatsApp = () => {
        const message = encodeURIComponent("Hello, I'm interested in Marrk Feet Realty properties.");
        window.open(`https://wa.me/91${CONTACT_INFO.phone}?text=${message}`, '_blank', 'noopener noreferrer');
    };

    return (
        <>
            {/* Back to Top - Bottom Left */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-4 md:bottom-8 left-4 md:left-8 z-50 w-10 md:w-12 h-10 md:h-12 bg-brand-navy dark:bg-black text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:bg-brand-orange hover:scale-110 border border-white/10 ${showScrollTop ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-50'
                    }`}
                aria-label="Back to Top"
                aria-hidden={!showScrollTop}
                tabIndex={showScrollTop ? 0 : -1}
            >
                <ArrowUp size={20} className="md:w-6 md:h-6" />
            </button>

            {/* WhatsApp - Bottom Right */}
            <button
                onClick={openWhatsApp}
                className="fixed bottom-4 md:bottom-8 right-4 md:right-8 z-50 w-12 md:w-14 h-12 md:h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 group"
                aria-label="Contact on WhatsApp"
            >
                <div className="absolute -top-12 right-0 bg-white text-gray-800 text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-gray-100 italic">
                    Chat with us!
                    <div className="absolute -bottom-1 right-5 w-2 h-2 bg-white rotate-45 border-r border-b border-gray-100"></div>
                </div>
                <MessageCircle size={32} fill="currentColor" />
            </button>
        </>
    );
}
