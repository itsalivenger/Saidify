"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Tag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface Category {
    _id: string;
    name: string;
    slug: string;
    image?: string;
}

const FALLBACK_GRADIENTS = [
    "from-blue-500/90 to-blue-700/90",
    "from-orange-500/90 to-orange-700/90",
    "from-purple-500/90 to-purple-700/90",
    "from-emerald-500/90 to-emerald-700/90",
];

const LAYOUT_CLASSES = [
    "lg:col-span-2 lg:row-span-2",
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-1 lg:row-span-1",
    "lg:col-span-2 lg:row-span-1",
];

export default function CategoriesGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch settings to get selected categories
                const settingsRes = await fetch("/api/settings");
                const categoriesRes = await fetch("/api/categories");

                if (settingsRes.ok && categoriesRes.ok) {
                    const settings = await settingsRes.json();
                    const allCategories = await categoriesRes.json();

                    const selectedIds = settings.homepage?.selectedCategories || [];

                    if (selectedIds.length > 0) {
                        // Map selected IDs to full category data, maintaining order
                        const selectedCategories = selectedIds
                            .map((id: string) => allCategories.find((c: Category) => c._id === id))
                            .filter(Boolean);
                        setCategories(selectedCategories);
                    } else {
                        // Fallback to first 4 active categories if none selected
                        setCategories(allCategories.filter((c: any) => c.active).slice(0, 4));
                    }
                }
            } catch (error) {
                console.error("Error fetching categories for grid:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-24">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    if (categories.length === 0) return null;

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

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 auto-rows-[300px] gap-6">
                    {categories.map((category, index) => (
                        <Link
                            key={category._id}
                            href={`/shop?category=${encodeURIComponent(category.name)}`}
                            className={cn(
                                "relative group overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300",
                                LAYOUT_CLASSES[index % LAYOUT_CLASSES.length]
                            )}
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                whileHover={{ y: -5, scale: 1.02 }}
                                className="h-full w-full"
                            >
                                {/* Background Image or Gradient */}
                                {category.image ? (
                                    <>
                                        <img
                                            src={category.image}
                                            alt={category.name}
                                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
                                    </>
                                ) : (
                                    <div
                                        className={cn(
                                            "absolute inset-0 bg-gradient-to-br transition-transform duration-700 ease-out group-hover:scale-110",
                                            FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]
                                        )}
                                    />
                                )}

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
                                        <h3 className="text-3xl font-bold text-white tracking-tight">
                                            {category.name}
                                        </h3>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
