"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

interface ConfirmOptions {
    title?: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: "danger" | "warning" | "info";
}

interface ConfirmContextValue {
    confirm: (options: ConfirmOptions) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

interface PendingConfirm {
    options: ConfirmOptions;
    resolve: (value: boolean) => void;
}

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
    const [pending, setPending] = useState<PendingConfirm | null>(null);

    const confirm = useCallback((options: ConfirmOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setPending({ options, resolve });
        });
    }, []);

    const handleConfirm = () => {
        pending?.resolve(true);
        setPending(null);
    };

    const handleCancel = () => {
        pending?.resolve(false);
        setPending(null);
    };

    return (
        <ConfirmContext.Provider value={{ confirm }}>
            {children}
            {pending && (
                <ConfirmModal
                    options={pending.options}
                    onConfirm={handleConfirm}
                    onCancel={handleCancel}
                />
            )}
        </ConfirmContext.Provider>
    );
}

export function useConfirm() {
    const ctx = useContext(ConfirmContext);
    if (!ctx) throw new Error("useConfirm must be used within a ConfirmProvider");
    return ctx.confirm;
}

/* ──────────────────────────────────────────────────── */
/* Internal Modal UI                                    */
/* ──────────────────────────────────────────────────── */

function ConfirmModal({
    options,
    onConfirm,
    onCancel,
}: {
    options: ConfirmOptions;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const { title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", variant = "danger" } = options;

    const confirmClasses = {
        danger: "bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-500/20",
        warning: "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20",
        info: "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-500/20",
    };

    const iconBgClasses = {
        danger: "bg-rose-100 dark:bg-rose-900/30 text-rose-600",
        warning: "bg-amber-100 dark:bg-amber-900/30 text-amber-600",
        info: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
    };

    const icons = {
        danger: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
        ),
        warning: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
        ),
        info: (
            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
            onClick={(e) => e.target === e.currentTarget && onCancel()}
        >
            <div
                className="bg-white dark:bg-neutral-900 rounded-[2rem] p-8 w-full max-w-sm shadow-2xl border border-neutral-100 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-200"
                role="alertdialog"
                aria-modal="true"
            >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${iconBgClasses[variant]} flex items-center justify-center mx-auto mb-6`}>
                    {icons[variant]}
                </div>

                {/* Content */}
                <div className="text-center mb-8">
                    {title && <h3 className="text-xl font-black mb-2 text-foreground">{title}</h3>}
                    <p className="text-muted-foreground text-sm leading-relaxed">{message}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 rounded-2xl font-bold text-sm border border-neutral-200 dark:border-neutral-700 text-muted-foreground hover:bg-neutral-50 dark:hover:bg-white/5 transition-all"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-[1.5] py-3 rounded-2xl font-bold text-sm transition-all ${confirmClasses[variant]}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}
