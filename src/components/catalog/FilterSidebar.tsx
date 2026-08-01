"use client";

import React from "react";
import { FilterOptions } from "@/types/database";
import { Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";

interface FilterSidebarProps {
  filters: FilterOptions;
  setFilters: React.Dispatch<React.SetStateAction<FilterOptions>>;
  allTags: string[];
  allColors: string[];
  allSizes: string[];
}

export function FilterSidebar({
  filters,
  setFilters,
  allTags,
  allColors,
  allSizes,
}: FilterSidebarProps) {
  const handleReset = () => {
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
      startDate: undefined,
      endDate: undefined,
    });
  };

  const toggleTag = (tag: string) => {
    setFilters((prev) => {
      const exists = prev.tags.includes(tag);
      return {
        ...prev,
        tags: exists ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
      };
    });
  };

  return (
    <aside className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-5 text-[#2D1A22] space-y-6 shadow-glass">
      <div className="flex items-center justify-between pb-4 border-b border-[#FFB5BD]/40">
        <div className="flex items-center gap-2 font-display text-lg font-semibold text-[#B32F4E]">
          <Filter className="w-4 h-4 text-[#B32F4E]" />
          <span>Refine Catalog</span>
        </div>
        <button
          onClick={handleReset}
          className="text-xs text-[#2D1A22]/50 hover:text-[#B32F4E] flex items-center gap-1 transition"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Search Input */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-[#2D1A22]/50 mb-2 font-medium">
          Search Keyword
        </label>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#B32F4E]/50" />
          <input
            type="text"
            placeholder="Search by dress name, style..."
            value={filters.searchQuery}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))
            }
            className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-sm text-[#2D1A22] placeholder-[#2D1A22]/30 transition"
          />
        </div>
      </div>

      {/* Date Availability Filter */}
      <div className="pt-2 border-t border-[#FFB5BD]/40">
        <label className="block text-xs uppercase tracking-wider text-[#2D1A22]/50 mb-2 font-medium">
          Availability Dates
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[10px] text-[#2D1A22]/40 mb-1">Start Date</label>
            <input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => setFilters((p) => ({ ...p, startDate: e.target.value || undefined }))}
              className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22]"
            />
          </div>
          <div>
            <label className="block text-[10px] text-[#2D1A22]/40 mb-1">End Date</label>
            <input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => setFilters((p) => ({ ...p, endDate: e.target.value || undefined }))}
              min={filters.startDate}
              className="w-full glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22]"
            />
          </div>
        </div>
      </div>

      {/* General Sizing Filter */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-[#2D1A22]/50 mb-2 font-medium">
          Size
        </label>
        <div className="flex flex-wrap gap-2">
          {["", ...allSizes].map((sz) => (
            <button
              key={sz || "all-size"}
              onClick={() => setFilters((prev) => ({ ...prev, size: sz }))}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition border ${
                filters.size === sz
                  ? "bg-[#B32F4E] border-[#B32F4E] text-white shadow-wine-glow"
                  : "bg-white/50 border-[#FFB5BD]/50 text-[#2D1A22]/60 hover:text-[#B32F4E] hover:border-[#B32F4E]/40"
              }`}
            >
              {sz || "All Sizes"}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <label className="block text-xs uppercase tracking-wider text-[#2D1A22]/50 mb-2 font-medium">
          Color Palette
        </label>
        <select
          value={filters.color}
          onChange={(e) =>
            setFilters((prev) => ({ ...prev, color: e.target.value }))
          }
          className="w-full glass-input rounded-xl px-3 py-2 text-sm text-[#2D1A22] cursor-pointer"
        >
          <option value="">All Colors</option>
          {allColors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Physical Measurements Filter */}
      <div className="space-y-4 pt-2 border-t border-[#FFB5BD]/40">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#B32F4E] uppercase tracking-wider">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Precise Fit (Inches)</span>
        </div>

        {/* Bust */}
        <div>
          <div className="flex justify-between text-xs text-[#2D1A22]/50 mb-1">
            <span>Bust Range</span>
            <span>
              {filters.bustMin || 30}" - {filters.bustMax || 45}"
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.bustMin ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  bustMin: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22] placeholder-[#2D1A22]/30"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.bustMax ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  bustMax: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22] placeholder-[#2D1A22]/30"
            />
          </div>
        </div>

        {/* Waist */}
        <div>
          <div className="flex justify-between text-xs text-[#2D1A22]/50 mb-1">
            <span>Waist Range</span>
            <span>
              {filters.waistMin || 22}" - {filters.waistMax || 38}"
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.waistMin ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  waistMin: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22] placeholder-[#2D1A22]/30"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.waistMax ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  waistMax: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22] placeholder-[#2D1A22]/30"
            />
          </div>
        </div>

        {/* Hips */}
        <div>
          <div className="flex justify-between text-xs text-[#2D1A22]/50 mb-1">
            <span>Hips Range</span>
            <span>
              {filters.hipMin || 32}" - {filters.hipMax || 48}"
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.hipMin ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  hipMin: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22] placeholder-[#2D1A22]/30"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.hipMax ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  hipMax: e.target.value ? Number(e.target.value) : undefined,
                }))
              }
              className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22] placeholder-[#2D1A22]/30"
            />
          </div>
        </div>

        {/* Length */}
        <div>
          <div className="flex justify-between text-xs text-[#2D1A22]/50 mb-1">
            <span>Dress Length</span>
            <span>
              {filters.lengthMin || 50}" - {filters.lengthMax || 65}"
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.lengthMin ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  lengthMin: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
              className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22] placeholder-[#2D1A22]/30"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.lengthMax ?? ""}
              onChange={(e) =>
                setFilters((p) => ({
                  ...p,
                  lengthMax: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                }))
              }
              className="glass-input rounded-lg px-2.5 py-1.5 text-xs text-[#2D1A22] placeholder-[#2D1A22]/30"
            />
          </div>
        </div>
      </div>

      {/* Style Tags Filter */}
      <div className="pt-2 border-t border-[#FFB5BD]/40">
        <label className="block text-xs uppercase tracking-wider text-[#2D1A22]/50 mb-2 font-medium">
          Style Tags
        </label>
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => {
            const isSelected = filters.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-xs transition border ${
                  isSelected
                    ? "bg-[#B32F4E] text-white border-[#B32F4E] font-semibold shadow-wine-glow"
                    : "bg-white/50 text-[#2D1A22]/60 border-[#FFB5BD]/50 hover:text-[#B32F4E] hover:border-[#B32F4E]/40"
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
