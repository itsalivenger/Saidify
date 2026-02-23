"use client";

import { Heart, ShoppingBag, Eye, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useWishlist } from "@/context/WishlistContext";

interface Product {
    id: string | number;
    title: string;
    price: string;
    image: string;
    category: string;
    rating: number;
    isBlank?: boolean;
    description?: string;
}

interface ProductCardProps {
    product: Product;
    onQuickView?: (product: Product) => void;
    viewMode?: 'grid' | 'list';
}

export default function ProductCard({ product, onQuickView, viewMode = 'grid' }: ProductCardProps) {
    const { toggleWishlist, isInWishlist } = useWishlist();
    const isSaved = isInWishlist(String(product.id));

    if (viewMode === 'list') {
        return (
            <div className="group flex flex-col sm:flex-row gap-6 bg-white dark:bg-neutral-900/50 p-4 rounded-3xl border border-neutral-200 dark:border-neutral-800 hover:border-primary/50 transition-all duration-300">
                {/* Image Section */}
                <div className="relative w-full sm:w-64 shrink-0 overflow-hidden rounded-2xl bg-neutral-100 aspect-[4/3] sm:aspect-square">
                    <Link href={`/shop/${product.id}`}>
                        <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </Link>
                    {product.isBlank && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10">
                            Customizable
                        </div>
                    )}
                </div>

                {/* Info Section */}
                <div className="flex-1 flex flex-col justify-between py-2">
                    <div>
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest bg-primary/5 px-2 py-1 rounded-md">
                                {product.category}
                            </span>
                            <div className="flex items-center text-amber-400 bg-amber-400/5 px-2 py-1 rounded-md">
                                <Star className="w-3 h-3 fill-current" />
                                <span className="text-xs text-neutral-500 ml-1.5 font-black">{product.rating}</span>
                            </div>
                        </div>
                        <Link href={`/shop/${product.id}`}>
                            <h3 className="text-xl font-black text-foreground group-hover:text-primary transition-colors cursor-pointer mb-2">
                                {product.title}
                            </h3>
                        </Link>
                        <p className="text-sm text-neutral-500 line-clamp-2 mb-4 leading-relaxed">
                            {product.description || "Découvrez notre produit exclusif, conçu avec une attention méticuleuse aux détails pour vous offrir le meilleur style et confort possible."}
                        </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                        <p className="text-2xl font-black text-foreground">{product.price}</p>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => toggleWishlist({
                                    id: String(product.id),
                                    title: product.title,
                                    price: product.price,
                                    image: product.image,
                                    category: product.category
                                })}
                                className={cn(
                                    "p-3 rounded-full transition-all duration-300 border",
                                    isSaved
                                        ? "bg-red-500 border-red-500 text-white shadow-lg shadow-red-500/20"
                                        : "bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:text-red-500"
                                )}
                            >
                                <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
                            </button>
                            <button
                                className="h-12 px-6 bg-black dark:bg-white text-white dark:text-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                <ShoppingBag className="w-5 h-5" />
                                <span className="font-black text-sm uppercase tracking-widest">Ajouter</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="group">
            <div className="relative overflow-hidden rounded-xl bg-neutral-100 aspect-[3/4] mb-4">
                <Link href={`/shop/${product.id}`}>
                    <img
                        src={product.image}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                </Link>

                {product.isBlank && (
                    <div className="absolute top-3 left-3 px-3 py-1 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg z-10">
                        Customizable
                    </div>
                )}

                {/* Overlay Actions */}
                <div className="absolute inset-x-0 bottom-4 px-4 flex justify-center gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {onQuickView && (
                        <button
                            onClick={() => onQuickView(product)}
                            className="p-3 bg-white text-black rounded-full shadow-lg hover:bg-neutral-100 transition-colors"
                            title="Quick View"
                        >
                            <Eye className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        className="p-3 bg-black text-white rounded-full shadow-lg hover:bg-neutral-800 transition-colors flex items-center gap-2 px-6"
                    >
                        <ShoppingBag className="w-5 h-5" />
                        <span className="font-bold text-sm">Add</span>
                    </button>
                </div>

                {/* Wishlist Button */}
                <button
                    onClick={() => toggleWishlist({
                        id: String(product.id),
                        title: product.title,
                        price: product.price,
                        image: product.image,
                        category: product.category
                    })}
                    className={cn(
                        "absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all duration-300 hover:scale-110",
                        isSaved
                            ? "bg-red-500 text-white opacity-100"
                            : "bg-white/50 opacity-0 group-hover:opacity-100 hover:bg-white text-black"
                    )}
                >
                    <Heart className={cn("w-5 h-5", isSaved && "fill-current")} />
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
                <Link href={`/shop/${product.id}`}>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors cursor-pointer truncate">
                        {product.title}
                    </h3>
                </Link>
                <p className="font-bold">{product.price}</p>
            </div>
        </div>
    );
}
