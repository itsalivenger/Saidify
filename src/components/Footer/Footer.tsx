import { useState, useEffect } from "react";
import { Facebook, Instagram, Twitter, Youtube, CreditCard, Mail, MapPin, Phone, Linkedin } from "lucide-react";
import Link from "next/link";

export default function Footer() {
    const [settings, setSettings] = useState<any>(null);

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
    const isValidLink = (link: any) => typeof link === 'string' && link.trim() !== '';

    return (
        <footer className="bg-neutral-900 text-neutral-300 py-16">
            <div className="w-full px-4 md:px-8 max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        {info.logo ? (
                            <img src={info.logo} alt={info.siteName} className="h-10 w-auto object-contain brightness-0 invert" />
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
                        <h4 className="text-white font-bold mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="/shop" className="hover:text-white transition-colors">Best Sellers</Link></li>
                            <li><Link href="/design" className="hover:text-white transition-colors">Design Studio</Link></li>
                            <li><Link href="/categories" className="hover:text-white transition-colors">Categories</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Sustainability</Link></li>
                        </ul>
                    </div>

                    {/* Support Column - Moved to 4th column to balance layout since Newsletter is gone */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Order Status</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Returns & Exchanges</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Shipping Info</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-neutral-500">
                        &copy; {new Date().getFullYear()} {info.siteName || "Said Store"}. All rights reserved.
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
