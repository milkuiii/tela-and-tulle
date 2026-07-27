"use client";

import React, { useState, useMemo } from "react";
import { useAppStore } from "@/lib/store";
import { FilterOptions, InventoryItem } from "@/types/database";
import { FilterSidebar } from "@/components/catalog/FilterSidebar";
import { DressCard } from "@/components/catalog/DressCard";
import { DressDetailModal } from "@/components/catalog/DressDetailModal";
import {
  Sparkles,
  SlidersHorizontal,
  PackageSearch,
  ShieldCheck,
  HeartHandshake,
  Layers,
} from "lucide-react";

export default function CatalogPage() {
  const { inventory } = useAppStore();

  const [selectedDress, setSelectedDress] = useState<InventoryItem | null>(
    null,
  );
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    tags: [],
    color: "",
    size: "",
    bustMin: undefined,
    bustMax: undefined,
    waistMin: undefined,
    waistMax: undefined,
    hipMin: undefined,
    hipMax: undefined,
    lengthMin: undefined,
    lengthMax: undefined,
  });

  // Extract metadata lists for filters
  const allTags = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((i) => i.tags.forEach((t) => set.add(t)));
    return Array.from(set);
  }, [inventory]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((i) => set.add(i.color));
    return Array.from(set);
  }, [inventory]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((i) => set.add(i.size));
    return Array.from(set);
  }, [inventory]);

  // Filter Inventory logic: Exclude archived items from public catalog!
  const publicInventory = useMemo(() => {
    return inventory.filter((item) => {
      // 1. Archival protection requirement: items with status = 'archived' MUST be excluded from public catalog
      if (item.status === "archived") return false;

      // 2. Keyword Search
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = item.name.toLowerCase().includes(query);
        const matchDesc = item.description.toLowerCase().includes(query);
        const matchTag = item.tags.some((t) => t.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchTag) return false;
      }

      // 3. Size
      if (filters.size && item.size !== filters.size) return false;

      // 4. Color
      if (filters.color && item.color !== filters.color) return false;

      // 5. Tags
      if (filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((t) => item.tags.includes(t));
        if (!hasAllTags) return false;
      }

      // 6. Measurements Ranges
      if (filters.bustMin && item.bust_inches < filters.bustMin) return false;
      if (filters.bustMax && item.bust_inches > filters.bustMax) return false;
      if (filters.waistMin && item.waist_inches < filters.waistMin)
        return false;
      if (filters.waistMax && item.waist_inches > filters.waistMax)
        return false;
      if (filters.hipMin && item.hip_inches < filters.hipMin) return false;
      if (filters.hipMax && item.hip_inches > filters.hipMax) return false;
      if (filters.lengthMin && item.length_inches < filters.lengthMin)
        return false;
      if (filters.lengthMax && item.length_inches > filters.lengthMax)
        return false;

      return true;
    });
  }, [inventory, filters]);

  return (
    <div className="space-y-8 pb-16">
      {/* Hero Header Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFEEEE] via-[#FFD6DA] to-[#F4F7CD] border border-[#FFB5BD]/40 p-8 sm:p-12 shadow-glass">
        <div className="absolute -right-10 -bottom-10 w-96 h-96 bg-[#FFB5BD]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-10 w-72 h-72 bg-[#F4F7CD]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B32F4E]/10 border border-[#B32F4E]/25 text-xs text-[#B32F4E] font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Haute Couture Dress Rentals
          </div>

          <h1 className="font-display text-3xl sm:text-5xl font-bold tracking-tight text-[#B32F4E] leading-tight">
            Curated Eveningwear & Runway Statement Pieces
          </h1>

          <p className="text-[#2D1A22]/70 text-sm sm:text-base leading-relaxed font-sans">
            Rent iconic designer gowns for galas, red carpet events, and
            weddings. Seamless dynamic pricing, physical measurement filters,
            and guaranteed availability.
          </p>

          <div className="pt-4 flex flex-wrap items-center gap-6 text-xs text-[#2D1A22]/60 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#B32F4E]" />
              <span>Full Security Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <HeartHandshake className="w-4 h-4 text-[#8D9A2E]" />
              <span>Direct Consignor Payout Ledger</span>
            </div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#B32F4E]" />
              <span>2-Day Baseline Rental</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Catalog Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden col-span-1">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="w-full bg-[#FFEEEE]/80 backdrop-blur-md border border-[#FFB5BD]/50 text-[#2D1A22] py-3 px-4 rounded-xl flex items-center justify-between text-sm font-semibold shadow-soft hover:shadow-rose-glow transition"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-[#B32F4E]" /> Filter
              Catalog ({publicInventory.length} items)
            </span>
            <span className="text-xs text-[#B32F4E]">
              {mobileFilterOpen ? "Close" : "Expand"}
            </span>
          </button>

          {mobileFilterOpen && (
            <div className="mt-4">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                allTags={allTags}
                allColors={allColors}
                allSizes={allSizes}
              />
            </div>
          )}
        </div>

        {/* Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-1">
          <FilterSidebar
            filters={filters}
            setFilters={setFilters}
            allTags={allTags}
            allColors={allColors}
            allSizes={allSizes}
          />
        </div>

        {/* Dress Cards Grid */}
        <div className="col-span-1 lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between border-b border-[#FFB5BD]/40 pb-4">
            <div className="text-xs text-[#2D1A22]/50">
              Showing{" "}
              <strong className="text-[#2D1A22] font-semibold">
                {publicInventory.length}
              </strong>{" "}
              available gown{publicInventory.length === 1 ? "" : "s"}
            </div>
          </div>

          {publicInventory.length === 0 ? (
            <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-3xl p-12 text-center text-[#2D1A22]/50 space-y-4 shadow-glass">
              <PackageSearch className="w-12 h-12 text-[#FFB5BD] mx-auto" />
              <h3 className="font-display text-xl font-bold text-[#B32F4E]">
                No Dresses Match Your Filters
              </h3>
              <p className="text-xs max-w-md mx-auto">
                Try widening your bust, waist, or length measurement ranges, or
                reset tags and color filters.
              </p>
              <button
                onClick={() =>
                  setFilters({
                    searchQuery: "",
                    tags: [],
                    color: "",
                    size: "",
                    bustMin: undefined,
                    bustMax: undefined,
                    waistMin: undefined,
                    waistMax: undefined,
                    hipMin: undefined,
                    hipMax: undefined,
                    lengthMin: undefined,
                    lengthMax: undefined,
                  })
                }
                className="bg-[#B32F4E] hover:bg-[#8D2040] text-white text-xs px-5 py-2.5 rounded-xl transition shadow-wine-glow"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {publicInventory.map((dress) => (
                <DressCard
                  key={dress.id}
                  dress={dress}
                  onSelect={setSelectedDress}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Dress Detail Modal */}
      {selectedDress && (
        <DressDetailModal
          dress={selectedDress}
          onClose={() => setSelectedDress(null)}
        />
      )}
    </div>
  );
}
