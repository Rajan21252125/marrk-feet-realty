import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About Us',
    description: 'Learn about MarrkFeet Realty\'s journey since 2024. Our mission is to redefine Mumbai real estate through transparency and cinematic property showcases.',
    keywords: ["About MarrkFeet Realty", "Mumbai Real Estate Agency", "Real Estate Journey", "Ankit Rajput", "Shivendra Rajput"],
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
