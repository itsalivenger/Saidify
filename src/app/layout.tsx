import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import connectToDatabase from "@/lib/db";
import SiteSettings from "@/models/SiteSettings";

export async function generateMetadata() {
  await connectToDatabase();
  const settings = await SiteSettings.findOne();
  const siteName = settings?.mainSettings?.siteName || "Said Store";

  return {
    title: {
      default: siteName,
      template: `%s | ${siteName}`,
    },
    description: settings?.homepage?.hero?.subtitle || "Your premium shopping destination",
  };
}



import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import { AuthProvider } from "@/context/AuthContext";
import { ConfirmProvider } from "@/context/ConfirmContext";
import { LanguageProvider } from "@/context/LanguageContext";
import WhatsAppButton from "@/components/Common/WhatsAppButton";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LanguageProvider>
          <AuthProvider>
            <ConfirmProvider>
              <CartProvider>
                <WishlistProvider>
                  <ConditionalLayout>{children}</ConditionalLayout>
                  <WhatsAppButton />
                </WishlistProvider>
              </CartProvider>
            </ConfirmProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
