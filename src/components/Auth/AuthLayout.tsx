"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, ArrowLeft } from "lucide-react";

interface AuthLayoutProps {
    children: React.ReactNode;
    title: string;
    subtitle: string;
    image: string;
}

export default function AuthLayout({ children, title, subtitle, image }: AuthLayoutProps) {
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Visual Side */}
            <div className="hidden lg:block relative overflow-hidden bg-neutral-900">
                <div className="absolute inset-0 bg-primary/20 z-10" />
                <img
                    src={image}
                    alt="Authentication Background"
                    className="w-full h-full object-cover opacity-80"
                />
                <div className="absolute inset-0 z-20 flex flex-col justify-between p-12 text-white">
                    <Link href="/" className="flex items-center gap-2 w-fit">
                        <div className="bg-white text-black p-1.5 rounded-lg">
                            <ShoppingBag className="w-5 h-5" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            Luxe<span className="text-primary-foreground">Mart</span>
                        </span>
                    </Link>

                    <div>
                        <h2 className="text-4xl font-black mb-4 tracking-tight">Elevate Your Style.</h2>
                        <p className="text-lg text-white/80 max-w-md">
                            Join our exclusive community and discover a world of premium fashion curated just for you.
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Side */}
            <div className="flex flex-col justify-center items-center p-6 sm:p-12 relative bg-background">
                <Link
                    href="/"
                    className="absolute top-6 left-6 lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Link>

                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-2"
                        >
                            <h1 className="text-3xl font-black tracking-tight">{title}</h1>
                            <p className="text-muted-foreground">{subtitle}</p>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        {children}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
