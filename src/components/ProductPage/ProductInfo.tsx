"use client";

import { useState } from "react";
import { Star, Truck, ShieldCheck, ArrowRight, Minus, Plus, Wand2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface ProductInfoProps {
    product: {
        id: string | number;
        title: string;
        price: string;
        image: string;
        category: string;
        rating: number;
        sizes?: string[];
        colors?: { name: string, value: string }[];
        isBlank?: boolean;
    };
    description?: string;
}

import { useCart } from "@/context/CartContext";

export default function ProductInfo({ product, description }: ProductInfoProps) {
    const { t } = useLanguage();
    const [selectedSize, setSelectedSize] = useState(product.sizes && product.sizes.length > 0 ? product.sizes[0] : "");
    const [selectedColor, setSelectedColor] = useState(product.colors && product.colors.length > 0 ? product.colors[0].name : "");
    const [quantity, setQuantity] = useState(1);
    const [activeTab, setActiveTab] = useState("description");
    const { addToCart } = useCart();
    const [isAdded, setIsAdded] = useState(false);

    const descriptionText = description || "Experience premium quality and timeless style with this meticulously crafted piece. Designed for modern living, it combines comfort with sophisticated aesthetics, making it a versatile addition to your wardrobe.";

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            title: product.title,
            price: product.price,
            image: product.image,
            quantity: quantity,
            selectedSize,
            selectedColor
        });

        // Simple visual feedback
        setIsAdded(true);
        setTimeout(() => setIsAdded(false), 2000);
    };

    return (
        <div className="flex flex-col gap-8">
            {/* Header */}
            <div>
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-black tracking-widest uppercase text-purple-500 bg-purple-500/10 px-3 py-1 rounded-full">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-foreground">{product.rating ? product.rating : "New"}</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{product.title}</h1>
                <p className="text-3xl font-black text-purple-600">{product.price}</p>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

            {/* Selectors */}
            <div className="space-y-8">
                {product.colors && product.colors.length > 0 && (
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Color: <span className="text-foreground">{selectedColor}</span></label>
                        <div className="flex gap-4">
                            {product.colors.map((color) => (
                                <button
                                    key={color.name}
                                    onClick={() => setSelectedColor(color.name)}
                                    className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2",
                                        selectedColor === color.name ? "border-purple-500 scale-110 shadow-lg shadow-purple-500/20" : "border-transparent hover:scale-110"
                                    )}
                                    title={color.name}
                                >
                                    <div
                                        className="w-full h-full rounded-full border border-white/10"
                                        style={{ backgroundColor: color.value }}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {product.sizes && product.sizes.length > 0 && (
                    <div>
                        <label className="block text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Size: <span className="text-foreground">{selectedSize}</span></label>
                        <div className="flex flex-wrap gap-3">
                            {product.sizes.map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setSelectedSize(size)}
                                    className={cn(
                                        "w-14 h-12 rounded-xl font-bold flex items-center justify-center border-2 transition-all duration-200",
                                        selectedSize === size
                                            ? "border-purple-500 bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                                            : "border-neutral-200 dark:border-neutral-800 hover:border-purple-500/50"
                                    )}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {!product.isBlank && (
                    <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-800 rounded-2xl w-fit bg-white/5">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-12 h-14 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-2xl transition-colors"
                        >
                            <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-12 h-14 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-2xl transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                        </button>
                    </div>
                )}

                {product.isBlank ? (
                    <Link
                        href={`/design/${product.id}`}
                        className="flex-1 h-14 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl uppercase tracking-widest bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25 hover:shadow-purple-500/40 flex items-center justify-center gap-2"
                    >
                        <Wand2 className="w-5 h-5" />
                        Design Now
                    </Link>
                ) : (
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdded}
                        style={{ cursor: 'pointer' }}
                        className={cn(
                            "flex-1 h-14 rounded-2xl font-black text-lg transition-all active:scale-[0.98] shadow-xl uppercase tracking-widest",
                            isAdded
                                ? "bg-green-600 text-white shadow-green-600/25"
                                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-600/25 hover:shadow-purple-500/40"
                        )}
                    >
                        {isAdded ? "✓" : t.common.addToCart}
                    </button>
                )}
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-6">
                <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <Truck className="w-6 h-6 text-purple-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-sm">Free Shipping</h4>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">On orders over 2000 MAD</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5 rounded-2xl">
                    <ShieldCheck className="w-6 h-6 text-purple-500 flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-sm">Lifetime Warranty</h4>
                        <p className="text-[10px] text-muted-foreground mt-1 font-medium">Full protection</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
                <div className="flex gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-6 font-black">
                    {["description", "shipping", "reviews"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-4 text-xs font-black uppercase tracking-widest relative transition-colors",
                                activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-purple-600 rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="min-h-[100px] text-muted-foreground leading-relaxed text-sm font-medium">
                    {activeTab === "description" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <p>{descriptionText}</p>
                            <ul className="list-disc list-inside mt-4 space-y-2">
                                <li>Premium cotton blend material</li>
                                <li>Double-stitched seams for durability</li>
                                <li>Pre-shrunk fabric</li>
                                <li>Eco-friendly production process</li>
                            </ul>
                        </motion.div>
                    )}
                    {activeTab === "shipping" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <p>We offer worldwide shipping via major carriers. Standard shipping takes 3-5 business days. Express shipping is available for all orders.</p>
                        </motion.div>
                    )}
                    {activeTab === "reviews" && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-foreground">Customer Reviews</h3>
                                <button className="text-sm font-bold text-purple-600 hover:underline flex items-center gap-1">
                                    Write a Review <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                            <p>No reviews yet.</p>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}

