"use client";

import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/Cart/CartItem";
import CartSummary from "@/components/Cart/CartSummary";
import { useLanguage } from "@/context/LanguageContext";

export default function CartPage() {
    const { items } = useCart();
    const { t } = useLanguage();

    if (items.length === 0) {
        return (
            <main className="min-h-screen pt-20 pb-20 px-4 flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
                    <ShoppingBag className="w-10 h-10 text-muted-foreground" />
                </div>
                <h1 className="text-3xl font-black mb-2">{t.pages.cart.emptyTitle}</h1>
                <p className="text-muted-foreground mb-8 max-w-sm">
                    {t.pages.cart.emptySub}
                </p>
                <Link
                    href="/shop"
                    className="px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:brightness-110 transition-all"
                >
                    {t.pages.cart.startShopping}
                </Link>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-[1200px]">
                <div className="flex items-center gap-2 mb-8">
                    <Link href="/shop" className="p-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 lg:hidden">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-black tracking-tight">{t.pages.cart.title} ({items.length})</h1>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 relative">
                    {/* Cart Items List */}
                    <div className="flex-1">
                        <div className="bg-white dark:bg-neutral-950 rounded-2xl p-6 shadow-sm border border-neutral-100 dark:border-neutral-800">
                            {items.map((item) => (
                                <CartItem key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} item={item} />
                            ))}
                        </div>
                        <div className="mt-6 flex justify-end">
                            <Link href="/shop" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
                                <ArrowLeft className="w-4 h-4" /> {t.pages.shop.continue}
                            </Link>
                        </div>
                    </div>

                    {/* Summary Sidebar */}
                    <div className="w-full lg:w-[380px] shrink-0">
                        <CartSummary />
                    </div>
                </div>
            </div>
        </main>
    );
}
