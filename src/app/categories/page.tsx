"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Layers, Loader2 } from "lucide-react";
import Breadcrumbs from "@/components/Shop/Breadcrumbs";

interface Category {
    _id: string;
    name: string;
    active: boolean;
}

export default function CategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.filter((cat: any) => cat.active));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return (
        <main className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-[1200px]">
                <Breadcrumbs />
                <div className="mb-12">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">Our Collections</h1>
                    <p className="text-muted-foreground text-lg max-w-2xl">
                        Explore our curated selection of luxury items across various categories.
                        Find the perfect match for your style.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {categories.map((cat, index) => (
                            <motion.div
                                key={cat._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={`/shop?category=${encodeURIComponent(cat.name)}`}
                                    className="group block relative overflow-hidden rounded-3xl bg-neutral-100 dark:bg-neutral-900 aspect-[4/3] border border-neutral-200 dark:border-neutral-800"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 opacity-60 group-hover:opacity-80 transition-opacity" />

                                    {/* Placeholder representation */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Layers className="w-20 h-20 text-neutral-300 dark:text-neutral-700 opacity-20 group-hover:scale-110 transition-transform duration-500" />
                                    </div>

                                    <div className="absolute inset-x-0 bottom-0 p-8 z-20">
                                        <h2 className="text-3xl font-black text-white mb-2 group-hover:translate-x-2 transition-transform duration-300">
                                            {cat.name}
                                        </h2>
                                        <div className="flex items-center gap-2 text-white/60 font-bold text-sm tracking-wider uppercase opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                            Explore Gallery <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
