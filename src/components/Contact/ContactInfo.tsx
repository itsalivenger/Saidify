import { useState, useEffect } from "react";
import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Linkedin, Loader2 } from "lucide-react";

export default function ContactInfo() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    // Helper to check if a link is valid (not empty and not just whitespace)
    const isValidLink = (link: any) => {
        const valid = typeof link === 'string' && link.trim().length > 0;
        return valid;
    };

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
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    useEffect(() => {
        if (settings) {
            console.log("ContactInfo settings loaded:", {
                hasMainSettings: !!settings.mainSettings,
                hasSocialLinks: !!settings.mainSettings?.socialLinks,
                socials: settings.mainSettings?.socialLinks
            });
            alert("Socials data: " + JSON.stringify(settings.mainSettings?.socialLinks, null, 2));
        }
    }, [settings]);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const info = settings?.mainSettings || {};
    const socials = info.socialLinks || {};

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
                            <p className="text-muted-foreground">{info.contactEmail || 'support@pentabrood.com'}</p>
                            <p className="text-sm text-muted-foreground">Response within 24 hours</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 dark:bg-emerald-900/20 dark:text-emerald-400">
                            <Phone className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Call Us</h4>
                            <p className="text-muted-foreground">{info.contactPhone || '+1 (555) 123-4567'}</p>
                            <p className="text-sm text-muted-foreground">Mon-Fri from 9am to 6pm EST</p>
                        </div>
                    </div>

                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0 dark:bg-amber-900/20 dark:text-amber-400">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                            <h4 className="font-bold text-foreground">Visit Us</h4>
                            <p className="text-muted-foreground whitespace-pre-line">{info.address || '123 Fashion Avenue\nNew York, NY 10018'}</p>
                        </div>
                    </div>
                </div>
            </div>

            {(isValidLink(socials.facebook) || isValidLink(socials.instagram) || isValidLink(socials.twitter) || isValidLink(socials.linkedin)) && (
                <div>
                    <h4 className="font-bold mb-4">Follow Us</h4>
                    <div className="flex gap-4">
                        {isValidLink(socials.facebook) && (
                            <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400">
                                <Facebook className="w-5 h-5" />
                            </a>
                        )}
                        {isValidLink(socials.twitter) && (
                            <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400">
                                <Twitter className="w-5 h-5" />
                            </a>
                        )}
                        {isValidLink(socials.instagram) && (
                            <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400">
                                <Instagram className="w-5 h-5" />
                            </a>
                        )}
                        {isValidLink(socials.linkedin) && (
                            <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center hover:bg-neutral-200 transition-colors text-neutral-600 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400">
                                <Linkedin className="w-5 h-5" />
                            </a>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
