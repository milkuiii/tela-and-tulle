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
      className="group relative bg-[#1C191E] border border-[#2E2A32] rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:border-rose-800/60 transition-all duration-300 cursor-pointer flex flex-col justify-between"
    >
      {/* Image Banner */}
      <div className="relative aspect-[3/4] w-full bg-[#121013] overflow-hidden">
        <Image
          src={primaryImage}
          alt={dress.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1C191E] via-transparent to-black/30" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          <span className="bg-black/70 backdrop-blur-md text-white text-xs font-semibold px-2.5 py-1 rounded-full border border-white/10 shadow-sm">
            Size {dress.size}
          </span>
          <span className="bg-rose-950/80 backdrop-blur-md text-rose-200 text-xs font-medium px-2.5 py-1 rounded-full border border-rose-800/50">
            {dress.color}
          </span>
        </div>

        {/* Retail Price Tag */}
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-md text-neutral-300 text-[11px] px-2.5 py-1 rounded-full border border-white/10">
          Valued ₱{dress.retail_price.toLocaleString()}
        </div>

        {/* Quick Tags overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-1">
          {dress.tags.slice(0, 3).map((t) => (
            <span
              key={t}
              className="bg-black/60 text-neutral-300 text-[10px] px-2 py-0.5 rounded backdrop-blur-sm"
            >
              #{t}
            </span>
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 text-white">
        <div>
          <h3 className="font-sans text-lg font-bold text-rose-100 group-hover:text-rose-300 transition line-clamp-1">
            {dress.name}
          </h3>
          <p className="text-neutral-400 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {dress.description}
          </p>
        </div>

        {/* Pricing Block */}
        <div className="pt-3 border-t border-[#2E2A32] flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-rose-400 font-semibold block">
              2-Day Rental
            </span>
            <span className="font-sans text-xl font-bold text-white">
              ₱{dress.base_rental_price}
            </span>
            <span className="text-neutral-400 text-xs ml-1">
              +₱{dress.extension_rate_daily}/extra day
            </span>
          </div>

          <button className="bg-rose-900/80 hover:bg-rose-800 text-rose-100 px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border border-rose-700/50 shadow-md">
            <Calendar className="w-3.5 h-3.5 text-rose-300" />
            <span>Check Dates</span>
          </button>
        </div>
      </div>
    </div>
  );
}
