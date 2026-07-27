"use client";

import React from "react";
import Image from "next/image";
import { InventoryItem } from "@/types/database";
import { Calendar, Tag, ShieldCheck, Sparkles } from "lucide-react";

interface DressCardProps {
  dress: InventoryItem;
  onSelect: (dress: InventoryItem) => void;
}

export function DressCard({ dress, onSelect }: DressCardProps) {
  const primaryImage =
    dress.image_urls[0] ||
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80";

  return (
    <div
      onClick={() => onSelect(dress)}
      className="group relative bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl overflow-hidden shadow-glass hover:shadow-rose-glow hover:border-[#FFB5BD]/70 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Image Banner */}
      <div className="relative aspect-[3/4] w-full bg-[#FFD6DA]/30 overflow-hidden">
        <Image
          src={primaryImage}
          alt={dress.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#FFEEEE]/80 via-transparent to-transparent" />

        {/* Top Badges — left: size + color, right: valued price, no overlap */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2 z-10">
          {/* Left: Size + Color */}
          <div className="flex flex-wrap gap-1 min-w-0">
            <span className="shrink-0 bg-white/75 backdrop-blur-md text-[#2D1A22] text-xs font-semibold px-2.5 py-1 rounded-full border border-white/60 shadow-sm whitespace-nowrap">
              Size {dress.size}
            </span>
            <span className="min-w-0 bg-[#B32F4E]/10 backdrop-blur-md text-[#B32F4E] text-xs font-medium px-2.5 py-1 rounded-full border border-[#B32F4E]/25 truncate max-w-[120px]">
              {dress.color}
            </span>
          </div>

          {/* Right: Retail Price */}
          <span className="shrink-0 bg-white/70 backdrop-blur-md text-[#2D1A22]/70 text-[11px] px-2.5 py-1 rounded-full border border-white/60 shadow-sm whitespace-nowrap">
            Valued ₱{dress.retail_price.toLocaleString()}
          </span>
        </div>

        {/* Quick Tags overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
          {dress.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="bg-white/60 text-[#2D1A22]/70 text-[10px] px-2 py-0.5 rounded backdrop-blur-sm border border-white/40"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-3 sm:p-5 flex-1 flex flex-col justify-between space-y-3 sm:space-y-4">
        <div>
          <h3 className="font-display text-sm sm:text-lg font-bold text-[#B32F4E] group-hover:text-[#8D2040] transition line-clamp-1">
            {dress.name}
          </h3>
          <p className="text-[#2D1A22]/60 text-[10px] sm:text-xs mt-1 sm:mt-1.5 line-clamp-2 leading-relaxed hidden sm:block">
            {dress.description}
          </p>
        </div>

        {/* Pricing Block */}
        <div className="pt-2 sm:pt-3 border-t border-[#FFB5BD]/40 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-wider text-[#B32F4E] font-semibold block">
              2-Day Rental
            </span>
            <span className="font-sans text-base sm:text-xl font-bold text-[#2D1A22]">
              ₱{dress.base_rental_price}
            </span>
            <span className="text-[#2D1A22]/50 text-[9px] sm:text-xs ml-0.5 hidden sm:inline">
              +₱{dress.extension_rate_daily}/extra day
            </span>
          </div>

          <button className="bg-[#B32F4E] hover:bg-[#8D2040] text-white px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg sm:rounded-xl text-[10px] sm:text-xs font-semibold flex items-center justify-center gap-1 sm:gap-1.5 transition shadow-wine-glow border border-[#B32F4E]/50 w-full sm:w-auto">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Check Dates</span>
          </button>
        </div>
      </div>
    </div>
  );
}
