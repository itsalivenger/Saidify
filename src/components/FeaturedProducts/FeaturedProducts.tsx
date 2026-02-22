"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Loader2 } from "lucide-react";
import ProductCard from "../Shop/ProductCard";

interface Product {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
}

export default function FeaturedProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const res = await fetch('/api/products?featured=true&limit=4');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to fetch featured products", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

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
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-900 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-neutral-50 dark:bg-neutral-900/50 rounded-3xl">
                        <ShoppingBag className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
                        <p className="text-muted-foreground font-medium">No featured products yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {products.map((product, index) => (
                            <ProductCard
                                key={product._id}
                                product={{
                                    id: product._id,
                                    title: product.title,
                                    price: `${product.price.toFixed(2)} MAD`,
                                    category: product.category,
                                    image: product.image,
                                    rating: 5 // Mock for now
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
