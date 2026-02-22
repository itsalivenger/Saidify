"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface AuthInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-2">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {label}
                </label>
                <input
                    className={cn(
                        "flex h-12 w-full rounded-lg border border-neutral-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-neutral-800",
                        error && "border-red-500 focus-visible:ring-red-500",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && <p className="text-sm font-medium text-red-500">{error}</p>}
            </div>
        );
    }
);
AuthInput.displayName = "AuthInput";

export default AuthInput;
