import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, label, error, containerClassName, ...props }, ref) => {
        return (
            <div className={cn("w-full space-y-1.5", containerClassName)}>
                {label && (
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {label}
                    </label>
                )}
                <div className="relative group">
                    <select
                        ref={ref}
                        className={cn(
                            "w-full appearance-none rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-neutral-900 px-4 py-2.5 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-accent/50 group-hover:border-accent/50 text-gray-700 dark:text-gray-300 cursor-pointer",
                            error && "border-red-500 focus:ring-red-500/50",
                            className
                        )}
                        {...props}
                    >
                        {children}
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-accent transition-colors">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
