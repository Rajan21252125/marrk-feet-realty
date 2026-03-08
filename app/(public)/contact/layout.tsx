import { Metadata } from 'next';
import { SITE_NAME } from '@/lib/constants';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: `Get in touch with ${SITE_NAME} for any property inquiries in Mumbai. Our team is ready to help you find your dream home or manage your listings.`,
    keywords: [`Contact ${SITE_NAME}`, "Real Estate Inquiry Mumbai", "Mumbai Property Consultant Contact", "Real Estate Agent Number Mumbai"],
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
}
