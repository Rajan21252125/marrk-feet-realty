import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/ui/FloatingActions";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="public-theme font-plus min-h-screen flex flex-col transition-colors duration-300">
            <Header />
            <main className="flex-grow">
                {children}
            </main>
            <Footer />
            <FloatingActions />
        </div>
    );
}
