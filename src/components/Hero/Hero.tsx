"use client";

import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Hero() {
    return (
        <section className="relative w-full overflow-hidden bg-neutral-50 dark:bg-neutral-900">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:grid-cols-2 min-h-[calc(100vh-4rem)] items-center py-12 lg:py-0">

                    {/* Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="flex flex-col justify-center space-y-4"
                    >
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800 dark:bg-blue-900 dark:text-blue-100"
                            >
                                New Collection 2024
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-7xl/none text-neutral-900 dark:text-white"
                            >
                                Elevate Your Style with <span className="text-blue-600 dark:text-blue-400">Premium</span> Essentials
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4, duration: 0.5 }}
                                className="max-w-[600px] text-neutral-500 md:text-xl dark:text-neutral-400"
                            >
                                Discover the latest trends in fashion. High-quality materials, sustainable production, and timeless designs crafted just for you.
                            </motion.p>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.5 }}
                            className="flex flex-col gap-2 min-[400px]:flex-row"
                        >
                            <button
                                className={cn(
                                    "inline-flex h-12 items-center justify-center rounded-lg bg-blue-600 px-8 text-sm font-medium text-white shadow transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-700 disabled:pointer-events-none disabled:opacity-50",
                                    "group relative overflow-hidden"
                                )}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Shop Now <ShoppingBag className="h-4 w-4" />
                                </span>
                            </button>
                            <button
                                className={cn(
                                    "inline-flex h-12 items-center justify-center rounded-lg border border-neutral-200 bg-white px-8 text-sm font-medium text-neutral-900 shadow-sm transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 dark:border-neutral-800 dark:bg-neutral-950 dark:hover:bg-neutral-800 dark:hover:text-neutral-50 dark:focus-visible:ring-neutral-300"
                                )}
                            >
                                <span className="flex items-center gap-2">
                                    Explore Collection <ArrowRight className="h-4 w-4" />
                                </span>
                            </button>
                        </motion.div>
                    </motion.div>

                    {/* Image/Visual Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                        className="flex items-center justify-center lg:justify-end"
                    >
                        <div className="relative aspect-square w-full max-w-[550px] lg:aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-2xl">
                            {/* Placeholder for Hero Image - prompting user later to generate one or I will use a placeholder tool if available, or just a colored box for now with text */}
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-neutral-800 dark:to-neutral-900">
                                <span className="text-neutral-300 text-6xl font-bold opacity-20 transform -rotate-12 select-none">
                                    HERO IMAGE
                                </span>
                            </div>

                            {/* Decorative elements */}
                            <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                                className="absolute top-10 right-10 h-24 w-24 rounded-full bg-blue-400/20 blur-2xl"
                            />
                            <motion.div
                                animate={{ y: [0, 15, 0] }}
                                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                                className="absolute bottom-10 left-10 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl"
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
