"use client";

import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Star, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const PRODUCTS = [
    {
        id: 1,
        name: "Versatile Oxford Shirt",
        price: "$59.00",
        rating: 4.8,
        reviews: 124,
        tag: "Trending",
        imageColor: "bg-blue-100",
    },
    {
        id: 2,
        name: "Classic Chino Shorts",
        price: "$45.00",
        rating: 4.6,
        reviews: 89,
        tag: "Best Seller",
        imageColor: "bg-stone-100",
    },
    {
        id: 3,
        name: "Heavyweight Cotton Tee",
        price: "$32.00",
        rating: 4.9,
        reviews: 210,
        tag: "Hot",
        imageColor: "bg-gray-200",
    },
    {
        id: 4,
        name: "Performance Joggers",
        price: "$78.00",
        rating: 4.7,
        reviews: 156,
        tag: "New",
        imageColor: "bg-neutral-200",
    },
    {
        id: 5,
        name: "Waterproof Rain Jacket",
        price: "$120.00",
        rating: 4.9,
        reviews: 75,
        tag: "Sale",
        imageColor: "bg-indigo-100",
    },
    {
        id: 6,
        name: "Leather Weekend Bag",
        price: "$195.00",
        rating: 4.8,
        reviews: 42,
        tag: "Premium",
        imageColor: "bg-amber-100",
    },
];

export default function BestSellers() {
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
                <div
                    ref={carouselRef}
                    onScroll={checkScroll}
                    className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide"
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                >
                    {PRODUCTS.map((product, index) => (
                        <motion.div
                            key={product.id}
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="min-w-[280px] md:min-w-[320px] snap-start"
                        >
                            <div className="group relative">
                                {/* Image Area */}
                                <div className={cn(
                                    "aspect-[4/5] w-full overflow-hidden rounded-2xl bg-neutral-100 relative mb-4",
                                    product.imageColor
                                )}>
                                    {/* Tag */}
                                    <div className="absolute top-3 left-3">
                                        <span className="bg-white/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                                            {product.tag}
                                        </span>
                                    </div>

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                                    {/* Add to Cart Button */}
                                    <button className="absolute bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white text-black font-medium py-3 rounded-xl shadow-lg translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-2 hover:bg-primary hover:text-white">
                                        <ShoppingBag className="w-4 h-4" /> Add to Cart
                                    </button>
                                </div>

                                {/* Info */}
                                <div>
                                    <div className="flex justify-between items-start mb-1">
                                        <h3 className="font-semibold text-lg text-foreground truncate pr-2">{product.name}</h3>
                                        <div className="flex items-center gap-1 text-amber-500 text-sm font-medium">
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                            {product.rating}
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground text-sm font-medium">{product.price}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
