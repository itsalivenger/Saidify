"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import Breadcrumbs from "@/components/Shop/Breadcrumbs";
import ShopFilters from "@/components/Shop/ShopFilters";
import ShopToolbar from "@/components/Shop/ShopToolbar";
import ShopGrid from "@/components/Shop/ShopGrid";
import Pagination from "@/components/Shop/Pagination";
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

import { useSearchParams } from "next/navigation";

function ShopContent() {
    const searchParams = useSearchParams();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [sort, setSort] = useState("newest");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");

    useEffect(() => {
        const cat = searchParams.get("category");
        if (cat) {
            setSelectedCategory(cat);
        } else {
            setSelectedCategory("All");
        }
    }, [searchParams]);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: "12",
                category: selectedCategory === "All" ? "" : selectedCategory,
                minPrice: priceRange[0].toString(),
                maxPrice: priceRange[1].toString(),
                sort,
                q: searchQuery,
            });

            if (selectedSize) params.append("size", selectedSize);
            if (selectedColor) params.append("color", selectedColor);

            const res = await fetch(`/api/products?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setProducts(data.products);
                setTotalPages(data.totalPages);
                setTotalProducts(data.total);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    }, [page, selectedCategory, priceRange, sort, searchQuery, selectedSize, selectedColor]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (res.ok) {
                    const data = await res.json();
                    setCategories(data.map((c: any) => c.name));
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    useEffect(() => {
        const productId = searchParams.get("productId");
        if (productId) {
            // Check if product is already in the list
            const foundInList = products.find(p => p._id === productId);
            if (foundInList) {
                setQuickViewProduct(foundInList);
            } else {
                // Fetch specific product for quick view
                const fetchSingleProduct = async () => {
                    try {
                        const res = await fetch(`/api/products/${productId}`); // I need to check if this route exists
                        if (res.ok) {
                            const data = await res.json();
                            setQuickViewProduct(data);
                        }
                    } catch (error) {
                        console.error('Error fetching single product:', error);
                    }
                };
                fetchSingleProduct();
            }
        }
    }, [searchParams, products]);

    return (
        <div className="min-h-screen bg-[#fcfcfc] dark:bg-[#0a0a0a]">
            {/* Header section with Breadcrumbs */}
            <div className="bg-white dark:bg-neutral-900/50 border-b border-neutral-100 dark:border-neutral-800">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Breadcrumbs />
                    <div className="mt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">{selectedCategory === 'All' ? 'All Products' : selectedCategory}</h1>
                            <p className="text-muted-foreground mt-1">Discover our curated collection of premium products</p>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* PC Filters */}
                    <ShopFilters
                        categories={categories}
                        selectedCategory={selectedCategory}
                        onCategoryChange={(cat) => { setSelectedCategory(cat); setPage(1); }}
                        priceRange={priceRange}
                        onPriceChange={(range) => { setPriceRange(range); setPage(1); }}
                        selectedSize={selectedSize}
                        onSizeChange={(s) => { setSelectedSize(s); setPage(1); }}
                        selectedColor={selectedColor}
                        onColorChange={(c) => { setSelectedColor(c); setPage(1); }}
                    />

                    {/* Main Content */}
                    <div className="flex-1">
                        <ShopToolbar
                            searchQuery={searchQuery}
                            onSearchChange={(val) => { setSearchQuery(val); setPage(1); }}
                            currentSort={sort}
                            onSortChange={(val) => { setSort(val); setPage(1); }}
                            totalProducts={totalProducts}
                            currentViewMode={viewMode as "grid" | "list"}
                            onViewModeChange={setViewMode}
                        />
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                <ShopGrid
                                    onQuickView={(item) => {
                                        const p = products.find(prod => String(prod._id) === String(item.id));
                                        if (p) setQuickViewProduct(p);
                                    }}
                                    viewMode={viewMode as "grid" | "list"}
                                    products={products.map((p: Product) => ({
                                        id: p._id,
                                        title: p.title,
                                        price: `${p.price.toFixed(2)} MAD`,
                                        category: p.category,
                                        rating: p.rating,
                                        image: p.image,
                                        description: p.description
                                    }))}
                                />
                                <Pagination
                                    currentPage={page}
                                    totalPages={totalPages}
                                    onPageChange={setPage}
                                />
                            </>
                        )}
                    </div>
                </div>
            </main>

            {/* Quick View Modal */}
            <QuickViewModal
                product={quickViewProduct as any}
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
        </div>
    );
}

export default function ShopPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
