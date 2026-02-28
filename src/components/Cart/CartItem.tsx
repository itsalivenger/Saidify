"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart, CartItem as CartItemType } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import { getLocalizedText } from "@/lib/translations";

interface CartItemProps {
    item: CartItemType;
}

export default function CartItem({ item }: CartItemProps) {
    const { updateQuantity, removeFromCart } = useCart();
    const { t, language } = useLanguage();

    return (
        <div className="flex gap-4 md:gap-6 py-6 border-b border-neutral-200 dark:border-neutral-800 last:border-0">
            {/* Image */}
            <Link href={`/shop/${item.id}`} className="shrink-0">
                <div className="w-24 h-24 md:w-32 md:h-32 bg-neutral-100 rounded-lg overflow-hidden">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            </Link>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start mb-1">
                        <Link href={`/shop/${item.id}`}>
                            <h3 className="font-bold text-lg hover:text-primary transition-colors line-clamp-1">{item.title}</h3>
                        </Link>
                        <p className="font-bold text-lg">{item.price}</p>
                    </div>
                    {(item.selectedSize || item.selectedColor) && (
                        <div className="text-sm text-muted-foreground space-x-2">
                            {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                            {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        </div>
                    )}
                </div>

                <div className="flex justify-between items-center mt-4">
                    {/* Quantity Control */}
                    <div className="flex items-center border border-neutral-200 dark:border-neutral-800 rounded-full h-9 md:h-10">
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-l-full"
                            disabled={item.quantity <= 1}
                        >
                            <Minus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 md:w-10 h-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-r-full"
                        >
                            <Plus className="w-3 h-3 md:w-4 md:h-4" />
                        </button>
                    </div>

                    {/* Remove Action */}
                    <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-muted-foreground hover:text-red-500 transition-colors flex items-center gap-1"
                    >
                        <Trash2 className="w-4 h-4" />
                        <span className="hidden md:inline">{t.common.remove}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
