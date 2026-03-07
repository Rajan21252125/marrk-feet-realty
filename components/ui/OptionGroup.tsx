import * as React from "react";
import { cn } from "@/lib/utils";

interface OptionGroupProps<T extends string | number> {
    options: readonly T[] | T[];
    value: T;
    onChange: (value: T) => void;
    label?: string;
    className?: string;
    itemClassName?: string;
    activeClassName?: string;
}

export function OptionGroup<T extends string | number>({
    options,
    value,
    onChange,
    label,
    className,
    itemClassName,
    activeClassName,
}: OptionGroupProps<T>) {
    return (
        <div className={cn("w-full space-y-3", className)}>
            {label && (
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest block ml-1">
                    {label}
                </label>
            )}
            <div className="flex p-1.5 bg-white dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5 gap-1.5 shadow-sm">
                {options.map((option) => (
                    <button
                        key={option}
                        type="button"
                        onClick={() => onChange(option)}
                        className={cn(
                            "flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all duration-300 relative overflow-hidden",
                            value === option
                                ? cn("bg-brand-orange text-white shadow-lg shadow-brand-orange/20 scale-[1.02]", activeClassName)
                                : cn("hover:bg-white/50 dark:hover:bg-white/10 text-gray-500 hover:text-brand-navy dark:hover:text-white", itemClassName)
                        )}
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
