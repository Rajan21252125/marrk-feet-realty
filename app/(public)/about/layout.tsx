import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'About Us',
    description: `Learn about ${SITE_NAME}'s journey since 2024. Our mission is to redefine Mumbai real estate through transparency and cinematic property showcases.`,
    keywords: [`About ${SITE_NAME}`, "Mumbai Real Estate Agency", "Real Estate Journey", "Ankit Rajput", "Shivendra Rajput"],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
