import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function MapEmbed() {
    const [address, setAddress] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setAddress(data.mainSettings?.address || "New York, NY, USA");
                }
            } catch (err) {
                console.error('Error fetching settings', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-[400px] rounded-2xl flex items-center justify-center bg-neutral-100 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const mapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

    return (
        <div className="w-full h-[400px] rounded-2xl overflow-hidden shadow-sm border border-neutral-100 dark:border-neutral-800 bg-neutral-100 relative">
            <iframe
                src={mapSrc}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="grayscale hover:grayscale-0 transition-all duration-700"
            ></iframe>
        </div>
    );
}
