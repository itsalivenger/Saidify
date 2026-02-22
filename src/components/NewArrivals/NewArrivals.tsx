"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import { useState, useEffect } from 'react';
import ProductCard from '../Shop/ProductCard';

interface Product {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
}

export default function NewArrivals() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const res = await fetch('/api/products?isNewArrival=true&limit=4');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to fetch new arrivals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNewArrivals();
    }, []);

    return (
        <section className="py-24 bg-background">
            <div className="w-full px-4 md:px-8 max-w-[1800px] mx-auto">
                <div className="flex flex-col items-center text-center mb-16">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-sm font-bold uppercase tracking-widest text-primary mb-3"
                    >
                        Fresh Drops
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl"
                    >
                        New Arrivals
                    </motion.h2>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="aspect-[3/4] bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-muted-foreground">No new arrivals available yet.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.6 }}
                            >
                                <ProductCard
                                    product={{
                                        id: product._id,
                                        title: product.title,
                                        price: new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(product.price),
                                        image: product.image,
                                        category: product.category,
                                        rating: 5
                                    }}
                                />
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
