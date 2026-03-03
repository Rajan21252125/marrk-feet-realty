import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with MarrkFeet Realty for any property inquiries in Mumbai. Our team is ready to help you find your dream home or manage your listings.',
    keywords: ["Contact MarrkFeet Realty", "Real Estate Inquiry Mumbai", "Mumbai Property Consultant Contact", "Real Estate Agent Number Mumbai"],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
