"use client";

import { useState } from "react";
import { Star, Truck, ShieldCheck, ArrowRight, Minus, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
    product: {
        id: number;
        title: string;
        price: string;
        image: string;
        category: string;
        rating: number;
    };
    description?: string;
}

const SIZES = ["XS", "S", "M", "L", "XL"];
const COLORS = [
    { name: "Black", class: "bg-black" },
    { name: "White", class: "bg-white border text-black" },
    { name: "Blue", class: "bg-blue-600" },
];

import { useCart } from "@/context/CartContext";

export default function ProductInfo({ product, description }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState("M");
    const [selectedColor, setSelectedColor] = useState("Black");
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
                    <span className="text-sm font-bold tracking-wider uppercase text-primary bg-primary/10 px-3 py-1 rounded-full">
                        {product.category}
                    </span>
                    <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-foreground">{product.rating}</span>
                        <span className="text-sm text-muted-foreground ml-1">(128 Reviews)</span>
                    </div>
                </div>

                <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">{product.title}</h1>
                <p className="text-3xl font-bold">{product.price}</p>
            </div>

            <div className="h-px bg-neutral-200 dark:bg-neutral-800" />

            {/* Selectors */}
            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-bold mb-3">Color: <span className="text-muted-foreground font-normal">{selectedColor}</span></label>
                    <div className="flex gap-3">
                        {COLORS.map((color) => (
                            <button
                                key={color.name}
                                onClick={() => setSelectedColor(color.name)}
                                className={cn(
                                    "w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300",
                                    color.class,
                                    selectedColor === color.name ? "ring-2 ring-offset-2 ring-primary scale-110" : "hover:scale-105"
                                )}
                                title={color.name}
                            />
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold mb-3">Size: <span className="text-muted-foreground font-normal">{selectedSize}</span></label>
                    <div className="flex flex-wrap gap-3">
                        {SIZES.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={cn(
                                    "w-14 h-14 rounded-xl font-bold flex items-center justify-center border-2 transition-all duration-200",
                                    selectedSize === size
                                        ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                                        : "border-neutral-200 dark:border-neutral-800 hover:border-black/50 dark:hover:border-white/50"
                                )}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <div className="flex items-center border-2 border-neutral-200 dark:border-neutral-800 rounded-full w-fit">
                    <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-full"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                    <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-12 h-12 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-full"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                <button
                    onClick={handleAddToCart}
                    disabled={isAdded}
                    className={cn(
                        "flex-1 h-14 rounded-full font-bold text-lg transition-all active:scale-[0.98] shadow-lg",
                        isAdded
                            ? "bg-green-600 text-white shadow-green-600/25 cursor-default"
                            : "bg-primary text-primary-foreground hover:brightness-110 shadow-primary/25"
                    )}
                >
                    {isAdded ? "Added to Cart!" : `Add to Cart - ${product.price}`}
                </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 py-6">
                <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                    <Truck className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-sm">Free Shipping</h4>
                        <p className="text-xs text-muted-foreground mt-1">On orders over $200</p>
                    </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-neutral-50 dark:bg-neutral-900 rounded-xl">
                    <ShieldCheck className="w-6 h-6 text-primary flex-shrink-0" />
                    <div>
                        <h4 className="font-bold text-sm">Lifetime Warranty</h4>
                        <p className="text-xs text-muted-foreground mt-1">Full protection</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
                <div className="flex gap-8 border-b border-neutral-200 dark:border-neutral-800 mb-6">
                    {["description", "shipping", "reviews"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "pb-4 text-sm font-bold uppercase tracking-wider relative transition-colors",
                                activeTab === tab ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {tab}
                            {activeTab === tab && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-black dark:bg-white"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="min-h-[100px] text-muted-foreground leading-relaxed">
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
                                <button className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
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
