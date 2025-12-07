"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search, User } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        { name: "Shop", href: "/shop" },
        { name: "Categories", href: "#" },
        { name: "New Arrivals", href: "#" },
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
                        ? "bg-white/80 backdrop-blur-md shadow-sm dark:bg-neutral-950/80 border-b border-neutral-200/50 dark:border-neutral-800/50 py-3"
                        : "bg-transparent py-5"
                )}
            >
                <div className="container mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="bg-primary text-primary-foreground p-1.5 rounded-lg group-hover:bg-primary/90 transition-colors">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-foreground">
                                Luxe<span className="text-primary">Mart</span>
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center gap-12">
                            {navLinks.map((link) => (
                                <motion.div
                                    key={link.name}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        href={link.href}
                                        className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors relative group"
                                    >
                                        {link.name}
                                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4">
                            <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent">
                                <Search className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent hidden sm:block">
                                <User className="w-5 h-5" />
                            </button>
                            <button className="p-2 text-muted-foreground hover:text-primary transition-colors rounded-full hover:bg-accent relative group">
                                <ShoppingBag className="w-5 h-5" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-background group-hover:scale-110 transition-transform" />
                            </button>

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
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="mt-6 flex gap-4"
                            >
                                <button className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-medium">Log In</button>
                                <button className="flex-1 bg-accent text-accent-foreground py-3 rounded-xl font-medium">Sign Up</button>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
