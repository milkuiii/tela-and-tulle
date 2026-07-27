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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Alegreya SC — Display / Heading Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Alegreya+SC:ital,wght@0,400;0,500;0,700;0,800;0,900;1,400;1,500;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#FFEEEE] text-[#2D1A22] font-sans antialiased min-h-screen flex flex-col selection:bg-[#FFB5BD] selection:text-[#2D1A22]">
        <AppProvider>
          <div className="flex justify-center w-full p-[10px] overflow-hidden border-transparent">
            <Navbar />
          </div>
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
            {children}
          </main>
          <footer className="border-t border-[#FFB5BD]/40 bg-[#FFEEEE]/80 backdrop-blur-md py-8 text-[#2D1A22]/50 text-xs text-center">
            <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="font-display tracking-widest text-[#B32F4E] font-semibold text-sm">
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
