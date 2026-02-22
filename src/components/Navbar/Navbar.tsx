"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useWishlist } from "@/context/WishlistContext";

export default function Navbar() {
    const { isAuthenticated, user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const { totalItems } = useCart();
    const { items: wishlistItems } = useWishlist();
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [settings, setSettings] = useState<any>(null);

    // Fetch Site Settings
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(data);
                }
            } catch (err) {
                console.error('Error fetching settings', err);
            }
        };
        fetchSettings();
    }, []);

    // Fetch suggestions
    useEffect(() => {
        const timer = setTimeout(async () => {
            if (searchQuery.trim().length > 1) {
                try {
                    const res = await fetch(`/api/products?search=${encodeURIComponent(searchQuery)}&limit=5`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data.products || []);
                        setShowSuggestions(true);
                    }
                } catch (error) {
                    console.error("Suggestions fetch error:", error);
                }
            } else {
                setSuggestions([]);
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setShowSuggestions(false);
            setSearchQuery("");
        }
    };

    const handleSuggestionClick = (productId: string) => {
        router.push(`/shop?productId=${productId}`);
        setIsSearchOpen(false);
        setSearchQuery("");
        setShowSuggestions(false);
    };

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Collections", href: "/categories" },
        { name: "Boutique", href: "/shop" },
        { name: "Studio", href: "/design" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <>
            <motion.nav
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ duration: 0.5 }}
                className={cn(
                    "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                    isScrolled
                        ? "py-3 bg-white/80 dark:bg-black/80 backdrop-blur-xl border-b border-neutral-200/50 dark:border-neutral-800/50"
                        : "py-6 bg-transparent"
                )}
            >
                <div className="container mx-auto px-4 md:px-6 max-w-[1400px]">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group relative z-10">
                            {settings?.mainSettings?.logo ? (
                                <img src={settings.mainSettings.logo} alt={settings.mainSettings.siteName} className="h-8 md:h-10 w-auto object-contain" />
                            ) : (
                                <>
                                    <div className="bg-black dark:bg-white text-white dark:text-black p-2 rounded-xl group-hover:rotate-6 transition-transform">
                                        <ShoppingBag className="w-5 h-5" />
                                    </div>
                                    <span className="text-2xl font-black tracking-tighter uppercase transition-colors">
                                        {settings?.mainSettings?.siteName || "Said Store"}
                                    </span>
                                </>
                            )}
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden lg:flex items-center gap-1 bg-neutral-100/50 dark:bg-white/5 p-1 rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50">
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.name}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="px-5 py-2.5 rounded-xl text-sm font-bold text-muted-foreground hover:text-black dark:hover:text-white transition-all hover:bg-white dark:hover:bg-neutral-800 hover:shadow-sm"
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-3">
                            <div className="relative flex items-center">
                                <AnimatePresence>
                                    {isSearchOpen ? (
                                        <div className="relative">
                                            <motion.form
                                                initial={{ width: 0, opacity: 0 }}
                                                animate={{ width: 200, opacity: 1 }}
                                                exit={{ width: 0, opacity: 0 }}
                                                transition={{ duration: 0.3 }}
                                                onSubmit={handleSearch}
                                                className="overflow-hidden"
                                            >
                                                <input
                                                    ref={searchInputRef}
                                                    type="text"
                                                    placeholder="Search..."
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                    onBlur={() => {
                                                        // Delay to allow clicking on suggestion
                                                        setTimeout(() => setShowSuggestions(false), 200);
                                                        if (!searchQuery) setIsSearchOpen(false);
                                                    }}
                                                    className="w-full bg-accent/50 border-none rounded-full py-1.5 px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                                                    autoFocus
                                                />
                                            </motion.form>

                                            {/* Suggestions Dropdown */}
                                            <AnimatePresence>
                                                {showSuggestions && suggestions.length > 0 && (
                                                    <motion.div
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: 10 }}
                                                        className="absolute top-12 left-0 w-64 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-xl overflow-hidden z-[60]"
                                                    >
                                                        <div className="p-2">
                                                            {suggestions.map((product) => (
                                                                <button
                                                                    key={product._id}
                                                                    onClick={() => handleSuggestionClick(product._id)}
                                                                    className="flex items-center gap-3 w-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-left group"
                                                                >
                                                                    <div className="w-10 h-10 rounded-md overflow-hidden bg-neutral-100 dark:bg-neutral-800 shrink-0">
                                                                        <img src={product.image} alt={product.title} className="w-full h-full object-cover" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">{product.title}</p>
                                                                        <p className="text-xs text-muted-foreground">{product.price.toFixed(2)} MAD</p>
                                                                    </div>
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : null}
                                </AnimatePresence>
                                <button
                                    onClick={() => {
                                        setIsSearchOpen(true);
                                        setTimeout(() => searchInputRef.current?.focus(), 100);
                                    }}
                                    className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent"
                                >
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                            <Link href="/wishlist" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent relative group">
                                <Heart className="w-5 h-5" />
                                <AnimatePresence>
                                    {wishlistItems.length > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute top-0 right-0 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background"
                                        >
                                            {wishlistItems.length}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            <Link
                                href={isAuthenticated ? "/profile" : "/login"}
                                className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent hidden sm:block flex items-center gap-2"
                            >
                                <User className="w-5 h-5" />
                                {isAuthenticated && user && (
                                    <span className="text-xs font-bold transition-all hidden md:block">
                                        Hi, {user.name.split(" ")[0]}
                                    </span>
                                )}
                            </Link>
                            <Link href="/cart" className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent relative group">
                                <ShoppingBag className="w-5 h-5" />
                                <AnimatePresence>
                                    {totalItems > 0 && (
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            exit={{ scale: 0 }}
                                            className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-background"
                                        >
                                            {totalItems}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </Link>

                            {/* Mobile Menu Button */}
                            <button
                                className="md:hidden p-2 text-foreground"
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            >
                                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                            </button>
                        </div>
                    </div>
                </div>
            </motion.nav>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "100vh" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="fixed inset-0 top-[60px] z-40 bg-background md:hidden overflow-hidden"
                    >
                        <div className="p-6 flex flex-col gap-6">
                            {navLinks.map((link, i) => (
                                <motion.div
                                    key={link.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-2xl font-semibold text-foreground hover:text-primary block py-2 border-b border-muted"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: navLinks.length * 0.1 }}
                            >
                                <Link
                                    href="/wishlist"
                                    className="text-2xl font-semibold text-foreground hover:text-primary block py-2 border-b border-muted flex items-center justify-between"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    My Wishlist
                                    {wishlistItems.length > 0 && (
                                        <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">{wishlistItems.length}</span>
                                    )}
                                </Link>
                            </motion.div>

                            {isAuthenticated && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: (navLinks.length + 1) * 0.1 }}
                                >
                                    <Link
                                        href="/profile"
                                        className="text-2xl font-semibold text-foreground hover:text-primary block py-2 border-b border-muted"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        My Profile
                                    </Link>
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 flex gap-4"
                            >
                                {!isAuthenticated ? (
                                    <>
                                        <Link href="/login" className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-medium text-center" onClick={() => setIsMobileMenuOpen(false)}>Log In</Link>
                                        <Link href="/signup" className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-medium text-center" onClick={() => setIsMobileMenuOpen(false)}>Sign Up</Link>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-medium text-center"
                                    >
                                        Log Out
                                    </button>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
