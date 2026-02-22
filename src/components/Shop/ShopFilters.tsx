"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTER_SECTIONS = [
    {
        id: "category",
        title: "Category",
        options: ["All Products", "Men", "Women", "Unisex", "Accessories", "Shoes"]
    },
    {
        id: "size",
        title: "Size",
        options: ["XS", "S", "M", "L", "XL", "2XL"]
    },
    {
        id: "color",
        title: "Color",
        options: ["Black", "White", "Blue", "Beige", "Green", "Red"]
    }
];

interface ShopFiltersProps {
    activeCategory: string;
    onCategoryChange: (category: string) => void;
    dbCategories?: string[];
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    activeSize: string;
    onSizeChange: (size: string) => void;
    activeColor: string;
    onColorChange: (color: string) => void;
}

export default function ShopFilters({
    activeCategory,
    onCategoryChange,
    dbCategories = [],
    priceRange,
    onPriceChange,
    activeSize,
    onSizeChange,
    activeColor,
    onColorChange
}: ShopFiltersProps) {
    const [openSections, setOpenSections] = useState<string[]>(["category", "price", "size", "color"]);
    const [localPrice, setLocalPrice] = useState(priceRange[1]);
    const [minPriceInput, setMinPriceInput] = useState(priceRange[0].toString());
    const [maxPriceInput, setMaxPriceInput] = useState(priceRange[1].toString());

    const filterSections = [
        {
            id: "category",
            title: "Category",
            options: ["All Products", ...dbCategories]
        },
        {
            id: "size",
            title: "Size",
            options: ["All", "XS", "S", "M", "L", "XL", "2XL"]
        },
        {
            id: "color",
            title: "Color",
            options: ["All", "Black", "White", "Blue", "Beige", "Green", "Red"]
        }
    ];

    const handleCategoryClick = (category: string) => {
        const cleanCategory = category === "All Products" ? "All" : category;
        onCategoryChange(cleanCategory);
    };

    const toggleSection = (id: string) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handlePriceInputChange = (type: 'min' | 'max', val: string) => {
        if (type === 'min') {
            setMinPriceInput(val);
        } else {
            setMaxPriceInput(val);
            setLocalPrice(Number(val) || 0);
        }
    };

    const handlePriceBlur = () => {
        const min = Number(minPriceInput) || 0;
        const max = Number(maxPriceInput) || 5000;
        onPriceChange([min, max]);
    };

    return (
        <div className="w-full lg:w-64 shrink-0 space-y-8">
            <div className="flex items-center gap-2 mb-6 lg:hidden">
                <SlidersHorizontal className="w-5 h-5" />
                <span className="font-bold">Filters</span>
            </div>

            {/* Price Filter */}
            <div className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
                <button
                    onClick={() => toggleSection("price")}
                    className="flex w-full items-center justify-between mb-4 group"
                >
                    <span className="font-bold text-sm uppercase tracking-wide">Price Range</span>
                    <ChevronDown className={cn(
                        "w-4 h-4 transition-transform duration-300",
                        openSections.includes("price") ? "rotate-180" : ""
                    )} />
                </button>
                <AnimatePresence>
                    {openSections.includes("price") && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-2 space-y-4">
                                <input
                                    type="range"
                                    min="0"
                                    max="5000"
                                    value={localPrice}
                                    onChange={(e) => {
                                        setLocalPrice(Number(e.target.value));
                                        setMaxPriceInput(e.target.value);
                                    }}
                                    onMouseUp={() => onPriceChange([Number(minPriceInput), localPrice])}
                                    onTouchEnd={() => onPriceChange([Number(minPriceInput), localPrice])}
                                    className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700 accent-primary"
                                />
                                <div className="flex items-center gap-2">
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase text-muted-foreground font-bold mb-1 block">Min</label>
                                        <input
                                            type="number"
                                            value={minPriceInput}
                                            onChange={(e) => handlePriceInputChange('min', e.target.value)}
                                            onBlur={handlePriceBlur}
                                            className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-primary/30"
                                        />
                                    </div>
                                    <div className="mt-4 text-muted-foreground text-sm">-</div>
                                    <div className="flex-1">
                                        <label className="text-[10px] uppercase text-muted-foreground font-bold mb-1 block">Max</label>
                                        <input
                                            type="number"
                                            value={maxPriceInput}
                                            onChange={(e) => handlePriceInputChange('max', e.target.value)}
                                            onBlur={handlePriceBlur}
                                            className="w-full bg-neutral-100 dark:bg-neutral-800 border-none rounded-lg py-1.5 px-3 text-xs focus:ring-1 focus:ring-primary/30"
                                        />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Other Filters */}
            {filterSections.map((section) => (
                <div key={section.id} className="border-b border-neutral-200 dark:border-neutral-800 pb-6">
                    <button
                        onClick={() => toggleSection(section.id)}
                        className="flex w-full items-center justify-between mb-4 group"
                    >
                        <span className="font-bold text-sm uppercase tracking-wide">{section.title}</span>
                        <ChevronDown className={cn(
                            "w-4 h-4 transition-transform duration-300",
                            openSections.includes(section.id) ? "rotate-180" : ""
                        )} />
                    </button>
                    <AnimatePresence>
                        {openSections.includes(section.id) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="space-y-2 pt-2">
                                    {section.options.map((option) => (
                                        <label key={option} className="flex items-center gap-3 cursor-pointer group/label py-0.5">
                                            <div className="relative flex items-center">
                                                <input
                                                    type="radio"
                                                    name={section.id}
                                                    checked={
                                                        section.id === "category"
                                                            ? (activeCategory === "All" && option === "All Products") || activeCategory === option
                                                            : section.id === "size"
                                                                ? activeSize === option
                                                                : section.id === "color"
                                                                    ? activeColor === option
                                                                    : false
                                                    }
                                                    onChange={() => {
                                                        if (section.id === "category") handleCategoryClick(option);
                                                        if (section.id === "size") onSizeChange(option);
                                                        if (section.id === "color") onColorChange(option);
                                                    }}
                                                    className="peer w-4 h-4 border-2 border-neutral-300 rounded-full text-primary focus:ring-primary/20 dark:border-neutral-600 dark:bg-neutral-800"
                                                />
                                            </div>
                                            <span className={cn(
                                                "text-sm transition-colors",
                                                (
                                                    (activeCategory === (option === "All Products" ? "All" : option) && section.id === "category") ||
                                                    (activeSize === option && section.id === "size") ||
                                                    (activeColor === option && section.id === "color")
                                                )
                                                    ? "text-primary font-bold"
                                                    : "text-neutral-600 dark:text-neutral-400 group-hover/label:text-foreground"
                                            )}>
                                                {option}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ))}
        </div>
    );
}
