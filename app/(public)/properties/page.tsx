import { Metadata } from 'next';
import PropertiesContent from './PropertiesContent';

export const metadata: Metadata = {
    title: 'Properties',
    description: 'Browse our exclusive collection of luxury properties. Filter by type, location, and price to find your dream home.',
};

export default function PropertiesPage() {
    return <PropertiesContent />;
}
