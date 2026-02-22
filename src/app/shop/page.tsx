"use client";

import { useState, useEffect, useCallback } from "react";
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

export default function ShopPage() {
    const searchParams = useSearchParams();
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [category, setCategory] = useState(searchParams.get("category") || "All");
    const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
    const [sort, setSort] = useState("Newest Arrivals");
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000]);
    const [selectedSize, setSelectedSize] = useState("All");
    const [selectedColor, setSelectedColor] = useState("All");
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        setCategory(searchParams.get("category") || "All");
        setSearchQuery(searchParams.get("search") || "");
        setPage(1);
    }, [searchParams]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                if (res.ok) {
                    const data = await res.json();
                    const activeNames = data
                        .filter((cat: any) => cat.active)
                        .map((cat: any) => cat.name);
                    setCategories(activeNames);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };
        fetchCategories();
    }, []);

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const queryCategory = category === "All" ? "" : category;
            const res = await fetch(
                `/api/products?page=${page}&limit=9&category=${queryCategory}&search=${searchQuery}&sort=${sort}&minPrice=${priceRange[0]}&maxPrice=${priceRange[1]}&size=${selectedSize}&color=${selectedColor}`
            );
            const data = await res.json();
            if (res.ok) {
                setProducts(data.products);
                setTotalPages(data.totalPages);
                setTotalProducts(data.total);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [page, category, searchQuery, sort, priceRange, selectedSize, selectedColor]);

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
        <main className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-[1600px]">
                {/* Header */}
                <Breadcrumbs />
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8">Boutique</h1>

                <div className="flex flex-col lg:flex-row gap-12 relative">
                    {/* Sidebar */}
                    <ShopFilters
                        activeCategory={category}
                        onCategoryChange={(cat) => { setCategory(cat); setPage(1); }}
                        dbCategories={categories}
                        priceRange={priceRange}
                        onPriceChange={(range) => { setPriceRange(range); setPage(1); }}
                        activeSize={selectedSize}
                        onSizeChange={(s) => { setSelectedSize(s); setPage(1); }}
                        activeColor={selectedColor}
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
                            currentViewMode={viewMode}
                            onViewModeChange={setViewMode}
                        />
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                        ) : (
                            <>
                                <ShopGrid
                                    onQuickView={setQuickViewProduct}
                                    viewMode={viewMode}
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
            </div>

            {/* Quick View Modal */}
            {quickViewProduct && (
                <QuickViewModal
                    isOpen={!!quickViewProduct}
                    onClose={() => setQuickViewProduct(null)}
                    product={{
                        id: quickViewProduct._id,
                        title: quickViewProduct.title,
                        category: quickViewProduct.category,
                        image: quickViewProduct.image,
                        rating: quickViewProduct.rating,
                        price: `${quickViewProduct.price.toFixed(2)} MAD`
                    }}
                />
            )}
        </main>
    );
}
