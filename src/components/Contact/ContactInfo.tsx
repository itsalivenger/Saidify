"use client";

import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

export default function ContactInfo() {
    return (
        <div className="space-y-10">
            <div>
                <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
                <p className="text-muted-foreground mb-8 text-lg">
                    Have a question about your order? Need help with sizing? Our team is always ready to assist you.
                </p>

                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 dark:bg-blue-900/20 dark:text-blue-400">
                            <Mail className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Email Us</h4>
                            <p className="text-muted-foreground">support@pentabrood.com</p>
                            <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Call Us</h4>
                            <p className="text-muted-foreground">+1 (555) 123-4567</p>
                            <p className="text-sm text-muted-foreground">Mon-Fri from 9am to 6pm EST</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 dark:bg-amber-900/20 dark:text-amber-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Visit Us</h4>
                            <p className="text-muted-foreground">123 Fashion Avenue</p>
                            <p className="text-muted-foreground">New York, NY 10018</p>
                        </div>
                    </div>
                </div>
            </div>

            <div>
                <h4 className="font-bold mb-4">Follow Us</h4>
                <div className="flex gap-4">
                    <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400">
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400">
                        <Instagram className="w-5 h-5" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400">
                        <Linkedin className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </div>
    );
}
