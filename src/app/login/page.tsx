"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail } from "lucide-react";
import AuthLayout from "@/components/Auth/AuthLayout";
import AuthInput from "@/components/Auth/AuthInput";
import { cn } from "@/lib/utils";

import { useAuth } from "@/context/AuthContext";

function LoginContent() {
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const router = useRouter();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(searchParams.get("message") || "");

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/profile");
        }
    }, [authLoading, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                const data = await res.json();
                login(data.user);
                router.push("/profile");
            } else {
                const data = await res.json();
                setError(data.message || "Login failed");
            }
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <AuthLayout
            title="Welcome back"
            subtitle="Enter your credentials to access your account"
            image="https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2671&auto=format&fit=crop"
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <AuthInput
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium leading-none">Password</label>
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Forgot password?
                        </Link>
                    </div>
                    <AuthInput
                        label="" // Handled by custom label above for layout needs
                        type="password"
                        placeholder="••••••••"
                        required
                        className="mt-0"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                </div>

                {error && (
                    <p className={cn(
                        "text-xs font-bold text-center py-2.5 rounded-xl border",
                        error.includes('Account created')
                            ? "text-emerald-500 bg-emerald-500/10 border-emerald-500/20"
                            : "text-rose-500 bg-rose-500/10 border-rose-500/20"
                    )}>
                        {error}
                    </p>
                )}

                <button
                    disabled={loading}
                    className="w-full bg-white text-black h-12 rounded-xl font-bold hover:bg-neutral-200 transition-all shadow-lg cursor-pointer disabled:opacity-70"
                >
                    {loading ? "Signing In..." : "Sign In"}
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-neutral-200 dark:border-neutral-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        type="button"
                        className="flex items-center justify-center gap-3 h-12 border border-neutral-200 dark:border-neutral-800 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all bg-background cursor-pointer"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        <span className="font-bold text-sm">Continue with Google</span>
                    </button>
                </div>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup" className="font-bold text-foreground hover:text-primary transition-colors">
                        Sign up
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}

export default function LoginPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <LoginContent />
        </Suspense>
    );
}
