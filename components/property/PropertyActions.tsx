'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Share2, Heart } from 'lucide-react';
import toast from 'react-hot-toast';

interface PropertyActionsProps {
    propertyId: string;
    propertyTitle: string;
}

export default function PropertyActions({ propertyId, propertyTitle }: PropertyActionsProps) {
    const [isLiked, setIsLiked] = useState(false);

    useEffect(() => {
        // Check if property is already liked in localStorage
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');
        if (savedProperties.includes(propertyId)) {
            setIsLiked(true);
        }
    }, [propertyId]);

    const handleShare = async () => {
        const url = window.location.href;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: propertyTitle,
                    text: `Check out this property: ${propertyTitle}`,
                    url: url,
                });
            } catch (error) {
                // User denied or share failed, fallback to clipboard
                console.log('Error sharing:', error);
                copyToClipboard(url);
            }
        } else {
            copyToClipboard(url);
        }
    };

    const copyToClipboard = (url: string) => {
        navigator.clipboard.writeText(url).then(() => {
            toast.success('Link copied to clipboard!');
        }).catch(() => {
            toast.error('Failed to copy link');
        });
    };

    const handleLike = () => {
        const savedProperties = JSON.parse(localStorage.getItem('savedProperties') || '[]');

        if (isLiked) {
            // Remove from saved
            const updatedProperties = savedProperties.filter((id: string) => id !== propertyId);
            localStorage.setItem('savedProperties', JSON.stringify(updatedProperties));
            setIsLiked(false);
            toast.success('Removed from saved properties');
        } else {
            // Add to saved
            savedProperties.push(propertyId);
            localStorage.setItem('savedProperties', JSON.stringify(savedProperties));
            setIsLiked(true);
            toast.success('Added to saved properties');
        }
    };

    return (
        <div className="flex gap-4">
            <Button
                variant="outline"
                className="flex-1 py-6 border-gray-200 dark:border-white/10"
                onClick={handleShare}
            >
                <Share2 size={18} className="mr-2" /> Share
            </Button>
            <Button
                variant="outline"
                className={`flex-1 py-6 border-gray-200 dark:border-white/10 ${isLiked ? 'text-red-500 hover:text-red-600' : ''}`}
                onClick={handleLike}
            >
                <Heart size={18} className={`mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {isLiked ? 'Saved' : 'Save'}
            </Button>
        </div>
    );
}
