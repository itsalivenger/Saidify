"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface CartItem {
    id: number;
    title: string;
    price: string;
    image: string;
    quantity: number;
    selectedSize?: string;
    selectedColor?: string;
}

interface CartContextType {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    // Initial Load: Try API first, then LocalStorage
    useEffect(() => {
        const initializeCart = async () => {
            try {
                const res = await fetch("/api/cart");
                if (res.ok) {
                    const data = await res.json();
                    // Map API data back to frontend structure if needed (schema matches mostly)
                    const backendItems = data.cart.map((item: any) => ({
                        id: item.productId,
                        title: item.title,
                        price: item.price,
                        image: item.image,
                        quantity: item.quantity,
                        selectedSize: item.selectedSize,
                        selectedColor: item.selectedColor
                    }));
                    setItems(backendItems);
                    setIsAuthenticated(true);
                } else {
                    // Fallback to localStorage if 401/404
                    const savedCart = localStorage.getItem("cart");
                    if (savedCart) {
                        try {
                            setItems(JSON.parse(savedCart));
                        } catch (e) {
                            console.error("Failed to parse local cart", e);
                        }
                    }
                }
            } catch (error) {
                console.error("Cart init error", error);
                // Fallback on network error
                const savedCart = localStorage.getItem("cart");
                if (savedCart) setItems(JSON.parse(savedCart));
            } finally {
                setIsInitialized(true);
            }
        };

        initializeCart();
    }, []);

    // Effect: Sync to LocalStorage (always backup for guest) AND API (if auth)
    useEffect(() => {
        if (!isInitialized) return;

        // Always save to local for persistence if session dies
        if (!isAuthenticated) {
            localStorage.setItem("cart", JSON.stringify(items));
        }

        // If authenticated, we typically sync interactions via the action functions 
        // to avoid race conditions with this effect, but for simple full-sync:
        if (isAuthenticated) {
            // Debounce or just rely on the action methods to call API
            // For this implementation, I will move API calls to the actions (addToCart, etc)
            // and NOT sync inside this useEffect to purely avoid double-posts
        }
    }, [items, isInitialized, isAuthenticated]);

    const addToCart = async (newItem: CartItem) => {
        // Optimistic UI update
        const prevItems = [...items];
        setItems((currentItems) => {
            const existingItemIndex = currentItems.findIndex(
                (item) => item.id === newItem.id && item.selectedSize === newItem.selectedSize && item.selectedColor === newItem.selectedColor
            );

            if (existingItemIndex > -1) {
                const updatedItems = [...currentItems];
                updatedItems[existingItemIndex].quantity += newItem.quantity;
                return updatedItems;
            } else {
                return [...currentItems, newItem];
            }
        });

        // Sync with API if authenticated
        if (isAuthenticated) {
            try {
                await fetch("/api/cart", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        item: {
                            productId: newItem.id,
                            title: newItem.title,
                            price: newItem.price,
                            image: newItem.image,
                            quantity: newItem.quantity,
                            selectedSize: newItem.selectedSize,
                            selectedColor: newItem.selectedColor
                        }
                    }),
                });
            } catch (error) {
                console.error("Failed to sync add to cart", error);
                setItems(prevItems); // Revert on failure
            }
        }
    };

    const removeFromCart = async (id: number) => {
        const prevItems = [...items];
        setItems((prev) => prev.filter((item) => item.id !== id));

        if (isAuthenticated) {
            // For remove, simpler to just sync the whole new list for now or add a DELETE endpoint
            // Using PUT to sync full list is easiest for "Remove" and "Update Quantity"
            const newItems = prevItems.filter((item) => item.id !== id);
            try {
                await syncFullCart(newItems);
            } catch (error) {
                setItems(prevItems);
            }
        }
    };

    const updateQuantity = async (id: number, quantity: number) => {
        if (quantity < 1) return;
        const prevItems = [...items];

        const newItems = prevItems.map((item) => (item.id === id ? { ...item, quantity } : item));
        setItems(newItems);

        if (isAuthenticated) {
            try {
                await syncFullCart(newItems);
            } catch (error) {
                setItems(prevItems);
            }
        }
    };

    const clearCart = () => {
        setItems([]);
        if (isAuthenticated) {
            syncFullCart([]);
        } else {
            localStorage.removeItem("cart");
        }
    };

    const syncFullCart = async (cartItems: CartItem[]) => {
        const backendCart = cartItems.map(item => ({
            productId: item.id,
            title: item.title,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            selectedSize: item.selectedSize,
            selectedColor: item.selectedColor
        }));

        await fetch("/api/cart", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cart: backendCart }),
        });
    };

    // Derived state
    const totalItems = items.reduce((total, item) => total + item.quantity, 0);

    const subtotal = items.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ""));
        return total + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart,
                totalItems,
                subtotal,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}
