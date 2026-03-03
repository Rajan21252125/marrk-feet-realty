import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Services',
    description: 'Explore comprehensive real estate services by MarrkFeet Realty: property sourcing, marketing, video production, and legal documentation in Mumbai.',
    keywords: ["Real Estate Services Mumbai", "Property Sourcing", "Property Marketing", "Video Production Real Estate", "Investment Consulting Mumbai"],
};

export default function ServicesLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
