"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import {
  Sparkles,
  ShoppingBag,
  HeartHandshake,
  ShieldCheck,
  Star,
  ArrowRight,
  Gem,
  Recycle,
  Clock3,
  ChevronRight,
} from "lucide-react";

const HOW_IT_WORKS = [
  {
    step: "01",
    icon: ShoppingBag,
    title: "Browse the Catalog",
    description:
      "Explore our curated collection of haute couture gowns. Filter by size, color, measurements, and occasion tags to find your perfect match.",
    color: "#B32F4E",
    bg: "rgba(179, 47, 78, 0.07)",
    border: "rgba(179, 47, 78, 0.2)",
  },
  {
    step: "02",
    icon: Clock3,
    title: "Choose Your Dates",
    description:
      "Select your rental window. Our 2-day baseline rate keeps it affordable — extend day-by-day if you need more time for travel or multi-day events.",
    color: "#8D9A2E",
    bg: "rgba(141, 154, 46, 0.07)",
    border: "rgba(141, 154, 46, 0.2)",
  },
  {
    step: "03",
    icon: Gem,
    title: "Wear & Shine",
    description:
      "Receive the gown, dazzle at your event, and return it stress-free. A refundable security deposit protects both you and our consignors.",
    color: "#B32F4E",
    bg: "rgba(179, 47, 78, 0.07)",
    border: "rgba(179, 47, 78, 0.2)",
  },
];

const TRUST_PILLARS = [
  {
    icon: ShieldCheck,
    title: "Secure & Transparent",
    body: "Every booking is backed by a refundable security deposit and clear, itemized pricing — no hidden charges.",
    color: "#B32F4E",
  },
  {
    icon: Recycle,
    title: "Circular Fashion",
    body: "Renting instead of buying reduces waste and keeps high-fashion accessible. Style sustainably.",
    color: "#8D9A2E",
  },
  {
    icon: HeartHandshake,
    title: "Consignor Partnership",
    body: "Independent designers and collectors earn 50% commission on every rental. Your wardrobe works for you.",
    color: "#B32F4E",
  },
  {
    icon: Star,
    title: "Curated Quality",
    body: "Every piece is hand-selected, inspected, and photographed. Only the finest eveningwear makes it to our catalog.",
    color: "#8D9A2E",
  },
];

export default function HomePage() {
  const { inventory } = useAppStore();

  // Show up to 6 active featured gowns
  const featuredGowns = inventory
    .filter((i) => i.status === "active")
    .slice(0, 6);

  return (
    <div className="space-y-16 pb-20">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#E0AEBA] via-[#D17484] to-[#8B263E] border border-white/10 p-10 sm:p-16 shadow-glass min-h-[480px] flex items-center">
        {/* Decorative blobs */}
        <div className="absolute -right-16 -top-16 w-[500px] h-[500px] bg-[#B32F4E]/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-[400px] h-[400px] bg-[#8D9A2E]/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMwLTkuOTQtOC4wNi0xOC0xOC0xOFYwaDQydjQySDM2VjE4eiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMDIiLz48L2c+PC9zdmc+')] opacity-30 pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B263E]/80 border border-[#B32F4E]/30 text-xs text-[#FFB5BD] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Sustainable, Accessible, and Affordable Style
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight">
            Wear the Dream.{" "}
            <span className="text-[#f4f7cd]">Not the Price Tag.</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed font-sans max-w-2xl">
            Rent iconic designer gowns for galas, red carpet events, weddings,
            and editorial shoots. Returned, refreshed, and ready to shine again.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-[#B32F4E] hover:bg-[#8D2040] text-white px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-wine-glow hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/lend-with-us"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/20 px-7 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <HeartHandshake className="w-4 h-4" />
              Lend With Us
            </Link>
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-8 pt-4 border-t border-white/10">
            {[
              { num: `${inventory.filter((i) => i.status === "active").length}+`, label: "Available Pieces" },
              { num: "50%", label: "Consignor Commission" },
              { num: "2-Day", label: "Base Rental Rate" },
            ].map(({ num, label }) => (
              <div key={label} className="space-y-0.5">
                <div className="text-2xl font-display font-bold text-white/70">{num}</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Gowns Preview ── */}
      {featuredGowns.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#B32F4E]">
                Currently Available
              </h2>
              <p className="text-sm text-[#2D1A22]/50 mt-1">
                A glimpse of our active collection — {inventory.filter((i) => i.status === "active").length} gowns ready to rent
              </p>
            </div>
            <Link
              href="/catalog"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#B32F4E] hover:text-[#8D2040] transition group"
            >
              View All
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {featuredGowns.map((gown) => (
              <Link
                key={gown.id}
                href="/catalog"
                className="group relative bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-glass hover:shadow-rose-glow hover:-translate-y-1 transition-all duration-300"
              >
                {/* Image placeholder / gradient if no image */}
                <div className="relative h-48 sm:h-60 bg-gradient-to-br from-[#FFD6DA] to-[#F4F7CD] overflow-hidden">
                  {gown.image_urls && gown.image_urls.length > 0 ? (
                    <img
                      src={gown.image_urls[0]}
                      alt={gown.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-[#B32F4E]/30">
                      <Sparkles className="w-8 h-8" />
                      <span className="text-xs font-medium text-[#B32F4E]/40">
                        {gown.color} {gown.size}
                      </span>
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-[#B32F4E]/0 group-hover:bg-[#B32F4E]/10 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <span className="bg-white/90 text-[#B32F4E] text-xs font-semibold px-3 py-1.5 rounded-full shadow">
                      View Details
                    </span>
                  </div>
                </div>

                <div className="p-4 space-y-1.5">
                  <div className="font-display font-bold text-sm text-[#B32F4E] truncate">
                    {gown.name}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-[#2D1A22]/50">
                      {gown.color} · Size {gown.size}
                    </span>
                    <span className="text-xs font-bold text-[#8D9A2E]">
                      ₱{gown.base_rental_price}
                      <span className="font-normal text-[#2D1A22]/40">/2 days</span>
                    </span>
                  </div>
                  {gown.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {gown.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-[#B32F4E]/08 text-[#B32F4E]/60 border border-[#B32F4E]/15"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center sm:hidden">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#B32F4E] hover:text-[#8D2040] transition"
            >
              View Full Catalog <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      )}

      {/* ── How It Works ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          {/* <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8D9A2E]/10 border border-[#8D9A2E]/25 text-xs text-[#8D9A2E] font-semibold uppercase tracking-widest">
            <Gem className="w-3.5 h-3.5" /> Simple Process
          </div> */}
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#B32F4E]">
            How Tela & Tulle Works
          </h2>
          <p className="text-[#2D1A22]/50 text-sm max-w-xl mx-auto leading-relaxed">
            Renting a designer gown should be as glamorous as wearing one. We
            keep the process seamless from browse to return.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {HOW_IT_WORKS.map(
            ({ step, icon: Icon, title, description, color, bg, border }) => (
              <div
                key={step}
                className="relative bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-3xl p-6 shadow-glass hover:shadow-rose-glow hover:-translate-y-1 transition-all duration-300 overflow-hidden group"
              >
                <div
                  className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20 blur-xl transition-all duration-300 group-hover:opacity-40"
                  style={{ background: color }}
                />
                <div
                  className="text-4xl font-display font-black mb-4 opacity-15"
                  style={{ color }}
                >
                  {step}
                </div>
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border"
                  style={{ background: bg, borderColor: border }}
                >
                  <Icon className="w-6 h-6" style={{ color }} />
                </div>
                <h3 className="font-display font-bold text-lg text-[#2D1A22] mb-2">
                  {title}
                </h3>
                <p className="text-xs text-[#2D1A22]/55 leading-relaxed font-sans">
                  {description}
                </p>
              </div>
            )
          )}
        </div>
      </section>

      {/* ── Trust Pillars ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#B32F4E]">
            Why Tela & Tulle?
          </h2>
          <p className="text-[#2D1A22]/50 text-sm max-w-xl mx-auto">
            Fashion that gives back — to you, to designers, and to the planet.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {TRUST_PILLARS.map(({ icon: Icon, title, body, color }) => (
            <div
              key={title}
              className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass flex items-start gap-5 hover:shadow-soft hover:-translate-y-0.5 transition-all duration-200 group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border transition-all duration-200 group-hover:scale-110"
                style={{
                  background: `${color}12`,
                  borderColor: `${color}30`,
                }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className="space-y-1">
                <h3 className="font-display font-bold text-[#2D1A22] text-base">
                  {title}
                </h3>
                <p className="text-xs text-[#2D1A22]/55 leading-relaxed">
                  {body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Final CTA Banner ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#B32F4E] via-[#9B2840] to-[#8D2040] border border-[#FFB5BD]/20 p-10 sm:p-14 text-center shadow-wine-glow">
        <div className="absolute -left-20 -bottom-20 w-72 h-72 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-10 -top-10 w-48 h-48 bg-[#FFB5BD]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-5 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 border border-white/20 text-xs text-white font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Ready to Rent?
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-white">
            Your Next Statement Look Awaits
          </h2>
          <p className="text-white/65 text-sm leading-relaxed">
            Browse dozens of curated gowns and find your perfect fit — for a
            fraction of the retail price.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-white text-[#B32F4E] hover:bg-[#FFEEEE] px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore Catalog
            </Link>
            <Link
              href="/lend-with-us"
              className="inline-flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white border border-white/30 px-8 py-3.5 rounded-2xl font-semibold text-sm transition-all hover:-translate-y-0.5"
            >
              <HeartHandshake className="w-4 h-4" />
              Become a Lender
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
