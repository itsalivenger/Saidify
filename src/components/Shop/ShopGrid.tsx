"use client";

import ProductCard from "./ProductCard";

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
}

export default function ShopGrid({ onQuickView, products }: ShopGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} onQuickView={onQuickView} />
            ))}
        </div>
    );
}
