import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, LucideIcon } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    icon?: LucideIcon;
    containerClassName?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, children, label, error, icon: Icon, containerClassName, ...props }, ref) => {
        const generatedId = React.useId();
        const selectId = props.id ?? generatedId;
        return (
            <div className={cn("w-full space-y-2 group", containerClassName)}>
                {label && (
                    <label
                        htmlFor={selectId}
                        className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest block ml-1 transition-colors group-focus-within:text-brand-orange"
                    >
                        {label}
                    </label>
                )}
                <div className="relative">
                    {Icon && (
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Icon className="text-brand-orange transition-colors group-focus-within:text-brand-orange" size={18} />
                        </div>
                    )}
                    <select
                        ref={ref}
                        id={selectId}
                        aria-invalid={!!error}
                        aria-describedby={error ? `${selectId}-error` : undefined}
                        className={cn(
                            "w-full appearance-none rounded-2xl border border-gray-100 dark:border-white/5 bg-gray-50 dark:bg-brand-navy px-4 py-4 text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-brand-orange/10 focus:border-brand-orange/40 text-brand-navy dark:text-white cursor-pointer",
                            "form-select", // Adding a class for easier global styling if needed
                            Icon && "pl-12",
                            error && "border-red-500 focus:ring-red-500/10",
                            className
                        )}
                        style={{ colorScheme: 'light dark' }} // Tells the browser the element supports both themes
                        {...props}
                    >
                        {children}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-brand-orange transition-colors">
                        <ChevronDown className="h-4 w-4" />
                    </div>
                </div>
                {error && <p id={`${selectId}-error`} className="text-xs text-red-500 font-medium ml-1">{error}</p>}
            </div>
        );
    }
);

Select.displayName = "Select";

export { Select };
