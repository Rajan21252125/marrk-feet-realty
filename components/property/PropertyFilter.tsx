'use client';

import { useState, useEffect } from 'react';
import { SlidersHorizontal, MapPin, Home, IndianRupee } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

export type FilterState = {
    status: 'All' | 'Buy' | 'Rent';
    location: string[];
    type: string[];
    budget: [number, number];
};

interface PropertyFilterProps {
    onFilterChange: (filters: FilterState) => void;
}

const LOCATIONS = ['Andheri', 'Borivali', 'Kandivali', 'Malad', 'Mira Road', 'Virar'];
const TYPES = ['1BHK', '2BHK', '3BHK', 'Studio', 'Commercial'];

export function PropertyFilter({ onFilterChange }: PropertyFilterProps) {
    const [status, setStatus] = useState<'All' | 'Buy' | 'Rent'>('All');
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
    const [budget, setBudget] = useState<[number, number]>([10, 200]); // Default for Sale: 10 Lac to 2 Cr

    useEffect(() => {
        // Reset budget range when status changes
        if (status === 'Rent') {
            setBudget([10000, 500000]); // 10k to 5 Lakh
        } else {
            setBudget([10, 200]); // 10 Lac to 2 Cr
        }
    }, [status]);

    useEffect(() => {
        onFilterChange({
            status,
            location: selectedLocations,
            type: selectedTypes,
            budget,
        });
    }, [status, selectedLocations, selectedTypes, budget, onFilterChange]);

    const toggleLocation = (loc: string) => {
        setSelectedLocations(prev =>
            prev.includes(loc) ? prev.filter(l => l !== loc) : [...prev, loc]
        );
    };

    const toggleType = (type: string) => {
        setSelectedTypes(prev =>
            prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
        );
    };

    const formatBudget = (val: number) => {
        if (status === 'Rent') {
            return val >= 100000 ? `${(val / 100000).toFixed(1)} Lakh` : `${(val / 1000).toFixed(0)}k`;
        }
        return val >= 100 ? `${(val / 100).toFixed(1)} Cr` : `${val} Lac`;
    };

    return (
        <div className="bg-neutral-900 text-white p-6 md:p-8 rounded-3xl shadow-2xl border border-white/5 w-full">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-accent/20 rounded-lg text-accent">
                    <SlidersHorizontal size={20} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">Filters</h2>
            </div>

            {/* Status Selector */}
            <div className="mb-8">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest block mb-4">Status</label>
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/5 gap-1">
                    {(['All', 'Buy', 'Rent'] as const).map((s) => (
                        <button
                            key={s}
                            onClick={() => setStatus(s)}
                            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${status === s ? 'bg-accent text-white shadow-lg' : 'hover:bg-white/5 text-gray-400'}`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            {/* Location Selector */}
            <div className="mb-8">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest block mb-4">Location</label>
                <div className="flex flex-wrap gap-3">
                    {LOCATIONS.map((loc) => (
                        <button
                            key={loc}
                            onClick={() => toggleLocation(loc)}
                            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-300 border ${selectedLocations.includes(loc) ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-transparent text-gray-400 hover:border-white/10'}`}
                        >
                            {loc}
                        </button>
                    ))}
                </div>
            </div>

            {/* Property Type Selector */}
            <div className="mb-8">
                <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest block mb-4">Property Type</label>
                <div className="flex flex-wrap gap-3">
                    {TYPES.map((type) => (
                        <button
                            key={type}
                            onClick={() => toggleType(type)}
                            className={`py-2 px-4 rounded-xl text-xs font-bold transition-all duration-300 border ${selectedTypes.includes(type) ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 border-transparent text-gray-400 hover:border-white/10'}`}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Budget Range Selector */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-6">
                    <label className="text-sm font-semibold text-gray-400 uppercase tracking-widest">Budget</label>
                    <span className="text-accent font-bold text-sm">
                        {formatBudget(budget[0])} - {formatBudget(budget[1])}
                    </span>
                </div>

                {/* Custom Range Slider using native inputs for simplicity/accessibility, but styled */}
                <div className="space-y-6">
                    <div className="relative h-2 w-full bg-white/10 rounded-full">
                        <div
                            className="absolute h-full bg-accent rounded-full transition-all duration-300"
                            style={{
                                left: `${((budget[0] - (status === 'Rent' ? 10000 : 10)) / (status === 'Rent' ? 490000 : 190)) * 100}%`,
                                right: `${100 - ((budget[1] - (status === 'Rent' ? 10000 : 10)) / (status === 'Rent' ? 490000 : 190)) * 100}%`
                            }}
                        />
                        <input
                            type="range"
                            min={status === 'Rent' ? 10000 : 10}
                            max={status === 'Rent' ? 500000 : 200}
                            step={status === 'Rent' ? 5000 : 5}
                            value={budget[0]}
                            onChange={(e) => setBudget([parseInt(e.target.value), Math.max(parseInt(e.target.value), budget[1])])}
                            className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
                            style={{ zIndex: 10 }}
                        />
                        <input
                            type="range"
                            min={status === 'Rent' ? 10000 : 10}
                            max={status === 'Rent' ? 500000 : 200}
                            step={status === 'Rent' ? 5000 : 5}
                            value={budget[1]}
                            onChange={(e) => setBudget([Math.min(parseInt(e.target.value), budget[0]), parseInt(e.target.value)])}
                            className="absolute w-full h-full appearance-none bg-transparent pointer-events-auto cursor-pointer"
                            style={{ zIndex: 11 }}
                        />
                    </div>
                </div>
            </div>

            <div className="flex gap-4 mt-8 pt-8 border-t border-white/5">
                <Button
                    variant="outline"
                    className="w-full bg-transparent border-white/10 text-white hover:bg-white/5"
                    onClick={() => {
                        setStatus('All');
                        setSelectedLocations([]);
                        setSelectedTypes([]);
                        setBudget(status === 'Rent' ? [10000, 500000] : [10, 200]);
                    }}
                >
                    Reset All Filters
                </Button>
            </div>
        </div>
    );
}
