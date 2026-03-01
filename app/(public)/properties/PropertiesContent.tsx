'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search, ChevronDown } from "lucide-react";
import { toast } from 'react-hot-toast';

import { IPropertyData } from '@/models/Property';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { PropertyFilter, FilterState } from '@/components/property/PropertyFilter';
import { FadeIn } from '@/components/ui/FadeIn';
import { Button } from '@/components/ui/Button';

interface PropertiesContentProps {
    initialProperties: IPropertyData[];
}

const PropertiesContent: React.FC<PropertiesContentProps> = ({ initialProperties }) => {
    const [properties, setProperties] = useState<IPropertyData[]>(initialProperties || []);
    const [filteredProperties, setFilteredProperties] = useState<IPropertyData[]>(initialProperties || []);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const itemsPerPage = 12;

    useEffect(() => {
        if (initialProperties?.length > 0) return;

        const fetchProperties = async () => {
            try {
                const res = await fetch('/api/properties');
                const data = await res.json();
                if (Array.isArray(data)) {
                    const activeProperties = data.filter((p: IPropertyData) => p.isActive);
                    setProperties(activeProperties);
                    setFilteredProperties(activeProperties);
                }
            } catch (error) {
                console.error("Failed to fetch properties", error);
                toast.error("Failed to load properties");
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [initialProperties]);

    const lastFiltersRef = useRef<FilterState>({
        status: 'All',
        location: [],
        type: [],
        budget: [0, 500]
    });

    const handleFilterChange = useCallback((filters: FilterState) => {
        lastFiltersRef.current = filters;
        let filtered = properties as IPropertyData[];

        // Status Filter (Buy/Rent mapping to Sale/Rent)
        if (filters.status !== 'All') {
            const targetType = filters.status === 'Buy' ? 'Sale' : 'Rent';
            filtered = filtered.filter(p => p.listingType === targetType);
        }

        // Location Filter
        if (filters.location.length > 0) {
            filtered = filtered.filter(p => filters.location.some(loc => p.location?.toLowerCase().includes(loc.toLowerCase())));
        }

        // Type Filter (BHK)
        if (filters.type.length > 0) {
            filtered = filtered.filter(p => filters.type.some(t =>
                p.title?.toLowerCase().includes(t.toLowerCase()) ||
                p.propertyType?.toLowerCase().includes(t.toLowerCase()) ||
                p.bhkType?.toLowerCase().includes(t.toLowerCase())
            ));
        }

        // Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.location.toLowerCase().includes(query) ||
                p.builder?.toLowerCase().includes(query)
            );
        }

        // Budget Filter Scaling
        const scaleValue = (val: number, status: string) => {
            if (status === 'Rent') return val; // Rent is already in absolute INR
            if (val >= 100) return (val / 100) * 10000000; // Cr
            return val * 100000; // Lac
        };

        const minBudget = scaleValue(filters.budget[0], filters.status);
        const maxBudget = scaleValue(filters.budget[1], filters.status);

        filtered = filtered.filter(p => p.price >= minBudget && p.price <= maxBudget);

        // Sorting
        if (sortBy === 'newest') {
            filtered = [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'price-low') {
            filtered = [...filtered].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered = [...filtered].sort((a, b) => b.price - a.price);
        }

        setFilteredProperties(filtered);
        setCurrentPage(1);
    }, [properties, searchQuery, sortBy]);

    // Re-apply filters when search or sort changes
    useEffect(() => {
        handleFilterChange(lastFiltersRef.current);
    }, [searchQuery, sortBy, properties, handleFilterChange]);

    // Pagination logic
    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    const currentProperties = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 400, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-neutral-950">
            {/* Page Hero Redesign */}
            <section className="relative pt-32 pb-20 overflow-hidden">
                <div className="container mx-auto px-4 relative z-10">
                    <FadeIn direction="up">
                        <span className="text-accent font-black uppercase tracking-[0.3em] text-xs mb-4 block">
                            Browse Listings
                        </span>
                        <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
                            Properties in <span className="text-accent">Mumbai</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mb-12 font-medium leading-relaxed">
                            Explore our curated selection of properties across Mumbai&apos;s Western Line.
                        </p>

                        {/* Search Bar */}
                        <div className="relative max-w-2xl group">
                            <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
                            <div className="relative flex items-center bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 focus-within:border-accent/50 transition-all duration-300">
                                <div className="pl-6 pointer-events-none">
                                    <Search className="h-5 w-5 text-gray-500" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search by name, location, or builder..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent border-none px-6 py-5 text-white placeholder:text-gray-600 focus:ring-0 text-lg font-medium"
                                />
                            </div>
                        </div>
                    </FadeIn>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </section>

            <div className="container mx-auto px-4 py-8">
                {/* Mobile Filter Toggle & Stats Row */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <span className="text-white font-bold text-lg">
                            {filteredProperties.length} <span className="text-gray-500 font-medium text-base">properties found</span>
                        </span>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="lg:hidden flex-1">
                            <Button
                                onClick={() => setShowMobileFilters(!showMobileFilters)}
                                className="w-full bg-neutral-900 text-white border border-white/10 hover:bg-neutral-800 h-14 rounded-2xl flex items-center justify-center gap-2 font-bold"
                            >
                                <SlidersHorizontal size={20} />
                                Filters
                            </Button>
                        </div>

                        <div className="relative flex-1 md:flex-none">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full md:w-48 appearance-none bg-neutral-900 border border-white/10 text-white px-6 py-4 rounded-2xl font-bold focus:ring-0 focus:border-accent hover:border-white/20 transition-all cursor-pointer text-sm"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Sidebar Filter */}
                    <aside className={`lg:w-1/3 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24">
                            <PropertyFilter onFilterChange={handleFilterChange} />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="lg:w-2/3">
                        {loading ? (
                            <div className="grid gap-8 sm:grid-cols-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="h-[400px] bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl" />
                                ))}
                            </div>
                        ) : (
                            <>
                                {filteredProperties.length > 0 ? (
                                    <>
                                        <div className="grid gap-8 sm:grid-cols-2 mb-16">
                                            {currentProperties.map((property, index) => (
                                                <FadeIn key={property._id.toString()} delay={(index % 3) * 0.1} direction="up">
                                                    <PropertyCard
                                                        id={property._id.toString()}
                                                        title={property.title}
                                                        price={property.price}
                                                        location={property.location}
                                                        beds={property.beds}
                                                        baths={property.baths}
                                                        area={property.area}
                                                        imageUrl={property.images?.[0] || 'https://images.unsplash.com/photo-1600596542815-e32c0ee3ad11'}
                                                        category={property.propertyType}
                                                        listingType={property.listingType}
                                                        builder={property.builder}
                                                        tags={property.tags}
                                                    />
                                                </FadeIn>
                                            ))}
                                        </div>

                                        {/* Pagination Controls */}
                                        {filteredProperties.length > itemsPerPage && (
                                            <div className="flex justify-center items-center gap-2">
                                                <button
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className="p-3 rounded-xl border border-gray-900 text-gray-900 dark:text-white dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>

                                                <div className="flex gap-2">
                                                    {[...Array(totalPages)].map((_, i) => (
                                                        <button
                                                            key={i}
                                                            onClick={() => handlePageChange(i + 1)}
                                                            className={`w-12 h-12 rounded-xl font-bold transition-all ${currentPage === i + 1
                                                                ? 'bg-accent text-white shadow-xl shadow-accent/20'
                                                                : 'bg-white text-black dark:text-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5'
                                                                }`}
                                                        >
                                                            {i + 1}
                                                        </button>
                                                    ))}
                                                </div>

                                                <button
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className="p-3 rounded-xl border border-gray-900 text-gray-900 dark:text-white dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-24 bg-white dark:bg-neutral-900 rounded-3xl border border-dashed border-gray-300 dark:border-white/10 shadow-sm">
                                        <div className="p-4 bg-gray-100 dark:bg-white/5 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                                            <SlidersHorizontal className="text-gray-400" size={32} />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">No Properties Found</h3>
                                        <p className="text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                                            We couldn&apos;t find any properties matching your current filters. Try adjusting your preferences.
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="mt-8 border-accent text-accent hover:bg-accent hover:text-white rounded-xl"
                                            onClick={() => window.location.reload()}
                                        >
                                            Reset All Filters
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default PropertiesContent;
