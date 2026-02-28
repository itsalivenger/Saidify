import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, CreditCard, Linkedin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";

interface SiteSettings {
    mainSettings?: {
        logo?: string;
        siteName?: string;
        socialLinks?: {
            instagram?: string;
            twitter?: string;
            facebook?: string;
            linkedin?: string;
        };
    };
    homepage?: {
        hero?: {
            subtitle?: string;
        };
    };
}

export default function Footer() {
    const { t } = useLanguage();
    const [settings, setSettings] = useState<SiteSettings | null>(null);

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

    const info = settings?.mainSettings || {};
    const socials = info.socialLinks || {};

    // Helper to check if a link is valid (not empty and not just whitespace)
    const isValidLink = (link?: string) => typeof link === 'string' && link.trim() !== '';

    return (
        <footer className="bg-neutral-900 text-neutral-300 py-16">
            <div className="w-full px-4 md:px-8 max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        {info.logo ? (
                            <img src={info.logo} alt={info.siteName} className="h-12 w-auto object-contain brightness-0 invert" />
                        ) : (
                            <h3 className="text-2xl font-black text-white tracking-tighter uppercase">{info.siteName || "Said Store"}</h3>
                        )}
                        <p className="text-neutral-400 max-w-sm">
                            {settings?.homepage?.hero?.subtitle || "Your premium destination for contemporary fashion and lifestyle essentials."}
                        </p>
                        <div className="flex gap-4">
                            {isValidLink(socials.instagram) && (
                                <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Instagram className="w-5 h-5 text-white" />
                                </a>
                            )}
                            {isValidLink(socials.twitter) && (
                                <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Twitter className="w-5 h-5 text-white" />
                                </a>
                            )}
                            {isValidLink(socials.facebook) && (
                                <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Facebook className="w-5 h-5 text-white" />
                                </a>
                            )}
                            {isValidLink(socials.linkedin) && (
                                <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                    <Linkedin className="w-5 h-5 text-white" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">{t.footer.shop}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/shop?sort=Newest Arrivals" className="hover:text-white transition-colors">{t.footer.newArrivals}</Link></li>
                            <li><Link href="/shop?sort=Best Selling" className="hover:text-white transition-colors">{t.footer.bestSellers}</Link></li>
                            <li><Link href="/design" className="hover:text-white transition-colors">{t.footer.designStudio}</Link></li>
                            <li><Link href="/categories" className="hover:text-white transition-colors">{t.footer.categories}</Link></li>
                            <li><Link href="/shop?category=Accessories" className="hover:text-white transition-colors">{t.footer.accessories}</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">{t.footer.company}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/about" className="hover:text-white transition-colors">{t.footer.aboutUs}</Link></li>
                            <li><Link href="/about#values" className="hover:text-white transition-colors">{t.footer.ourValues}</Link></li>
                            <li><Link href="/terms" className="hover:text-white transition-colors">{t.footer.terms}</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">{t.footer.privacy}</Link></li>
                            <li><Link href="/about#mission" className="hover:text-white transition-colors">{t.footer.sustainability}</Link></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">{t.footer.support}</h4>
                        <ul className="space-y-4">
                            <li><Link href="/contact" className="hover:text-white transition-colors">{t.footer.helpCenter}</Link></li>
                            <li><Link href="/profile" className="hover:text-white transition-colors">{t.footer.orderStatus}</Link></li>
                            <li><Link href="/returns" className="hover:text-white transition-colors">{t.footer.returns}</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">{t.footer.shipping}</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">{t.footer.contactUs}</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-neutral-500">
                        &copy; {new Date().getFullYear()} {info.siteName || "Said Store"}. {t.footer.rights}
                    </p>
                    <div className="flex gap-4 opacity-50">
                        <CreditCard className="w-6 h-6" />
                        {/* Add more payment icons if needed */}
                    </div>
                </div>
            </div>
        </footer>
    );
}
