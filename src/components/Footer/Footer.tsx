"use client";

import { Facebook, Instagram, Twitter, Youtube, CreditCard } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-neutral-300 py-16">
            <div className="w-full px-4 md:px-8 max-w-[1800px] mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <h3 className="text-2xl font-black text-white tracking-tighter">PENTABROOD</h3>
                        <p className="text-neutral-400 max-w-sm">
                            Your premium destination for contemporary fashion and lifestyle essentials.
                        </p>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Instagram className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Twitter className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Facebook className="w-5 h-5 text-white" />
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/20 transition-colors">
                                <Youtube className="w-5 h-5 text-white" />
                            </a>
                        </div>
                    </div>

                    {/* Shop Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Shop</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Men</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Women</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Accessories</a></li>
                        </ul>
                    </div>

                    {/* Support Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Support</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Order Status</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Company Column */}
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-neutral-500">
                        &copy; {new Date().getFullYear()} Pentabrood. All rights reserved.
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
