import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Bed, Bath, Move, MapPin, Check, ArrowLeft, Heart, Share2, Calendar, User, Compass, Layers, Clock, Building2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { ScheduleForm } from '@/components/property/ScheduleForm';
import PropertyActions from '@/components/property/PropertyActions';
import Image from 'next/image';
import { Metadata } from 'next';
import { formatPrice } from '@/lib/utils';
import { FadeIn } from '@/components/ui/FadeIn';

async function getProperty(id: string) {
    await dbConnect();
    try {
        const property = await Property.findById(id).lean();
        if (!property) return null;
        return JSON.parse(JSON.stringify(property));
    } catch (_error) {
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const property = await getProperty(id);

    if (!property) {
        return {
            title: 'Property Not Found',
        };
    }

    return {
        title: property.title,
        description: property.description.substring(0, 160),
    };
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await getProperty(id);

    if (!property || !property.isActive) {
        notFound();
    }

    const images = property.images && property.images.length > 0
        ? property.images
        : ['https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11'];

    return (
        <div className="min-h-screen bg-white dark:bg-black pb-20 pt-20">
            {/* Dark Header Section */}
            <div className="bg-brand-navy pt-12 pb-16 mb-12 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-brand-orange/5 to-transparent pointer-events-none" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Breadcrumbs & Actions */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-12">
                        <nav className="flex items-center gap-2 text-sm font-medium text-gray-400">
                            <Link href="/" className="hover:text-brand-orange transition-colors">Home</Link>
                            <span>/</span>
                            <Link href="/properties" className="hover:text-brand-orange transition-colors">Properties</Link>
                            <span>/</span>
                            <span className="text-white truncate max-w-[200px]">{property.title}</span>
                        </nav>
                        <div className="flex items-center gap-3">
                            <Button variant="outline" className="rounded-full gap-2 border-white/10 text-white hover:bg-white/5">
                                <Share2 size={18} /> Share
                            </Button>
                            <PropertyActions propertyId={property._id} propertyTitle={property.title} />
                        </div>
                    </div>

                    {/* Property Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="bg-brand-orange text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                                    {property.listingType || 'For Sale'}
                                </span>
                                <span className="bg-white/10 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                                    {property.propertyType}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 tracking-tighter leading-tight">
                                {property.title}
                            </h1>
                            <div className="flex items-center text-gray-300 text-xl font-medium">
                                <MapPin className="mr-3 h-6 w-6 text-brand-orange" />
                                {property.location}
                            </div>
                        </div>
                        <div className="lg:text-right">
                            <p className="text-5xl md:text-7xl font-black text-brand-orange mb-2 tracking-tighter">
                                {formatPrice(property.price)}
                            </p>
                            <p className="text-gray-400 font-bold text-lg">
                                Est. EMI: {formatPrice(property.price * 0.008)} /mo*
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 md:px-6">

                {/* Bento Gallery */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[600px] mb-12 rounded-[2rem] overflow-hidden">
                    <div className="md:col-span-2 relative group overflow-hidden">
                        <Image
                            src={images[0]}
                            alt={property.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    </div>
                    <div className="hidden md:grid col-span-2 grid-cols-2 grid-rows-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative group overflow-hidden">
                                <Image
                                    src={images[i] || images[0]}
                                    alt={`${property.title} ${i}`}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                {!images[i] && (
                                    <div className="absolute inset-0 bg-brand-navy/40 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                                        Coming Soon
                                    </div>
                                )}
                                {i === 4 && images.length > 5 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold cursor-pointer group-hover:bg-black/40 transition-colors">
                                        +{images.length - 5} More Photos
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Specifications Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
                            {[
                                { icon: Building2, label: "Type", value: property.propertyType },
                                { icon: Move, label: "Area", value: `${property.area} Sqft` },
                                { icon: Bed, label: "BHK", value: `${property.beds} BHK` },
                                { icon: Compass, label: "Facing", value: property.facing || "East" },
                                { icon: Layers, label: "Floor", value: `${property.floorNumber || 0}/${property.totalFloors || 7}` },
                                { icon: Clock, label: "Possession", value: property.possessionStatus || "Ready" }
                            ].map((spec, i) => (
                                <FadeIn key={i} delay={i * 0.05}>
                                    <div className="p-6 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col items-center text-center group hover:bg-white dark:hover:bg-white/10 hover:shadow-xl transition-all duration-300">
                                        <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange mb-4 group-hover:bg-brand-orange group-hover:text-white transition-all">
                                            <spec.icon size={24} />
                                        </div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">{spec.label}</p>
                                        <p className="font-bold text-brand-navy dark:text-white">{spec.value}</p>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>

                        {/* Description */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Property Description</h2>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                {property.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-brand-navy dark:text-white mb-6">Amenities & Features</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {['24/7 Security', 'Power Backup', 'Lift Access', 'Parking Area', 'Water Supply', 'Fire Safety'].map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                        <div className="w-8 h-8 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange">
                                            <Check size={16} />
                                        </div>
                                        <span className="text-sm font-bold text-brand-navy dark:text-white">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28">
                            <div className="p-8 rounded-[2rem] bg-white dark:bg-brand-navy border border-gray-100 dark:border-white/10 shadow-2xl">
                                <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-2">Request Inquiry</h3>
                                <p className="text-gray-500 text-sm mb-8">Fill the form below and our property expert will get back to you within 24 hours.</p>

                                <ScheduleForm propertyTitle={property.title} />

                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-14 h-14 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-xl border-2 border-brand-orange/20 overflow-hidden">
                                            <Image src="https://i.pravatar.cc/150?img=11" alt="Agent" width={56} height={56} className="object-cover" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-brand-navy dark:text-white">Ankit Rajput</p>
                                            <p className="text-xs font-bold text-brand-orange uppercase tracking-wider">Property Consultant</p>
                                        </div>
                                    </div>
                                    <a href="tel:9326914511" className="flex items-center justify-center gap-2 w-full py-4 bg-brand-navy dark:bg-white/10 text-white font-bold rounded-xl hover:bg-brand-navy/90 transition-all">
                                        Call Agent
                                    </a>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
