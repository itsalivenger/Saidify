"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ArrowRight } from "lucide-react";
import Image from "next/image"; // Used if we had real images, for now div placeholders
import { cn } from "@/lib/utils";

// Dummy Data
const PRODUCTS = [
    {
        id: 1,
        name: "Classic Minimalism Tee",
        price: "$35.00",
        category: "T-Shirts",
        imageColor: "bg-neutral-200 dark:bg-neutral-800",
    },
    {
        id: 2,
        name: "Urban Cargo Pants",
        price: "$89.00",
        category: "Bottoms",
        imageColor: "bg-neutral-300 dark:bg-neutral-700",
    },
    {
        id: 3,
        name: "Premium Knit Sweater",
        price: "$120.00",
        category: "Knitwear",
        imageColor: "bg-neutral-200 dark:bg-neutral-800",
    },
    {
        id: 4,
        name: "Legacy Leather Jacket",
        price: "$250.00",
        category: "Outerwear",
        imageColor: "bg-neutral-300 dark:bg-neutral-700",
    },
];

export default function FeaturedProducts() {
    return (
        <section className="py-20 bg-background">
            <div className="container mx-auto px-4 md:px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Featured Collection</h2>
                        <p className="mt-2 text-muted-foreground">Handpicked essentials for your wardrobe.</p>
                    </motion.div>

                    <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="group flex items-center text-primary font-medium hover:text-primary/80 transition-colors"
                    >
                        View All Products <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </motion.button>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {PRODUCTS.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="group relative"
                        >
                            {/* Image Container */}
                            <div className={cn(
                                "aspect-[3/4] w-full overflow-hidden rounded-xl relative",
                                product.imageColor
                            )}>
                                {/* Overlay / Hover Actions */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

                                {/* Quick Add Button */}
                                <button className="absolute bottom-4 right-4 p-3 rounded-full bg-white text-black shadow-lg translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white">
                                    <ShoppingBag className="w-5 h-5" />
                                </button>

                                {/* Badge (Optional) */}
                                {index === 0 && (
                                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur text-xs font-bold px-2 py-1 rounded text-black shadow-sm">
                                        BEST SELLER
                                    </span>
                                )}
                            </div>

                            {/* Info */}
                            <div className="mt-4 space-y-1">
                                <p className="text-xs text-muted-foreground">{product.category}</p>
                                <h3 className="text-lg font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                                    {product.name}
                                </h3>
                                <p className="font-semibold text-foreground">{product.price}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
