"use client";

import WishlistGrid from "@/components/Wishlist/WishlistGrid";
import { useWishlist } from "@/context/WishlistContext";
import { Loader2 } from "lucide-react";

export default function WishlistPage() {
    const { items, isInitialized } = useWishlist();

    return (
        <main className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-[1600px]">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2">My Wishlist</h1>
                    <p className="text-muted-foreground">
                        {!isInitialized ? "Loading..." : `${items.length} items saved for later`}
                    </p>
                </div>

                {!isInitialized ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                ) : (
                    <WishlistGrid products={items.map(item => ({
                        ...item,
                        rating: 5 // Default for display
                    }))} />
                )}
            </div>
        </main>
    );
}
