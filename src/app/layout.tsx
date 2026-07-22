import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/lib/store";
import { Navbar } from "@/components/layout/Navbar";

export const metadata: Metadata = {
  title: "Tela & Tulle | High-Fashion Dress Rental & Consignment Platform",
  description:
    "Full-stack luxury dress rental web application with dynamic pricing, measurement filtering, automated commission snapshotting, and consignor payout ledger.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#121013] text-foreground font-sans antialiased min-h-screen selection:bg-rose-900 selection:text-white flex flex-col">
        <AppProvider>
          <div className="flex justify-center w-full p-[10px] overflow-hidden border-transparent">
            <Navbar />
          </div>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {children}
          </main>
          <footer className="border-t border-[#2E2A32] bg-[#1C191E] py-8 text-neutral-400 text-xs text-center">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-sans tracking-widest text-rose-200 font-semibold">
                TELA & TULLE © 2026
              </span>
              <span>
                Built with Next.js, TypeScript, Tailwind CSS, & Supabase
              </span>
            </div>
          </footer>
        </AppProvider>
      </body>
    </html>
  );
}
