'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, SlidersHorizontal, Search, ChevronDown, MapPin } from "lucide-react";
import { toast } from 'react-hot-toast';

import { IPropertyData } from '@/models/Property';
import { PropertyCard } from '@/components/ui/PropertyCard';
import { PropertyFilter, FilterState } from '@/components/property/PropertyFilter';
import { FadeIn } from '@/components/ui/FadeIn';

import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import { useSearchParams } from 'next/navigation';

interface PropertiesContentProps {
    initialProperties: IPropertyData[];
}

const PropertiesContent: React.FC<PropertiesContentProps> = ({ initialProperties }) => {
    const searchParams = useSearchParams();
    const [properties, setProperties] = useState<IPropertyData[]>(initialProperties || []);
    const [filteredProperties, setFilteredProperties] = useState<IPropertyData[]>(initialProperties || []);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const itemsPerPage = 9;
    const isFirstMount = useRef(true);
    const lastController = useRef<AbortController | null>(null);

    // Normalize Search Parameters from URL
    const typeParam = searchParams.get('type')?.toLowerCase();
    const normalizedStatus: 'All' | 'Buy' | 'Rent' =
        typeParam === 'buy' ? 'Buy' :
            typeParam === 'rent' ? 'Rent' : 'All';

    const locationParam = searchParams.get('location') || "";

    // Map budget param to label for PropertyFilter
    const budgetParam = searchParams.get('budget');
    let initialBudgetLabel = "";
    if (normalizedStatus === 'Rent') {
        if (budgetParam === "15") initialBudgetLabel = "Under 15k";
        else if (budgetParam === "25") initialBudgetLabel = "15k - 25k";
        else if (budgetParam === "50") initialBudgetLabel = "25k - 50k";
        else if (budgetParam === "100") initialBudgetLabel = "50k - 1 Lakh";
        else if (budgetParam === "1000") initialBudgetLabel = "1 Lakh+";
    } else {
        if (budgetParam === "50") initialBudgetLabel = "Under 50 Lac";
        else if (budgetParam === "100") initialBudgetLabel = "50 Lac - 1 Cr";
        else if (budgetParam === "200") initialBudgetLabel = "1 Cr - 2 Cr";
        else if (budgetParam === "500") initialBudgetLabel = "2 Cr - 5 Cr";
    }

    // Initialize ref with URL params to ensure first filter run is correct
    const lastFiltersRef = useRef<FilterState>({
        status: normalizedStatus,
        location: locationParam ? [locationParam] : [],
        propertyType: "",
        bhkType: "",
        budget: [0, 1000000000]
    });

    const fetchProperties = useCallback(async (filters?: FilterState) => {
        // Abort any ongoing request before starting a new one
        if (lastController.current) {
            lastController.current.abort();
        }

        const controller = new AbortController();
        lastController.current = controller;

        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (filters) {
                if (filters.status !== 'All') {
                    params.append('listingType', filters.status === 'Buy' ? 'Sale' : 'Rent');
                }
                if (filters.location.length > 0) {
                    params.append('location', filters.location[0]);
                }
                if (filters.propertyType) {
                    params.append('type', filters.propertyType);
                }
                if (filters.bhkType) {
                    params.append('bhkType', filters.bhkType);
                }
                if (filters.budget[0] > 0) {
                    params.append('minPrice', filters.budget[0].toString());
                }
                if (filters.budget[1] < 1000000000) {
                    params.append('maxPrice', filters.budget[1].toString());
                }
            }

            const res = await fetch(`/api/properties${params.toString() ? `?${params.toString()}` : ''}`, {
                signal: controller.signal
            });

            if (!res.ok) {
                throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (Array.isArray(data)) {
                // API already filters isActive:true
                setProperties(data);
                setFilteredProperties(data);
            }
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                return; // Ignore intentional cancellation
            }
            console.error("Failed to fetch properties", error);
            toast.error("Failed to load properties");
        } finally {
            // Only clear loading if this was the latest request
            if (lastController.current === controller) {
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (initialProperties?.length > 0 && isFirstMount.current) {
            setProperties(initialProperties);
            setFilteredProperties(initialProperties);
            return;
        }

        fetchProperties(lastFiltersRef.current);
    }, [initialProperties, fetchProperties]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, sortBy]);

    const handleFilterChange = useCallback((filters: FilterState) => {
        lastFiltersRef.current = filters;

        // If it's the first mount, we might have initial properties, but we should still
        // trigger a fetch if the status/location differs from defaults.
        // For simplicity, we just fetch on every significant filter change.
        fetchProperties(filters);
        setCurrentPage(1);
    }, [fetchProperties]);

    useEffect(() => {
        if (isFirstMount.current) {
            isFirstMount.current = false;
            return;
        }

        // Re-apply client-side sorting and search query filtering on the fetched results
        let filtered = [...properties];

        // Search Query
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.title.toLowerCase().includes(query) ||
                p.location.toLowerCase().includes(query) ||
                p.builder?.toLowerCase().includes(query)
            );
        }

        // Sorting
        if (sortBy === 'newest') {
            filtered = filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'price-low') {
            filtered = filtered.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
            filtered = filtered.sort((a, b) => b.price - a.price);
        }

        setFilteredProperties(filtered);
    }, [searchQuery, sortBy, properties]);

    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
    const currentProperties = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-brand-navy/10 pt-20">
            {/* Header / Search Section */}
            <section className="bg-brand-navy py-16 text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <FadeIn direction="down">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Properties</h1>
                        <p className="text-gray-400 mb-8 font-medium">Find your perfect home in Mumbai&apos;s most desirable locations.</p>

                        <div className="max-w-2xl mx-auto relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-brand-orange" size={20} />
                            <input
                                type="text"
                                placeholder="Search location, project, or developer..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full h-16 bg-white rounded-2xl pl-14 pr-6 text-brand-navy font-bold focus:ring-4 focus:ring-brand-orange/20 transition-all shadow-xl outline-none"
                            />
                        </div>
                    </FadeIn>
                </div>

                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            </section>

            <div className="container mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar Filters */}
                    <aside className={`lg:w-[320px] shrink-0 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-28">
                            <PropertyFilter
                                onFilterChange={handleFilterChange}
                                initialStatus={normalizedStatus}
                                initialLocation={locationParam}
                                initialBudgetLabel={initialBudgetLabel}
                            />

                            {/* Promo Card */}
                            <div className="mt-8 p-8 rounded-4xl bg-brand-orange text-white overflow-hidden relative group cursor-pointer">
                                <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                                <h4 className="text-xl font-bold mb-2 relative z-10">Selling Your Property?</h4>
                                <p className="text-white/80 text-sm mb-6 relative z-10">Get the best market value for your home with our expert valuation.</p>
                                <button className="bg-white text-brand-orange px-6 py-2.5 rounded-xl text-sm font-bold relative z-10">List Now</button>
                            </div>
                        </div>
                    </aside>

                    {/* Content Section */}
                    <main className="flex-1">
                        <div className="flex items-center justify-between mb-8">
                            <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-brand-navy dark:text-white">{filteredProperties.length}</span>
                                <span className="text-gray-500 font-medium">Properties for you</span>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="hidden md:block w-48">
                                    <Select
                                        value={sortBy}
                                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
                                        className="bg-white dark:bg-brand-navy border-gray-100 dark:border-white/5 py-2 text-xs"
                                    >
                                        <option value="newest">Newest First</option>
                                        <option value="price-low">Price: Low to High</option>
                                        <option value="price-high">Price: High to Low</option>
                                    </Select>
                                </div>
                                <button
                                    onClick={() => setShowMobileFilters(!showMobileFilters)}
                                    className="lg:hidden p-3 bg-brand-orange text-white rounded-xl shadow-lg shadow-brand-orange/20"
                                >
                                    <SlidersHorizontal size={20} />
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {[1, 2, 4].map(idx => <div key={idx} className="h-[450px] bg-gray-100 dark:bg-white/5 animate-pulse rounded-4xl" />)}
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {currentProperties.map((property, idx) => (
                                        <FadeIn key={property._id.toString()} delay={(idx % 2) * 0.1}>
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
                                                builder={property.builder}
                                                tags={property.tags}
                                            />
                                        </FadeIn>
                                    ))}
                                </div>

                                {filteredProperties.length === 0 && (
                                    <div className="text-center py-32 bg-white dark:bg-brand-navy rounded-4xl border border-dashed border-gray-200 dark:border-white/10 shadow-sm">
                                        <MapPin size={48} className="mx-auto text-brand-orange/40 mb-6" />
                                        <h3 className="text-2xl font-bold text-brand-navy dark:text-white mb-3">No matching properties found</h3>
                                        <p className="text-gray-500 mb-8 max-w-xs mx-auto">Try adjusting your filters or area selection to find your dream home.</p>
                                        <Button
                                            onClick={() => window.location.href = '/properties'}
                                            className="bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white font-bold px-8 py-3 rounded-xl transition-all"
                                        >
                                            Reset Filters
                                        </Button>
                                    </div>
                                )}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="mt-16 flex justify-center items-center gap-3">
                                        <button
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-brand-navy border border-gray-100 dark:border-white/10 disabled:opacity-30 hover:text-brand-orange transition-all"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>
                                        <div className="flex gap-2">
                                            {[...Array(totalPages)].map((_, i) => (
                                                <button
                                                    key={i}
                                                    onClick={() => handlePageChange(i + 1)}
                                                    className={`w-12 h-12 rounded-xl text-sm font-bold transition-all ${currentPage === i + 1
                                                        ? 'bg-brand-orange text-white shadow-xl shadow-brand-orange/20'
                                                        : 'bg-white dark:bg-brand-navy text-gray-500 border border-gray-100 dark:border-white/10 hover:border-brand-orange'
                                                        }`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPages}
                                            className="w-12 h-12 flex items-center justify-center rounded-xl bg-white dark:bg-brand-navy border border-gray-100 dark:border-white/10 disabled:opacity-30 hover:text-brand-orange transition-all"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
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
