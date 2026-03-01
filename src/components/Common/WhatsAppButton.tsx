'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function WhatsAppButton() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const pathname = usePathname();

    const isAdminPage = pathname?.startsWith('/admin');

    useEffect(() => {
        if (isAdminPage) return;

        const fetchSettings = async () => {
            try {
                console.log('[WhatsApp] Fetching settings...');
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    const phone = data.mainSettings?.whatsappNumber;
                    console.log('[WhatsApp] Raw number from settings:', phone);
                    if (phone && phone.trim() !== '') {
                        const cleanPhone = phone
                            .replace(/\s+/g, '')
                            .replace(/[()]/g, '')
                            .replace(/^\+/, '');
                        console.log('[WhatsApp] Cleaned phone:', cleanPhone, '— button WILL show');
                        setPhoneNumber(cleanPhone);
                    } else {
                        console.warn('[WhatsApp] No phone number set in admin settings — button hidden. Go to Admin → Website Control → General Settings → WhatsApp Number.');
                    }
                } else {
                    console.error('[WhatsApp] Failed to fetch settings, status:', res.status);
                }
            } catch (error) {
                console.error('[WhatsApp] Error fetching settings:', error);
            }
        };

        fetchSettings();
    }, [isAdminPage]);

    if (!phoneNumber || isAdminPage) return null;

    return (
        <motion.a
            initial={{ scale: 0, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay: 0.5, type: 'spring', stiffness: 200, damping: 16 }}
            href={`https://wa.me/${phoneNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-8 right-8 z-[9999] flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_8px_32px_rgba(37,211,102,0.5)] hover:scale-110 active:scale-90 transition-transform group"
            title="Contact us on WhatsApp"
        >
            {/* Official WhatsApp SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-9 h-9 fill-white">
                <path d="M16 0C7.163 0 0 7.163 0 16c0 2.827.74 5.478 2.031 7.785L0 32l8.432-2.007A15.93 15.93 0 0 0 16 32c8.837 0 16-7.163 16-16S24.837 0 16 0zm8.07 22.38c-.343.963-2.01 1.838-2.764 1.955-.707.11-1.603.156-2.585-.163a23.6 23.6 0 0 1-2.342-.87C12.82 21.71 10.1 18.76 9.3 17.68c-.8-1.08-1.69-2.87-1.69-4.73 0-1.87.98-2.78 1.33-3.16.35-.38.76-.47 1.01-.47.25 0 .5.002.72.014.23.012.54-.088.85.65.31.74 1.05 2.56 1.14 2.74.09.18.15.4.03.64-.12.24-.18.39-.36.6-.18.21-.38.47-.54.63-.18.18-.37.38-.16.74.21.37.93 1.53 2 2.47 1.37 1.22 2.53 1.6 2.9 1.78.36.18.57.15.78-.09.21-.24.9-.97 1.14-1.3.24-.33.48-.27.81-.16.33.11 2.1 1 2.46 1.18.36.18.6.27.69.42.09.15.09.88-.25 1.74z" />
            </svg>

            {/* Tooltip */}
            <div className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-neutral-100 hidden md:block">
                Chat with us
                <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45 border-r border-t border-neutral-100" />
            </div>

            {/* Pulse ring */}
            <span className="absolute inline-flex w-full h-full rounded-full bg-[#25D366] opacity-40 animate-ping" />
        </motion.a>
    );
}
