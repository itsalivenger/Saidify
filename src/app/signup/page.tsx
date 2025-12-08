"use client";

import Link from "next/link";
import AuthLayout from "@/components/Auth/AuthLayout";
import AuthInput from "@/components/Auth/AuthInput";

export default function SignupPage() {
    return (
        <AuthLayout
            title="Create an account"
            subtitle="Join thousands of others and start your journey"
            image="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2670&auto=format&fit=crop"
        >
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-2 gap-4">
                    <AuthInput
                        label="First Name"
                        type="text"
                        placeholder="John"
                        required
                    />
                    <AuthInput
                        label="Last Name"
                        type="text"
                        placeholder="Doe"
                        required
                    />
                </div>
                <AuthInput
                    label="Email"
                    type="email"
                    placeholder="name@example.com"
                    required
                />
                <AuthInput
                    label="Password"
                    type="password"
                    placeholder="Create a password"
                    required
                />
                <AuthInput
                    label="Confirm Password"
                    type="password"
                    placeholder="Confirm your password"
                    required
                />

                <div className="flex items-start gap-2 mt-2">
                    <input
                        type="checkbox"
                        id="terms"
                        className="mt-1 rounded border-neutral-300 text-primary focus:ring-primary"
                        required
                    />
                    <label htmlFor="terms" className="text-sm text-muted-foreground">
                        I agree to the{" "}
                        <Link href="/terms" className="underline hover:text-foreground">
                            Terms of Service
                        </Link>{" "}
                        and{" "}
                        <Link href="/privacy" className="underline hover:text-foreground">
                            Privacy Policy
                        </Link>
                    </label>
                </div>

                <button className="w-full bg-primary text-primary-foreground h-12 rounded-lg font-bold hover:brightness-110 transition-all shadow-lg shadow-primary/20 mt-2">
                    Create Account
                </button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                    Already have an account?{" "}
                    <Link href="/login" className="font-bold text-foreground hover:text-primary transition-colors">
                        Log in
                    </Link>
                </p>
            </form>
        </AuthLayout>
    );
}
