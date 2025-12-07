"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const FILTER_SECTIONS = [
    {
        id: "category",
        title: "Category",
        options: ["All Products", "Men", "Women", "Kids", "Accessories", "Shoes"]
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
    },
    {
        id: "brand",
        title: "Brand",
        options: ["Nike", "Adidas", "Puma", "Zara", "H&M", "Gucci"]
    }
];

export default function ShopFilters() {
    const [openSections, setOpenSections] = useState<string[]>(["category", "price", "size"]);

    const toggleSection = (id: string) => {
        setOpenSections(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
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
                            <div className="pt-2">
                                <input type="range" className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer dark:bg-neutral-700" />
                                <div className="flex justify-between text-sm text-muted-foreground mt-2">
                                    <span>$0</span>
                                    <span>$1000</span>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Other Filters */}
            {FILTER_SECTIONS.map((section) => (
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
                                <div className="space-y-3 pt-2">
                                    {section.options.map((option) => (
                                        <label key={option} className="flex items-center gap-3 cursor-pointer group/label">
                                            <div className="relative flex items-center">
                                                <input type="checkbox" className="peer w-4 h-4 border-2 border-neutral-300 rounded text-primary focus:ring-primary/20 dark:border-neutral-600 dark:bg-neutral-800" />
                                            </div>
                                            <span className="text-sm text-neutral-600 dark:text-neutral-400 group-hover/label:text-foreground transition-colors">
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
