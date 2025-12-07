import Mission from "@/components/About/Mission";
import Story from "@/components/About/Story";
import Values from "@/components/About/Values";
import Team from "@/components/About/Team";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-background">
            <Mission />
            <Story />
            <Values />
            <Team />
        </main>
    );
}
