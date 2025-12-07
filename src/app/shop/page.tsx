"use client";

import { useState } from "react";
import Breadcrumbs from "@/components/Shop/Breadcrumbs";
import ShopFilters from "@/components/Shop/ShopFilters";
import ShopToolbar from "@/components/Shop/ShopToolbar";
import ShopGrid from "@/components/Shop/ShopGrid";
import Pagination from "@/components/Shop/Pagination";
import QuickViewModal from "@/components/Shop/QuickViewModal";

export default function ShopPage() {
    const [quickViewProduct, setQuickViewProduct] = useState(null);

    return (
        <main className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-[1600px]">
                {/* Header */}
                <Breadcrumbs />
                <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-8">Boutique</h1>

                <div className="flex flex-col lg:flex-row gap-12 relative">
                    {/* Sidebar */}
                    <ShopFilters />

                    {/* Main Content */}
                    <div className="flex-1">
                        <ShopToolbar />
                        <ShopGrid onQuickView={setQuickViewProduct} />
                        <Pagination />
                    </div>
                </div>
            </div>

            {/* Quick View Modal */}
            <QuickViewModal
                isOpen={!!quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
                product={quickViewProduct}
            />
        </main>
    );
}
