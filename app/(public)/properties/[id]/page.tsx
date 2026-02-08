import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Bed, Bath, Move, MapPin, Check, ArrowLeft, Share2, Heart } from 'lucide-react';
import { notFound } from 'next/navigation';
import dbConnect from '@/lib/db';
import Property from '@/models/Property';
import { ScheduleForm } from '@/components/property/ScheduleForm';
import ImageSlider from '@/components/property/ImageSlider';
import PropertyActions from '@/components/property/PropertyActions';


import { Metadata } from 'next';

async function getProperty(id: string) {
    await dbConnect();
    try {
        const property = await Property.findById(id).lean();
        if (!property) return null;
        return JSON.parse(JSON.stringify(property));
    } catch (error) {
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

    if (!property) {
        notFound();
    }

    if (!property.isActive) {
        return (
            <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
                <div className="text-center p-8 max-w-md">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Property Not Available</h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        This property is currently not available or has been removed.
                    </p>
                    <Link href="/properties">
                        <Button variant="outline">Browse Other Properties</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white dark:bg-black pb-20">
            {/* Full Width Hero Image Slider */}
            <div className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden">
                <ImageSlider images={property.images} title={property.title} />

                {/* Back Button - Absolute positioned on top of slider */}
                <div className="absolute top-24 left-4 md:left-8 z-30">
                    <Link href="/properties">
                        <Button variant="outline" className="bg-white/20 hover:bg-white/40 text-white border-white/20 backdrop-blur-md gap-2">
                            <ArrowLeft size={18} /> Back to Listings
                        </Button>
                    </Link>
                </div>

                {/* Property Title Overlay - Absolute positioned on top of slider */}
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 text-white z-20 pointer-events-none">
                    <div className="container mx-auto pointer-events-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="inline-block bg-accent px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-4">
                                    {property.propertyType}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-2 max-w-4xl drop-shadow-md">
                                    {property.title}
                                </h1>
                                <div className="flex items-center text-lg md:text-xl text-gray-200 drop-shadow-sm">
                                    <MapPin className="mr-2 h-5 w-5 text-accent" />
                                    {property.location}
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-4xl md:text-5xl font-bold drop-shadow-md">${property.price.toLocaleString()}</p>
                                <p className="text-gray-300 text-lg drop-shadow-sm">For Sale</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-20">
                <div className="grid gap-12 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Quick Stats Bar */}
                        <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-white/5 flex flex-wrap justify-between items-center gap-6 mb-10">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-primary-dark dark:text-white">
                                    <Bed size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Bedrooms</p>
                                    <p className="text-xl font-bold">{property.beds}</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-primary-dark dark:text-white">
                                    <Bath size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Bathrooms</p>
                                    <p className="text-xl font-bold">{property.baths}</p>
                                </div>
                            </div>
                            <div className="w-px h-12 bg-gray-200 dark:bg-white/10 hidden sm:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-xl text-primary-dark dark:text-white">
                                    <Move size={24} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Area</p>
                                    <p className="text-xl font-bold">{property.area} <span className="text-sm font-normal text-gray-400">sqft</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-6">About this property</h2>
                            <p className="text-lg leading-loose text-gray-600 dark:text-gray-300">
                                {property.description}
                            </p>
                        </div>

                        {/* Property Overview */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-6">Property Overview</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6 gap-x-8 bg-gray-50 dark:bg-white/5 p-6 rounded-2xl">
                                {property.bhkType && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Configuration</p>
                                        <p className="font-semibold">{property.bhkType}</p>
                                    </div>
                                )}
                                {property.furnishType && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Furnishing</p>
                                        <p className="font-semibold">{property.furnishType}</p>
                                    </div>
                                )}
                                {(property.floorNumber !== undefined || property.totalFloors !== undefined) && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Floor Details</p>
                                        <p className="font-semibold">
                                            {property.floorNumber !== undefined ? `${property.floorNumber}` : '-'}
                                            {property.totalFloors ? ` / ${property.totalFloors}` : ''}
                                        </p>
                                    </div>
                                )}
                                {property.facing && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Facing</p>
                                        <p className="font-semibold">{property.facing}</p>
                                    </div>
                                )}
                                {(property.coveredParking || property.openParking) && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Parking</p>
                                        <p className="font-semibold">
                                            {property.coveredParking ? `${property.coveredParking} Covered` : ''}
                                            {property.coveredParking && property.openParking ? ', ' : ''}
                                            {property.openParking ? `${property.openParking} Open` : ''}
                                        </p>
                                    </div>
                                )}
                                {property.ageOfProperty !== undefined && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Age of Property</p>
                                        <p className="font-semibold">{property.ageOfProperty} Years</p>
                                    </div>
                                )}
                                {property.ownershipType && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Ownership</p>
                                        <p className="font-semibold">{property.ownershipType}</p>
                                    </div>
                                )}
                                {property.possessionStatus && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Possession</p>
                                        <p className="font-semibold">{property.possessionStatus}</p>
                                    </div>
                                )}
                                {property.balcony !== undefined && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Balconies</p>
                                        <p className="font-semibold">{property.balcony}</p>
                                    </div>
                                )}
                                {property.tenantPreference && property.tenantPreference.length > 0 && (
                                    <div className="col-span-2 md:col-span-3">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Preferred Tenants</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {property.tenantPreference.map((pref: string) => (
                                                <span key={pref} className="px-2 py-1 bg-white dark:bg-white/10 rounded-md text-xs font-medium border border-gray-200 dark:border-white/10">
                                                    {pref}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {property.overlooking && property.overlooking.length > 0 && (
                                    <div className="col-span-2 md:col-span-3">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Overlooking</p>
                                        <p className="font-semibold">{property.overlooking.join(', ')}</p>
                                    </div>
                                )}
                                {property.petFriendly !== undefined && (
                                    <div>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Pet Friendly</p>
                                        <p className="font-semibold">{property.petFriendly ? 'Yes' : 'No'}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amenities */}
                        <div className="mb-12">
                            <h2 className="text-2xl font-bold text-primary-dark dark:text-white mb-6">Features & Amenities</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                {['Air Conditioning', 'Swimming Pool', 'Central Heating', 'Laundry Room', 'Gym', 'Alarm', 'Window Coverings', 'WiFi', 'Elevator', 'Garage'].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
                                        <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar / Contact */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 space-y-6">
                            {/* Action Buttons */}
                            <PropertyActions propertyId={property._id} propertyTitle={property.title} />

                            {/* Contact Form Card */}
                            <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-gray-200 dark:border-white/10 shadow-lg p-6 md:p-8">
                                <h3 className="text-2xl font-bold text-primary-dark dark:text-white mb-2">Schedule a Viewing</h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                                    Interested in this property? Fill out the form below to schedule a visit.
                                </p>

                                <ScheduleForm propertyTitle={property.title} />

                                <div className="mt-8 pt-8 border-t border-gray-100 dark:border-white/5">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="h-14 w-14 rounded-full bg-gray-100 overflow-hidden relative">
                                            <img src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Agent" className="object-cover w-full h-full" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-lg text-primary-dark dark:text-white">Sarah Jenkins</p>
                                            <p className="text-sm text-accent">Senior Real Estate Agent</p>
                                        </div>
                                    </div>
                                    <Button variant="outline" className="w-full border-primary-dark text-primary-dark hover:bg-primary-dark hover:text-white transition-all">
                                        Call Agent
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
