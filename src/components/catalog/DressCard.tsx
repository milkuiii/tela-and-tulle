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

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-white/75 backdrop-blur-md text-[#2D1A22] text-xs font-semibold px-2.5 py-1 rounded-full border border-white/60 shadow-sm">
            Size {dress.size}
          </span>
          <span className="bg-[#B32F4E]/10 backdrop-blur-md text-[#B32F4E] text-xs font-medium px-2.5 py-1 rounded-full border border-[#B32F4E]/25">
            {dress.color}
          </span>
        </div>

        {/* Retail Price Tag */}
        <div className="absolute top-3 right-3 bg-white/70 backdrop-blur-md text-[#2D1A22]/70 text-[11px] px-2.5 py-1 rounded-full border border-white/60 shadow-sm">
          Valued ₱{dress.retail_price.toLocaleString()}
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
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-display text-lg font-bold text-[#B32F4E] group-hover:text-[#8D2040] transition line-clamp-1">
            {dress.name}
          </h3>
          <p className="text-[#2D1A22]/60 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {dress.description}
          </p>
        </div>

        {/* Pricing Block */}
        <div className="pt-3 border-t border-[#FFB5BD]/40 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[#B32F4E] font-semibold block">
              2-Day Rental
            </span>
            <span className="font-sans text-xl font-bold text-[#2D1A22]">
              ₱{dress.base_rental_price}
            </span>
            <span className="text-[#2D1A22]/50 text-xs ml-1">
              +₱{dress.extension_rate_daily}/extra day
            </span>
          </div>

          <button className="bg-[#B32F4E] hover:bg-[#8D2040] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shadow-wine-glow border border-[#B32F4E]/50">
            <Calendar className="w-3.5 h-3.5" />
            <span>Check Dates</span>
          </button>
        </div>
      </div>
    </div>
  );
}
