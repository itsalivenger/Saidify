"use client";

import ProductCard from "./ProductCard";
import { cn } from "@/lib/utils";

interface ProductItem {
    id: string | number;
    title: string;
    price: string;
    category: string;
    rating: number;
    image: string;
}

interface ShopGridProps {
    onQuickView: (product: any) => void;
    products: ProductItem[];
    viewMode?: 'grid' | 'list';
}

export default function ShopGrid({ onQuickView, products, viewMode = 'grid' }: ShopGridProps) {
    return (
        <div className={cn(
            "grid gap-x-6 gap-y-10",
            viewMode === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
        )}>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    product={product}
                    onQuickView={onQuickView}
                    viewMode={viewMode}
                />
            ))}
        </div>
    );
}
