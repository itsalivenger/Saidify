"use client";

import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

export default function CartSummary() {
    const { subtotal } = useCart();
    const { t } = useLanguage();
    // Simple mock calculations
    const shipping = subtotal > 200 ? 0 : 15;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
    };

    return (
        <div className="bg-neutral-50 dark:bg-neutral-900 rounded-2xl p-6 lg:p-8 sticky top-24">
            <h2 className="text-xl font-black mb-6">{t.pages.checkout.orderSummary}</h2>

            <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping Estimate</span>
                    <span className="font-bold">{shipping === 0 ? t.common.free : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax Estimate</span>
                    <span className="font-bold">{formatPrice(tax)}</span>
                </div>
                <div className="border-t border-neutral-200 dark:border-neutral-800 pt-4 flex justify-between items-center">
                    <span className="font-bold text-lg">Order Total</span>
                    <span className="font-black text-xl">{formatPrice(total)}</span>
                </div>
            </div>

            <Link
                href="/checkout"
                className="w-full bg-black text-white dark:bg-white dark:text-black py-4 rounded-full font-bold text-lg hover:opacity-90 transition-opacity flex items-center justify-center cursor-pointer"
            >
                {t.common.checkout}
            </Link>
        </div>
    );
}
