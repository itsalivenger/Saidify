"use client";

import { Search, LayoutGrid, List } from "lucide-react";
import { cn } from "@/lib/utils";

interface ShopToolbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    currentSort: string;
    onSortChange: (value: string) => void;
    totalProducts: number;
    currentViewMode: 'grid' | 'list';
    onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function ShopToolbar({
    searchQuery,
    onSearchChange,
    currentSort,
    onSortChange,
    totalProducts,
    currentViewMode,
    onViewModeChange
}: ShopToolbarProps) {
    return (
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-neutral-900 p-4 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm mb-6">
            {/* Search */}
            <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border-none focus:ring-2 focus:ring-primary/20 focus:outline-none placeholder:text-muted-foreground text-sm"
                />
            </div>

            <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                {/* Sort */}
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:inline">Sort by:</span>
                    <select
                        value={currentSort}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 text-sm font-medium focus:outline-none cursor-pointer border border-neutral-200 dark:border-neutral-700 rounded-lg px-2 py-1"
                    >
                        <option value="Newest Arrivals" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">Newest Arrivals</option>
                        <option value="Price: Low to High" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">Price: Low to High</option>
                        <option value="Price: High to Low" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">Price: High to Low</option>
                        <option value="Best Selling" className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100">Best Selling</option>
                    </select>
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg p-1">
                    <button
                        onClick={() => onViewModeChange('grid')}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            currentViewMode === 'grid'
                                ? "bg-white dark:bg-neutral-700 shadow-sm text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <LayoutGrid className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => onViewModeChange('list')}
                        className={cn(
                            "p-1.5 rounded-md transition-all",
                            currentViewMode === 'list'
                                ? "bg-white dark:bg-neutral-700 shadow-sm text-primary"
                                : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <List className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
