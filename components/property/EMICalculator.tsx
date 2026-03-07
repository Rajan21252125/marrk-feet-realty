'use client';

import { useState, useEffect } from 'react';
import { IndianRupee, Calculator, Info } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface EMICalculatorProps {
    propertyPrice: number;
}

export default function EMICalculator({ propertyPrice }: EMICalculatorProps) {
    const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8); // 80% default
    const [interestRate, setInterestRate] = useState(8.5);
    const [tenure, setTenure] = useState(20);
    const [monthlyEMI, setMonthlyEMI] = useState(0);

    const calculateEMI = () => {
        const principal = loanAmount;
        const ratePerMonth = (interestRate / 100) / 12;
        const months = tenure * 12;

        if (ratePerMonth === 0) {
            setMonthlyEMI(principal / months);
            return;
        }

        const emi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) / (Math.pow(1 + ratePerMonth, months) - 1);
        setMonthlyEMI(emi);
    };

    useEffect(() => {
        calculateEMI();
    }, [loanAmount, interestRate, tenure]);

    useEffect(() => {
        setLoanAmount(propertyPrice * 0.8);
    }, [propertyPrice]);

    return (
        <div className="p-8 rounded-[2rem] bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 shadow-sm mb-12">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-brand-orange/10 rounded-2xl text-brand-orange">
                    <Calculator size={24} />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-brand-navy dark:text-white">EMI Calculator</h2>
                    <p className="text-sm text-gray-500 font-medium">Estimate your monthly mortgage payments</p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {/* Loan Amount */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Loan Amount</label>
                            <span className="text-lg font-bold text-brand-navy dark:text-white">{formatPrice(loanAmount)}</span>
                        </div>
                        <input
                            type="range"
                            min={propertyPrice * 0.1}
                            max={propertyPrice}
                            step={100000}
                            value={loanAmount}
                            onChange={(e) => setLoanAmount(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                        />
                        <div className="flex justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                            <span>10%</span>
                            <span>Downpayment: {formatPrice(propertyPrice - loanAmount)}</span>
                            <span>100%</span>
                        </div>
                    </div>

                    {/* Interest Rate */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Interest Rate (p.a)</label>
                            <span className="text-lg font-bold text-brand-navy dark:text-white">{interestRate}%</span>
                        </div>
                        <input
                            type="range"
                            min="5"
                            max="15"
                            step="0.1"
                            value={interestRate}
                            onChange={(e) => setInterestRate(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                        />
                    </div>

                    {/* Tenure */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-400">Loan Tenure</label>
                            <span className="text-lg font-bold text-brand-navy dark:text-white">{tenure} Years</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="30"
                            step="1"
                            value={tenure}
                            onChange={(e) => setTenure(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                        />
                    </div>
                </div>

                <div className="flex flex-col justify-center items-center md:items-start p-8 rounded-3xl bg-brand-navy text-white relative overflow-hidden group">
                    {/* Decorative Circle */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-orange/10 rounded-full blur-[60px] translate-x-10 -translate-y-10 group-hover:scale-110 transition-transform duration-700" />

                    <p className="text-gray-400 text-xs font-bold uppercase tracking-[0.3em] mb-4">Estimated EMI</p>
                    <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-5xl font-black text-white leading-tight">
                            {formatPrice(monthlyEMI)}
                        </span>
                        <span className="text-brand-orange font-bold">/mo</span>
                    </div>
                    <div className="h-1 w-20 bg-brand-orange rounded-full mb-8" />

                    <div className="space-y-4 w-full">
                        <div className="flex justify-between text-sm py-3 border-b border-white/5">
                            <span className="text-gray-400">Total Interest</span>
                            <span className="font-bold">{formatPrice((monthlyEMI * tenure * 12) - loanAmount)}</span>
                        </div>
                        <div className="flex justify-between text-sm py-3 border-b border-white/5">
                            <span className="text-gray-400">Total Payable</span>
                            <span className="font-bold text-brand-orange">{formatPrice(monthlyEMI * tenure * 12)}</span>
                        </div>
                    </div>

                    <div className="mt-8 flex items-start gap-2 p-3 bg-white/5 rounded-xl border border-white/5">
                        <Info size={16} className="text-brand-orange shrink-0 mt-0.5" />
                        <p className="text-[10px] text-gray-400 font-medium">Calculation is based on reducing balance method. Actual rates may vary by bank and profile.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
