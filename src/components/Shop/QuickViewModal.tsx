"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Star, ShoppingBag, Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Product {
    id: string | number;
    title: string;
    price: string;
    category: string;
    rating: number;
    image: string;
    description?: string;
    stock?: number;
}

interface QuickViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Product;
}

export default function QuickViewModal({ isOpen, onClose, product }: QuickViewModalProps) {
    const { t } = useLanguage();
    if (!product) return null;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-neutral-900 w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row relative"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 z-10 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            {/* Image Side */}
                            <div className="w-full md:w-1/2 aspect-square md:aspect-auto bg-neutral-100 dark:bg-neutral-800 relative">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
                                <div className="mb-6">
                                    <span className="text-sm font-bold text-primary uppercase tracking-wider mb-2 block">
                                        {product.category}
                                    </span>
                                    <h2 className="text-3xl font-bold mb-2">{product.title}</h2>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="flex text-amber-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="w-4 h-4 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-sm text-muted-foreground">({product.rating || 128} {t.common.reviews})</span>
                                    </div>
                                    <p className="text-2xl font-bold">{product.price}</p>
                                </div>

                                <p className="text-muted-foreground mb-8 leading-relaxed">
                                    Experience premium quality with our meticulously crafted {product.title}.
                                    Designed for comfort and style, this piece is a versatile addition to any wardrobe.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-black text-white dark:bg-white dark:text-black py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                            <ShoppingBag className="w-5 h-5" />
                                            {t.common.addToCart}
                                        </button>
                                        <button className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-full hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                                            <Heart className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                    >
                                        {t.common.viewFullDetails}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
