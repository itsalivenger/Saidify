"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ShopGrid from "@/components/Shop/ShopGrid";
import QuickViewModal from "@/components/Shop/QuickViewModal";

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                if (query) {
                    const res = await fetch(`/api/products/search?q=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    setProducts(data.products);
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
                    <ShopGrid products={products} onQuickView={setQuickViewProduct} />
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-muted-foreground">No products found considering your search criteria.</p>
                    </div>
                )}
            </div>

            <QuickViewModal
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                product={quickViewProduct}
            />
        </main>
    );
}
