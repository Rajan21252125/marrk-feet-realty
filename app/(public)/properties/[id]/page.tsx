import Link from 'next/link';
import { Bed, Bath, Move, MapPin, Check, ArrowLeft, Heart, Share2, Calendar, User, Compass, Layers, Clock, Building2, Sparkles, Phone, ExternalLink } from 'lucide-react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { ScheduleForm } from '@/components/property/ScheduleForm';
import PropertyActions from '@/components/property/PropertyActions';
import Image from 'next/image';
import { Metadata } from 'next';
import { formatPrice } from '@/lib/utils';
import { FadeIn } from '@/components/ui/FadeIn';
import PropertyCarousel from '@/components/property/PropertyCarousel';
import EMICalculator from '@/components/property/EMICalculator';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { Button } from '@/components/ui/Button';

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

async function getRelatedProperties(currentId: string, propertyType: string, listingType: string, beds: number) {
    await dbConnect();
    try {
        const related = await Property.find({
            _id: { $ne: currentId },
            isActive: true,
            $or: [
                { listingType },
                { propertyType }
            ]
        })
            .limit(3)
            .lean();

        return JSON.parse(JSON.stringify(related));
    } catch (_error) {
        return [];
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
        title: `${property.title} | Markfeet Realty`,
        description: property.description.substring(0, 160),
    };
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const property = await getProperty(id);

    if (!property || !property.isActive) {
        notFound();
    }

    const relatedProperties = await getRelatedProperties(
        property._id,
        property.propertyType,
        property.listingType,
        property.beds
    );

    const images = property.images && property.images.length > 0
        ? property.images
        : ['https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11'];

    return (
        <div className="min-h-screen bg-white dark:bg-brand-navy pb-20">
            {/* Ultra-Condensed Header Identity Section */}
            <div className="bg-brand-navy pt-24 pb-8 relative overflow-hidden">
                {/* Subtle Background Glow */}
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-brand-orange/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 opacity-20" />

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    {/* Compact Breadcrumbs - Minimal vertical space */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
                        <nav className="inline-flex items-center gap-2 text-[8px] font-bold bg-white/5 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/5 text-gray-500">
                            <Link href="/" className="hover:text-brand-orange transition-colors uppercase tracking-widest">Home</Link>
                            <span className="text-white/5">/</span>
                            <Link href="/properties" className="hover:text-brand-orange transition-colors uppercase tracking-widest">Properties</Link>
                            <span className="text-white/5">/</span>
                            <span className="text-white truncate max-w-[100px] uppercase tracking-widest opacity-60">{property.title}</span>
                        </nav>

                        <div className="flex items-center gap-2 scale-75 md:scale-90 origin-right">
                            <PropertyActions propertyId={property._id} propertyTitle={property.title} />
                        </div>
                    </div>

                    {/* Highly Condensed Property Identity */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 animate-fade-in text-balance">
                        <div className="max-w-3xl flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-4">
                                <span className="bg-brand-orange text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em] shadow-lg shadow-brand-orange/20 leading-none">
                                    {property.listingType || 'For Sale'}
                                </span>
                                <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-[7px] font-black uppercase tracking-[0.2em] border border-white/10 leading-none">
                                    {property.propertyType}
                                </span>
                            </div>

                            <h1 className="text-2xl md:text-3xl lg:text-4xl font-black text-white mb-3 tracking-tighter leading-tight max-w-2xl">
                                {property.title}
                            </h1>

                            <div className="flex items-center text-gray-500 text-xs md:text-sm font-bold tracking-tight">
                                <MapPin className="mr-2 h-3.5 w-3.5 text-brand-orange" />
                                {property.location}
                            </div>
                        </div>

                        <div className="lg:text-right bg-white/5 backdrop-blur-2xl p-4 md:p-6 rounded-[1.5rem] border border-white/5 shadow-xl min-w-[240px]">
                            <p className="text-[8px] font-black text-white/20 uppercase tracking-[0.4em] mb-1">Value</p>
                            <p className="text-2xl md:text-4xl font-black text-brand-orange mb-2 tracking-tighter">
                                {formatPrice(property.price)}
                            </p>
                            <div className="inline-flex items-center gap-1.5 text-gray-500 font-bold text-[9px] bg-black/10 px-3 py-1.5 rounded-full border border-white/5">
                                <Sparkles size={10} className="text-brand-orange" />
                                Est. EMI: {formatPrice(property.price * 0.008)}*
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Carousel Section - Minimal gap */}
            <div className="container mx-auto px-4 md:px-6 relative z-20 -mt-4 mb-12">
                <FadeIn>
                    <div className="shadow-[0_20px_80px_rgba(0,0,0,0.3)]">
                        <PropertyCarousel
                            images={images}
                            title={property.title}
                            youtubeUrl={property.youtubeUrl}
                            hero={false}
                        />
                    </div>
                </FadeIn>
            </div>

            <div className="container mx-auto px-4 md:px-6 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2">
                        {/* Specifications Grid - Glassmorphic */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5 mb-16 md:mb-20">
                            {[
                                { icon: Building2, label: "Structure", value: property.propertyType },
                                { icon: Move, label: "Total Area", value: `${property.area} Sqft` },
                                { icon: Bed, label: "Configuration", value: `${property.beds} BHK` },
                                { icon: Compass, label: "Vastu / Facing", value: property.facing || "East" },
                                { icon: Layers, label: "Floor Elevation", value: `${property.floorNumber || 0}/${property.totalFloors || 7}` },
                                { icon: Clock, label: "Availability", value: property.possessionStatus || "Immediate" }
                            ].map((spec, i) => (
                                <FadeIn key={i} delay={i * 0.05}>
                                    <div className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex flex-col items-center text-center group hover:bg-white dark:hover:bg-brand-navy/80 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-500">
                                        <div className="w-10 h-10 md:w-12 md:h-12 bg-brand-orange/5 rounded-xl flex items-center justify-center text-brand-orange mb-3 md:mb-4 group-hover:bg-brand-orange group-hover:text-white transition-all transform group-hover:rotate-6">
                                            <spec.icon size={20} />
                                        </div>
                                        <p className="text-[8px] uppercase tracking-[0.3em] text-gray-500 font-black mb-1 md:mb-1.5">{spec.label}</p>
                                        <p className="font-black text-base md:text-lg text-brand-navy dark:text-white tracking-tight">{spec.value}</p>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>

                        {/* Premium Description Section */}
                        <div className="mb-20">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-brand-navy dark:text-white tracking-tighter uppercase leading-none">
                                    The <span className="text-brand-orange">Property</span> Vision
                                </h2>
                                <div className="h-px flex-1 bg-brand-navy/10 dark:bg-white/10" />
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm md:text-base font-medium first-letter:text-4xl md:first-letter:text-5xl first-letter:font-black first-letter:text-brand-orange first-letter:mr-2.5 first-letter:float-left first-letter:leading-[0.8]">
                                {property.description}
                            </p>
                        </div>

                        {/* Interactive Tools Section */}
                        <div className="mb-20">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-brand-navy dark:text-white tracking-tighter uppercase leading-none">
                                    Financial <span className="text-brand-orange">Planning</span>
                                </h2>
                                <div className="h-px flex-1 bg-brand-navy/10 dark:bg-white/10" />
                            </div>
                            <FadeIn>
                                <EMICalculator propertyPrice={property.price} />
                            </FadeIn>
                        </div>

                        {/* Lifestyle Features */}
                        <div className="mb-20">
                            <div className="flex items-center gap-4 mb-8">
                                <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-brand-navy dark:text-white tracking-tighter uppercase leading-none">
                                    Lifestyle <span className="text-brand-orange">Curated</span>
                                </h2>
                                <div className="h-px flex-1 bg-brand-navy/10 dark:bg-white/10" />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {['24/7 Security', 'Power Backup', 'Lift Access', 'Parking Area', 'Water Supply', 'Fire Safety', 'Club House', 'Gym'].map((amenity, i) => (
                                    <div key={i} className="flex items-center gap-2.5 p-3.5 md:p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 hover:border-brand-orange/30 transition-colors group">
                                        <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-brand-orange/5 flex items-center justify-center text-brand-orange group-hover:bg-brand-orange group-hover:text-white transition-all">
                                            <Check size={14} strokeWidth={3} />
                                        </div>
                                        <span className="text-[8px] font-black uppercase tracking-widest text-brand-navy dark:text-white leading-tight">{amenity}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Premium Sidebar Portal */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-28">
                            <div className="p-7 md:p-8 lg:p-10 rounded-[2.5rem] bg-white dark:bg-brand-navy border border-gray-100 dark:border-white/10 shadow-[0_20px_80px_rgba(0,0,0,0.1)] relative overflow-hidden group">
                                {/* Decorative Gradient Overlay */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/5 rounded-full blur-3xl -translate-x-10 -translate-y-10 group-hover:scale-150 transition-transform duration-1000" />

                                <div className="relative z-10">
                                    <div className="inline-flex items-center gap-2 bg-brand-orange/10 text-brand-orange px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest mb-6 md:mb-8">
                                        <ExternalLink size={10} /> VIP Inquiry
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-black text-brand-navy dark:text-white mb-3 tracking-tighter leading-tight">Secure Your Interest</h3>
                                    <p className="text-gray-500 text-[11px] md:text-xs font-medium mb-6 md:mb-8 leading-relaxed">Submit your details and we will reach out with an exclusive site visit plan.</p>

                                    <div className="space-y-4">
                                        <ScheduleForm propertyTitle={property.title} />
                                    </div>

                                    {/* Founder Branding Section */}
                                    <div className="mt-8 md:mt-10 pt-6 md:pt-8 border-t border-brand-navy/5 dark:border-white/5">
                                        <div className="bg-gray-50 dark:bg-white/5 p-4 md:p-5 rounded-[1.5rem] border border-gray-100 dark:border-white/10">
                                            <div className="flex items-center gap-3 md:gap-4 mb-6">
                                                <div className="w-14 h-14 md:w-16 md:h-16 rounded-xl bg-brand-orange/10 flex items-center justify-center text-brand-orange font-bold text-xl border border-brand-orange/20 overflow-hidden relative shadow-md">
                                                    <Image
                                                        src="/founder.jpeg"
                                                        alt="Ankit Rajput - Founder"
                                                        fill
                                                        className="object-contain group-hover:scale-110 transition-transform duration-500"
                                                    />
                                                </div>
                                                <div>
                                                    <p className="font-black text-brand-navy dark:text-white text-base md:text-lg tracking-tight">Ankit Rajput</p>
                                                    <p className="text-[8px] font-black text-brand-orange uppercase tracking-[0.2em] mt-0.5">Founder & CEO</p>
                                                </div>
                                            </div>

                                            <div className="space-y-2.5">
                                                <a href="tel:9326914511" className="flex items-center justify-center gap-2 w-full py-3.5 md:py-4 bg-brand-navy text-white font-black rounded-xl hover:bg-black transition-all shadow-lg shadow-brand-navy/20 group/btn text-[11px] md:text-xs">
                                                    <Phone size={14} className="group-hover/btn:rotate-12 transition-transform" />
                                                    Consultation
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Recommendations Section */}
                {relatedProperties.length > 0 && (
                    <div className="mt-16 md:mt-24 pt-12 md:pt-16 border-t border-brand-navy/5 dark:border-white/5">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
                            <div className="max-w-3xl">
                                <div className="inline-flex items-center gap-3 text-brand-orange font-black uppercase tracking-[0.4em] text-[8px] mb-4">
                                    <div className="w-8 h-0.5 bg-brand-orange rounded-full" />
                                    Suggestions
                                </div>
                                <h2 className="text-xl md:text-3xl font-black text-brand-navy dark:text-white tracking-tighter leading-none mb-3">
                                    Similar Luxury <span className="text-brand-orange">Opportunities</span>
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 text-sm md:text-base font-bold">Extraordinary properties selected for you.</p>
                            </div>
                            <Link href="/properties">
                                <Button variant="outline" className="rounded-full border-brand-navy/10 dark:border-white/10 font-black px-6 md:px-8 py-4 md:py-6 text-[10px] uppercase tracking-[0.2em] hover:bg-brand-navy hover:text-white transition-all shadow-lg shadow-black/5">
                                    Explore More
                                </Button>
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
                            {relatedProperties.map((p: any, i: number) => (
                                <FadeIn key={p._id} delay={i * 0.1}>
                                    <PropertyCard
                                        id={p._id}
                                        title={p.title}
                                        price={p.price}
                                        location={p.location}
                                        beds={p.beds}
                                        baths={p.baths}
                                        area={p.area}
                                        imageUrl={p.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11'}
                                        category={p.propertyType}
                                        builder={p.builder}
                                        tags={p.tags}
                                    />
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
