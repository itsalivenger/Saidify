"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface WishlistProduct {
    id: string;
    title: string;
    price: string;
    image: string;
    category: string;
}

interface WishlistContextType {
    items: WishlistProduct[];
    toggleWishlist: (product: WishlistProduct) => void;
    isInWishlist: (id: string) => boolean;
    isInitialized: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<WishlistProduct[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Load
    useEffect(() => {
        const initializeWishlist = async () => {
            try {
                const res = await fetch("/api/wishlist");
                if (res.ok) {
                    const data = await res.json();
                    setItems(data.wishlist.map((p: any) => ({
                        id: p._id,
                        title: p.title,
                        price: `${p.price.toFixed(2)} MAD`,
                        image: p.image,
                        category: p.category
                    })));
                    setIsAuthenticated(true);
                } else {
                    const saved = localStorage.getItem("wishlist");
                    if (saved) setItems(JSON.parse(saved));
                }
            } catch (error) {
                console.error("Wishlist init error", error);
                const saved = localStorage.getItem("wishlist");
                if (saved) setItems(JSON.parse(saved));
            } finally {
                setIsInitialized(true);
            }
        };
        initializeWishlist();
    }, []);

    // Sync guest wishlist to localStorage
    useEffect(() => {
        if (isInitialized && !isAuthenticated) {
            localStorage.setItem("wishlist", JSON.stringify(items));
        }
    }, [items, isInitialized, isAuthenticated]);

    const toggleWishlist = async (product: WishlistProduct) => {
        const exists = items.some(item => item.id === product.id);
        const prevItems = [...items];

        if (exists) {
            setItems(prev => prev.filter(item => item.id !== product.id));
        } else {
            setItems(prev => [...prev, product]);
        }

        if (isAuthenticated) {
            try {
                await fetch("/api/wishlist", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productId: product.id }),
                });
            } catch (error) {
                console.error("Sync wishlist error", error);
                setItems(prevItems);
            }
        }
    };

    const isInWishlist = (id: string) => items.some(item => item.id === id);

    return (
        <WishlistContext.Provider value={{ items, toggleWishlist, isInWishlist, isInitialized }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
}
