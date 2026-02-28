'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft,
    CreditCard,
    Truck,
    ShieldCheck,
    ArrowRight,
    MapPin,
    Phone,
    User,
    Mail,
    ShoppingBag,
    CheckCircle2,
    Loader2,
    Lock
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';
import AuthModal from '@/components/Auth/AuthModal';

export default function CheckoutPage() {
    const { items, subtotal, totalItems } = useCart();
    const { t } = useLanguage();
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: ''
    });

    useEffect(() => {
        // Quick check for login status
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/orders'); // Hits an endpoint that requires auth
                if (res.ok) setIsLoggedIn(true);
            } catch (error) {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
    }, []);

    const shipping = subtotal > 2000 ? 0 : 50;
    const total = subtotal + shipping;

    const placeOrder = async () => {
        if (!isLoggedIn) {
            setIsAuthModalOpen(true);
            return;
        }

        setLoading(true);
        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items,
                    totalAmount: total,
                    shippingAddress: formData,
                    paymentMethod: 'email_request'
                })
            });

            if (res.ok) {
                setStep(2); // Success step
                // Refresh cart from context if needed, though API clears it in DB
                router.refresh();
            } else {
                const data = await res.json();
                if (res.status === 401) {
                    setIsLoggedIn(false);
                    setIsAuthModalOpen(true);
                } else {
                    alert(data.message || "Something went wrong. Please try again.");
                }
            }
        } catch (error) {
            console.error("Checkout error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('fr-MA', { style: 'currency', currency: 'MAD' }).format(price);
    };

    if (totalItems === 0 && step !== 2) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-4">
                <ShoppingBag className="w-16 h-16 text-neutral-300 mb-4" />
                <h1 className="text-2xl font-black mb-2">{t.pages.checkout.emptyTitle}</h1>
                <p className="text-muted-foreground mb-8 text-center">{t.pages.checkout.emptySub}</p>
                <Link
                    href="/shop"
                    className="bg-purple-600 text-white px-8 py-3 rounded-full font-bold hover:bg-purple-700 transition-all"
                >
                    {t.pages.checkout.returnShop}
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white pt-24 pb-12">
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                onSuccess={() => setIsLoggedIn(true)}
            />

            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <Link href="/shop" className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold">{t.pages.checkout.backShop}</span>
                    </Link>
                    <div className="flex items-center gap-2">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300",
                                    step >= i ? "bg-purple-600 scale-125" : "bg-white/10"
                                )}
                            />
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* Main Flow */}
                    <div className="lg:col-span-7">
                        <AnimatePresence mode="wait">
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="space-y-8"
                                >
                                    <div>
                                        <h1 className="text-4xl font-black mb-2">{t.pages.checkout.title}</h1>
                                        <p className="text-neutral-400 font-medium">{t.pages.checkout.subtitle}</p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">First Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-purple-500" />
                                                <input
                                                    name="firstName"
                                                    value={formData.firstName}
                                                    onChange={handleInputChange}
                                                    placeholder="John"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Last Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-purple-500" />
                                                <input
                                                    name="lastName"
                                                    value={formData.lastName}
                                                    onChange={handleInputChange}
                                                    placeholder="Doe"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Email Address</label>
                                            <div className="relative group">
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="john@example.com"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Phone Number</label>
                                            <div className="relative group">
                                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-purple-500 transition-colors" />
                                                <input
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    placeholder="+212 600 000000"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-xs font-black uppercase tracking-widest text-neutral-500 ml-1">Shipping Address</label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 group-focus-within:text-purple-500" />
                                                <input
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    placeholder="123 Luxury Ave, Casablanca"
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-600/50 transition-all font-medium"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <div className="flex items-start gap-4 p-6 bg-purple-500/5 border border-purple-500/10 rounded-[2rem] mb-8">
                                            <div className="p-3 bg-purple-500/10 rounded-2xl">
                                                <Mail className="w-6 h-6 text-purple-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-white mb-1 uppercase tracking-wider text-sm">Order by Email Request</h4>
                                                <p className="text-neutral-400 text-sm leading-relaxed">
                                                    After placing your order, we will contact you via email to finalize the details and arrange for your premium delivery. No payment is required right now.
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={placeOrder}
                                            disabled={loading}
                                            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 py-6 rounded-2xl font-black text-xl hover:shadow-2xl hover:shadow-purple-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                                        >
                                            {loading ? (
                                                <Loader2 className="w-6 h-6 animate-spin" />
                                            ) : (
                                                <>
                                                    {t.pages.checkout.placeOrder} <ArrowRight className="w-6 h-6" />
                                                </>
                                            )}
                                        </button>

                                        {!isLoggedIn && (
                                            <p className="text-center mt-4 text-xs font-bold text-neutral-500 flex items-center justify-center gap-2">
                                                <Lock className="w-3 h-3 text-amber-500" /> Authentication required to place orders.
                                            </p>
                                        )}
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="flex flex-col items-center justify-center py-20 text-center"
                                >
                                    <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/20">
                                        <CheckCircle2 className="w-12 h-12 text-white" />
                                    </div>
                                    <h1 className="text-5xl font-black mb-4">{t.pages.checkout.successTitle}</h1>
                                    <p className="text-neutral-400 max-w-md mx-auto mb-12 font-medium">
                                        {t.pages.checkout.successSub}
                                    </p>
                                    <Link
                                        href="/shop"
                                        className="bg-white text-black px-12 py-5 rounded-full font-black hover:scale-105 active:scale-95 transition-all text-lg"
                                    >
                                        Return to Shop
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar Summary */}
                    <div className="lg:col-span-5">
                        <div className="bg-[#111111] border border-white/5 rounded-3xl p-8 sticky top-24">
                            <h2 className="text-xl font-black mb-8 pb-4 border-b border-white/5">Order Summary</h2>

                            <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto px-1 custom-scrollbar">
                                {items.map((item) => (
                                    <div key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="flex gap-4">
                                        <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-white/5 border border-white/5">
                                            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-white truncate text-sm">{item.title}</h4>
                                            <p className="text-xs text-neutral-400 mt-1 uppercase font-black tracking-tighter">
                                                {item.selectedSize} / {item.selectedColor}
                                            </p>
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs font-bold bg-white/5 px-2 py-1 rounded-md">Qty: {item.quantity}</span>
                                                <span className="text-sm font-black text-purple-400">{item.price}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4 pt-6 border-t border-white/5">
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Subtotal</span>
                                    <span className="font-bold">{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-neutral-500 font-bold uppercase tracking-wider text-[10px]">Shipping</span>
                                    <span className="font-bold text-emerald-500">{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
                                </div>
                                <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                                    <span className="font-black text-lg uppercase tracking-tight">Total</span>
                                    <span className="font-black text-3xl text-purple-500 tracking-tighter">
                                        {formatPrice(total)}
                                    </span>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-2 gap-4">
                                <div className="p-3 rounded-2xl bg-white/5 flex flex-col items-center gap-1 text-center">
                                    <Truck className="w-4 h-4 text-purple-500" />
                                    <span className="text-[8px] font-black uppercase text-neutral-400">Fast Delivery</span>
                                </div>
                                <div className="p-3 rounded-2xl bg-white/5 flex flex-col items-center gap-1 text-center">
                                    <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[8px] font-black uppercase text-neutral-400">Request Order</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 10px;
                }
            `}</style>
        </div>
    );
}
