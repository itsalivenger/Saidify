'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function WhatsAppButton() {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        fetchSettings();

        const handleScroll = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings');
            if (res.ok) {
                const data = await res.json();
                // Assumes settings.mainSettings.contactPhone is the correct field
                // Based on previous research in WebsiteControlPage
                const phone = data.mainSettings?.contactPhone;
                if (phone) {
                    // Clean phone number (remove spaces, etc. for WhatsApp link)
                    const cleanPhone = phone.replace(/\s+/g, '').replace(/[()]/g, '');
                    setPhoneNumber(cleanPhone);
                }
            }
        } catch (error) {
            console.error('Error fetching WhatsApp settings:', error);
        }
    };

    if (!phoneNumber) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.a
                    initial={{ scale: 0, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0, opacity: 0, y: 20 }}
                    href={`https://wa.me/${phoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="fixed bottom-8 left-8 z-[9999] flex items-center justify-center w-16 h-16 bg-[#25D366] text-white rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 active:scale-90 transition-all group"
                    title="Contact us on WhatsApp"
                >
                    <MessageCircle className="w-8 h-8 fill-current" />

                    {/* Tooltip */}
                    <div className="absolute right-full mr-4 bg-white text-black px-4 py-2 rounded-xl font-bold text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl border border-neutral-100 hidden md:block">
                        Chat with us
                        <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-white rotate-45" />
                    </div>
                </motion.a>
            )}
        </AnimatePresence>
    );
}
