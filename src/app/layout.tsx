import type { Metadata } from "next";
import LogoImage from "@/public/logo-dark-var2.png";
import ".//globals.css";
import { Providers } from "./providers";
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
      <body className="text-[#2D1A22] font-sans antialiased min-h-screen selection:bg-[#FFB5BD] selection:text-[#2D1A22] p-1.5 sm:p-4 lg:p-10 flex justify-center items-start">
        <Providers>
          {/* Main Floating Glassmorphic Container */}
          <div className="w-4/5 mx-auto outer-glass-container flex flex-col overflow-hidden">
            {/* Header / Navbar Section */}
            <div className="flex justify-center w-full p-2 sm:p-4 lg:p-6 border-transparent z-50">
              <Navbar />
            </div>

            {/* Main Page Content */}
            <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-3 sm:py-6">
              {children}
            </main>

            {/* Footer Section */}
            <footer className="border-t border-[#FFB5BD]/30 bg-[#FFEEEE]/40 backdrop-blur-md py-8 text-[#2D1A22]/50 text-xs text-center align-middle flex flex-col gap-2">
              <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="font-display tracking-widest text-[#B32F4E] font-medium text-sm">
                  Tela&Tulle © 2026
                </span>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
