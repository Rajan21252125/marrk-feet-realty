'use client';

import { CheckCircle2, X } from "lucide-react";
import { Button } from "./Button";
import { useEffect, useState } from "react";

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message?: string;
}

export function SuccessModal({
    isOpen,
    onClose,
    title = "Inquiry Sent Successfully!",
    message = "Thank you for reaching out. Our team will get back to you within 24 hours to assist with your real estate goals."
}: SuccessModalProps) {
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setIsRendered(true);
            document.body.style.overflow = 'hidden';
        } else {
            const timer = setTimeout(() => setIsRendered(false), 300);
            document.body.style.overflow = 'unset';
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    if (!isRendered) return null;

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        >
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-brand-navy/60 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* Modal Content */}
            <div
                className={`relative bg-white dark:bg-neutral-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl transition-all duration-300 transform ${isOpen ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="p-8 md:p-10 text-center">
                    {/* Icon Container */}
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-500/10 text-green-500 mb-8 animate-bounce-subtle">
                        <CheckCircle2 size={40} />
                    </div>

                    <h3 className="text-2xl md:text-3xl font-bold text-primary-dark dark:text-white mb-4">
                        {title}
                    </h3>

                    <p className="text-gray-500 dark:text-gray-400 text-lg leading-relaxed mb-10">
                        {message}
                    </p>

                    <Button
                        onClick={onClose}
                        className="w-full h-14 text-lg font-bold bg-brand-orange hover:bg-brand-orange/90 text-white rounded-2xl shadow-lg shadow-brand-orange/20"
                    >
                        Great, Thank You!
                    </Button>
                </div>

                {/* Decorative Bottom Bar */}
                <div className="h-2 bg-brand-orange w-full"></div>
            </div>

            <style jsx global>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
}
