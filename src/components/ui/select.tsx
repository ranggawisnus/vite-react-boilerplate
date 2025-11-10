import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utilities";

export interface SelectProps
	extends React.SelectHTMLAttributes<HTMLSelectElement> {
	className?: string;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
	({ className, children, ...props }, ref) => {
		return (
			<div className="relative">
				<select
					ref={ref}
					className={cn(
						"flex h-9 w-full rounded-lg border border-white/30 bg-white/50 backdrop-blur-md px-3 py-1 pr-9 text-sm text-foreground shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 focus-visible:border-white/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none cursor-pointer",
						className
					)}
					{...props}
				>
					{children}
				</select>
				<ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
			</div>
		);
	}
);
Select.displayName = "Select";

export { Select };
