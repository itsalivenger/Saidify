"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import ProductCard from "@/components/Shop/ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface WishlistGridProps {
    products: any[];
}

export default function WishlistGrid({ products }: WishlistGridProps) {
    const { t } = useLanguage();
    if (products.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <Heart className="w-10 h-10 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
                <p className="text-muted-foreground mb-8 max-w-sm">
                    Looks like you haven&apos;t added any items to your wishlist yet.
                </p>
                <Link
                    href="/shop"
                    className="px-8 py-3 bg-white text-black rounded-full font-bold hover:bg-neutral-200 transition-all shadow-lg"
                >
                    {t.pages.cart.startShopping}
                </Link>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}
