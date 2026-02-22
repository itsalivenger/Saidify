"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import ProductCard from '../Shop/ProductCard';

interface Product {
    _id: string;
    title: string;
    price: number;
    image: string;
    category: string;
}

export default function BestSellers() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBestSellers = async () => {
            try {
                const res = await fetch('/api/products?isBestSeller=true&limit=8');
                if (res.ok) {
                    const data = await res.json();
                    setProducts(data.products);
                }
            } catch (error) {
                console.error("Failed to fetch best sellers", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBestSellers();
    }, []);

    const carouselRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(true);

    const checkScroll = () => {
        if (carouselRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
            setCanScrollLeft(scrollLeft > 0);
            setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
        }
    };

    useEffect(() => {
        checkScroll();
        window.addEventListener("resize", checkScroll);
        return () => window.removeEventListener("resize", checkScroll);
    }, []);

    const scroll = (direction: "left" | "right") => {
        if (carouselRef.current) {
            const { clientWidth } = carouselRef.current;
            const scrollAmount = direction === "left" ? -clientWidth / 2 : clientWidth / 2;
            carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
            setTimeout(checkScroll, 300); // Check after scroll animation
        }
    };

    return (
        <section className="py-24 bg-background">
            <div className="w-full px-4 md:px-8 max-w-[1800px] mx-auto">
                <div className="flex items-end justify-between mb-10">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Best Sellers</h2>
                        <p className="mt-2 text-muted-foreground">Top-rated picks loved by our customers.</p>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={() => scroll("left")}
                            disabled={!canScrollLeft}
                            className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:border-neutral-800 dark:hover:bg-neutral-800"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => scroll("right")}
                            disabled={!canScrollRight}
                            className="p-2 rounded-full border border-neutral-200 hover:bg-neutral-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors dark:border-neutral-800 dark:hover:bg-neutral-800"
                        >
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Carousel Container */}
                {loading ? (
                    <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="min-w-[280px] md:min-w-[320px] aspect-[4/5] bg-neutral-100 dark:bg-neutral-800 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : products.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-muted-foreground">No best sellers available yet.</p>
                    </div>
                ) : (
                    <div
                        ref={carouselRef}
                        onScroll={checkScroll}
                        className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                        style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                    >
                        {products.map((product, index) => (
                            <motion.div
                                key={product._id}
                                initial={{ opacity: 0, x: 20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="min-w-[280px] md:min-w-[320px] snap-start"
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
