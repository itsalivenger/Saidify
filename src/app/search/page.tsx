"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ShopGrid from "@/components/Shop/ShopGrid";
import QuickViewModal from "@/components/Shop/QuickViewModal";

interface Product {
    _id: string;
    title: string;
    price: number;
    category: string;
    image: string;
    rating: number;
    description?: string;
    stock?: number;
}

function SearchContent() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                if (query) {
                    const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    setProducts(data.products || []);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Failed to fetch search results", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [query]);

    return (
        <main className="min-h-screen bg-background py-24 px-4 md:px-8">
            <div className="container mx-auto max-w-[1600px]">
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8">
                    {loading ? "Searching..." : `Search results for "${query || ''}"`}
                </h1>

                {loading ? (
                    <div className="text-center py-20">Loading...</div>
                ) : products.length > 0 ? (
                    <ShopGrid
                        products={products.map((p: any) => ({
                            id: p._id,
                            title: p.title,
                            price: `${p.price.toFixed(2)} MAD`,
                            category: p.category,
                            rating: p.rating,
                            image: p.image,
                            description: p.description
                        }))}
                        onQuickView={(p: any) => {
                            const found = products.find(prod => prod._id === p.id);
                            if (found) setQuickViewProduct(found);
                        }}
                    />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">No products found considering your search criteria.</p>
                    </div>
                )}
            </div>

            {quickViewProduct && (
                <QuickViewModal
                    isOpen={!!quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                    product={quickViewProduct as any}
                />
            )}
        </main>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
