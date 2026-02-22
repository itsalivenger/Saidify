"use client";

import { useEffect, useState } from "react";
import Mission from "@/components/About/Mission";
import Story from "@/components/About/Story";
import Values from "@/components/About/Values";
import Team from "@/components/About/Team";
import { Loader2 } from "lucide-react";

export default function AboutPage() {
    const [aboutData, setAboutData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setAboutData(data.aboutPage);
                }
            } catch (error) {
                console.error("Error loading about page data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600" />
            </div>
        );
    }

    if (!aboutData) return null;

    return (
        <main className="min-h-screen bg-background">
            <div id="mission"><Mission data={aboutData.mission} /></div>
            <Story data={aboutData.story} />
            <div id="values"><Values data={aboutData.values} /></div>
            <Team data={aboutData.team} />
        </main>
    );
}
