'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, MapPin, Building2, IndianRupee, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { OptionGroup } from '@/components/ui/OptionGroup';

export type FilterState = {
    status: 'All' | 'Buy' | 'Rent';
    location: string[];
    propertyType: string;
    bhkType: string;
    budget: [number, number];
};

interface PropertyFilterProps {
    onFilterChange: (filters: FilterState) => void;
    initialStatus?: 'All' | 'Buy' | 'Rent';
    initialLocation?: string;
    initialBudgetLabel?: string;
}

const LOCATIONS = ['Andheri', 'Borivali', 'Kandivali', 'Malad', 'Mira Road', 'Virar', 'Bhayandar'];
const BHK_TYPES = ['1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK+'];
const CATEGORIES = ['Apartment', 'Villa', 'House', 'Plot', 'Commercial', 'Shop', 'Office'];

const BUY_BUDGETS = [
    { label: 'Under 50 Lac', min: 0, max: 50 },
    { label: '50 Lac - 1 Cr', min: 50, max: 100 },
    { label: '1 Cr - 2 Cr', min: 100, max: 200 },
    { label: '2 Cr - 5 Cr', min: 200, max: 500 },
    { label: '5 Cr+', min: 500, max: 5000 },
];

const RENT_BUDGETS = [
    { label: 'Under 15k', min: 0, max: 15 },
    { label: '15k - 25k', min: 15, max: 25 },
    { label: '25k - 50k', min: 25, max: 50 },
    { label: '50k - 1 Lakh', min: 50, max: 100 },
    { label: '1 Lakh+', min: 100, max: 1000 },
];


export function PropertyFilter({ onFilterChange, initialStatus, initialLocation, initialBudgetLabel }: PropertyFilterProps) {
    const [status, setStatus] = useState<'All' | 'Buy' | 'Rent'>(initialStatus || 'All');
    const normalizeLocation = (v?: string) => (v || '').trim().toLowerCase();
    const [location, setLocation] = useState(normalizeLocation(initialLocation));
    const [propertyType, setPropertyType] = useState("");
    const [bhkType, setBhkType] = useState("");
    const [budgetRange, setBudgetRange] = useState(initialBudgetLabel || "");

    // Sync state if props change
    useEffect(() => {
        if (initialStatus !== undefined && initialStatus !== status) setStatus(initialStatus);
    }, [initialStatus, status]);

    useEffect(() => {
        const normalized = normalizeLocation(initialLocation);
        if (initialLocation !== undefined && normalized !== location) setLocation(normalized);
    }, [initialLocation, location]);

    useEffect(() => {
        if (initialBudgetLabel !== undefined && initialBudgetLabel !== budgetRange) setBudgetRange(initialBudgetLabel);
    }, [initialBudgetLabel, budgetRange]);

    useEffect(() => {
        let min = 0;
        let max = 1000000000; // Large default

        const currentBudgets = status === 'Rent' ? RENT_BUDGETS : BUY_BUDGETS;
        const selectedBudget = currentBudgets.find(b => b.label === budgetRange);

        if (selectedBudget) {
            const multiplier = status === 'Rent' ? 1000 : 100000;
            min = selectedBudget.min * multiplier;
            max = selectedBudget.max * multiplier;
        }

        onFilterChange({
            status,
            location: location ? [normalizeLocation(location)] : [],
            propertyType,
            bhkType,
            budget: [min, max],
        });
    }, [status, location, propertyType, bhkType, budgetRange, onFilterChange]);

    const supportsBhk = propertyType === "" || propertyType === "Apartment" || propertyType === "Villa" || propertyType === "House";

    useEffect(() => {
        if (!supportsBhk && bhkType) setBhkType("");
    }, [supportsBhk, bhkType]);

    return (
        <div className="bg-white dark:bg-brand-navy p-6 rounded-[2rem] border border-gray-100 dark:border-white/5 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 bg-brand-orange/10 rounded-xl text-brand-orange">
                    <SlidersHorizontal size={20} />
                </div>
                <h2 className="text-xl font-bold text-brand-navy dark:text-white">Filters</h2>
            </div>

            {/* Status Tabs */}
            <div className="mb-8">
                <OptionGroup
                    label="Property Status"
                    options={['All', 'Buy', 'Rent'] as const}
                    value={status}
                    onChange={(val) => {
                        setStatus(val as 'All' | 'Buy' | 'Rent');
                        setBudgetRange("");
                    }}
                />
            </div>

            <div className="space-y-6">
                {/* Location Select */}
                <Select
                    label="Location"
                    icon={MapPin}
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                >
                    <option value="">All Locations</option>
                    {LOCATIONS.map(loc => <option key={loc} value={loc.toLowerCase()}>{loc}</option>)}
                </Select>

                {/* Property Category Select */}
                <Select
                    label="Property Type"
                    icon={Building2}
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                >
                    <option value="">Any Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </Select>

                {/* BHK Type Select */}
                {supportsBhk && (
                    <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                        <OptionGroup
                            label="Configurations (BHK)"
                            options={BHK_TYPES}
                            value={bhkType}
                            onChange={(val) => setBhkType(bhkType === val ? "" : val)}
                            className="grid grid-cols-1 gap-2"
                            itemClassName="py-2 text-[10px]"
                        />
                    </div>
                )}

                {/* Budget Range Select */}
                <Select
                    label="Budget Range"
                    icon={IndianRupee}
                    value={budgetRange}
                    onChange={(e) => setBudgetRange(e.target.value)}
                >
                    <option value="">All Budgets</option>
                    {(status === 'Rent' ? RENT_BUDGETS : BUY_BUDGETS).map(b => (
                        <option key={b.label} value={b.label}>{b.label}</option>
                    ))}
                </Select>
            </div>

            <div className="mt-10 pt-8 border-t border-gray-100 dark:border-white/5">
                <Button
                    variant="ghost"
                    className="w-full text-xs font-bold text-gray-500 hover:text-white"
                    onClick={() => {
                        setStatus('All');
                        setLocation("");
                        setPropertyType("");
                        setBhkType("");
                        setBudgetRange("");
                    }}
                >
                    Reset All Filters
                </Button>
            </div>
        </div>
    );
}
