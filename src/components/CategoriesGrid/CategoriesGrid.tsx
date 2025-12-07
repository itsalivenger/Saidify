"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Category Data
const CATEGORIES = [
    {
        id: 1,
        name: "Summer Collection",
        count: "120 Items",
        // Desktop: Spans 2 cols, 2 rows (Big box on left)
        className: "lg:col-span-2 lg:row-span-2",
        gradient: "from-blue-500/90 to-blue-700/90",
    },
    {
        id: 2,
        name: "Men's Casual",
        count: "86 Items",
        // Desktop: 1x1
        className: "lg:col-span-1 lg:row-span-1",
        gradient: "from-orange-500/90 to-orange-700/90",
    },
    {
        id: 3,
        name: "Women's Formal",
        count: "210 Items",
        // Desktop: 1x1
        className: "lg:col-span-1 lg:row-span-1",
        gradient: "from-purple-500/90 to-purple-700/90",
    },
    {
        id: 4,
        name: "Accessories",
        count: "45 Items",
        // Desktop: Spans 2 cols, 1 row (Wide box on bottom right)
        className: "lg:col-span-2 lg:row-span-1",
        gradient: "from-emerald-500/90 to-emerald-700/90",
    },
];

export default function CategoriesGrid() {
    return (
        <section className="py-24 bg-neutral-50 dark:bg-neutral-900/30">
            <div className="w-full px-4 md:px-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                            Shop by Category
                        </h2>
                        <p className="mt-2 text-lg text-muted-foreground">
                            Explore our curated selections for every style.
                        </p>
                    </motion.div>

                    <div className="hidden md:block h-px flex-1 bg-neutral-200 dark:bg-neutral-800 mx-8 -translate-y-3" />
                </div>

                {/* 
          Grid Layout:
          - Mobile: 1 column
          - Tablet: 2 columns
          - Desktop: 4 columns
          - Auto Rows: 300px base height. 
            item 1 (row-span-2) becomes ~624px tall.
            item 2,3 (row-span-1) become 300px tall.
        */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6">
                    {CATEGORIES.map((category, index) => (
                        <motion.div
                            key={category.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className={cn(
                                "relative group overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300",
                                category.className
                            )}
                        >
                            {/* Background Gradient */}
                            <div
                                className={cn(
                                    "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-110",
                                    category.gradient
                                )}
                            />

                            {/* Dark Overlay for readability */}
                            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300" />

                            {/* Content Container */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                                {/* Top Right Icon */}
                                <div className="flex justify-end">
                                    <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white opacity-0 -translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 ease-out">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                </div>

                                {/* Bottom Text info */}
                                <div className="transform transition-transform duration-300 group-hover:-translate-y-1">
                                    <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold tracking-wider text-white uppercase bg-black/20 backdrop-blur-md rounded-full">
                                        {category.count}
                                    </span>
                                    <h3 className="text-3xl font-bold text-white tracking-tight">
                                        {category.name}
                                    </h3>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
