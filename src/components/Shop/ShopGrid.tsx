"use client";

import ProductCard from "./ProductCard";

interface ShopGridProps {
    onQuickView: (product: any) => void;
}

import { PRODUCTS } from "@/lib/products";

export default function ShopGrid({ onQuickView }: ShopGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {PRODUCTS.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
            ))}
        </div>
    );
}
