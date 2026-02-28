"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AuthLayout from "@/components/Auth/AuthLayout";
import AuthInput from "@/components/Auth/AuthInput";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
    const { t } = useLanguage();
    const { isAuthenticated, loading: authLoading } = useAuth();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push("/profile");
        }
    }, [authLoading, isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone
                }),
            });

            if (res.ok) {
                router.push("/login?message=Account created! Please log in.");
            } else {
                const data = await res.json();
                setError(data.message || "Signup failed");
            }
        } catch (err) {
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
            title={t.pages.auth.signupTitle}
            subtitle={t.pages.auth.signupSub}
            image="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop"
        >
            <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                        label={t.pages.auth.firstName}
                        type="text"
                        placeholder="John"
                        required
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    />
                    <AuthInput
                        label={t.pages.auth.lastName}
                        type="text"
                        placeholder="Doe"
                        required
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    />
                </div>
                <AuthInput
                    label={t.pages.auth.email}
                    type="email"
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <AuthInput
                    label={t.pages.auth.phone}
                    type="tel"
                    placeholder="+212 600 000000"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <AuthInput
                    label={t.pages.auth.password}
                    type="password"
                    placeholder="Create a password"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <AuthInput
                    label={t.pages.auth.confirmPass}
                    type="password"
                    placeholder="Confirm your password"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />

                {error && (
                    <p className="text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/20 py-2.5 rounded-xl text-center">
                        {error}
                    </p>
                )}

                <div className="flex items-start gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 rounded border-neutral-300 text-primary focus:ring-primary"
                        required
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                        {t.pages.auth.agreeTerms}{" "}
                        <Link href="/terms" className="underline hover:text-foreground">
                            {t.pages.auth.terms}
                        </Link>{" "}
                        {t.pages.auth.and}{" "}
                        <Link href="/privacy" className="underline hover:text-foreground">
                            {t.pages.auth.privacy}
                        </Link>
                    </label>
                </div>

                <button
                    disabled={loading}
                    className="w-full bg-white text-black h-12 rounded-xl font-bold hover:bg-neutral-200 transition-all shadow-lg mt-2 cursor-pointer disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? t.pages.auth.creatingAccount : t.pages.auth.createAccount}
                </button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    {t.pages.auth.hasAccount}{" "}
                    <Link href="/login" className="font-bold text-foreground hover:text-primary transition-colors">
                        {t.pages.auth.logInLink}
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
