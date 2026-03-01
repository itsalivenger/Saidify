'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, translations, TranslationDictionary } from '@/lib/translations';

interface LanguageContextType {
    language: LanguageCode;
    setLanguage: (lang: LanguageCode) => void;
    t: TranslationDictionary;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguageState] = useState<LanguageCode>(() => {
        if (typeof window !== 'undefined') {
            const storedLang = localStorage.getItem('site_lang') as LanguageCode;
            if (storedLang && ['en', 'fr', 'ar'].includes(storedLang)) {
                return storedLang;
            }
            const browserLang = navigator.language.split('-')[0];
            if (browserLang === 'fr' || browserLang === 'ar') {
                return browserLang as LanguageCode;
            }
        }
        return 'en';
    });
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMounted(true);
    }, []);

    const setLanguage = (lang: LanguageCode) => {
        setLanguageState(lang);
        localStorage.setItem('site_lang', lang);
    };

    const dir = language === 'ar' ? 'rtl' : 'ltr';

    // Update HTML dir attribute for global RTL support
    useEffect(() => {
        if (mounted) {
            document.documentElement.dir = dir;
            document.documentElement.lang = language;
        }
    }, [language, dir, mounted]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t: translations[language], dir }}>
            <div style={{ visibility: mounted ? 'visible' : 'hidden' }}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
