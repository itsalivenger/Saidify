"use client";

import { motion } from "framer-motion";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: {
        id: number;
        title: string;
        price: string;
        image: string;
        category: string;
        rating: number;
    };
    onQuickView: (product: any) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
    return (
        <div className="group">
            <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-[3/4] mb-4">
                <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Overlay Actions */}
                <div className="absolute inset-x-0 bottom-4 px-4 flex justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <button
                        onClick={() => onQuickView(product)}
                        className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
                        title="Quick View"
                    >
                        <Eye className="w-5 h-5" />
                    </button>
                    <button
                        className="p-3 bg-black text-white rounded-full shadow-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 px-6"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-bold text-sm">Add</span>
                    </button>
                </div>

                {/* Wishlist Button */}
                <button className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white text-black">
                    <Heart className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-1">
                <div className="flex justify-between items-start">
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">
                        {product.category}
                    </span>
                    <div className="flex text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span className="text-xs text-neutral-500 ml-1 font-medium">{product.rating}</span>
                    </div>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate">
                    {product.title}
                </h3>
                <p className="font-bold">{product.price}</p>
            </div>
        </div>
    );
}
