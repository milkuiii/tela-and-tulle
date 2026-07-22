"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { InventoryItem } from "@/types/database";
import {
  PlusCircle,
  Archive,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  SlidersHorizontal,
} from "lucide-react";

export function DressUploadForm() {
  const { users, inventory, addInventoryItem, updateInventoryStatus } =
    useAppStore();

  const consignors = users.filter((u) => u.role === "consignor");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [ownerId, setOwnerId] = useState<string>(""); // empty = store owned
  const [size, setSize] = useState("M");
  const [color, setColor] = useState("Emerald");
  const [tagsInput, setTagsInput] = useState("Gala, Black-Tie, Silk");
  const [imageUrlInput, setImageUrlInput] = useState(
    "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80",
  );

  // Measurements
  const [bust, setBust] = useState<number>(35);
  const [waist, setWaist] = useState<number>(27);
  const [hip, setHip] = useState<number>(38);
  const [lengthInches, setLengthInches] = useState<number>(60);

  // Financials
  const [retailPrice, setRetailPrice] = useState<number>(2500);
  const [baseRentalPrice, setBaseRentalPrice] = useState<number>(250);
  const [extensionRate, setExtensionRate] = useState<number>(45);
  const [securityDeposit, setSecurityDeposit] = useState<number>(150);

  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const tagsArray = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    const imagesArray = imageUrlInput
      .split("\n")
      .map((u) => u.trim())
      .filter(Boolean);

    addInventoryItem({
      owner_id: ownerId || null,
      name,
      description,
      size,
      color,
      bust_inches: Number(bust),
      waist_inches: Number(waist),
      hip_inches: Number(hip),
      length_inches: Number(lengthInches),
      retail_price: Number(retailPrice),
      base_rental_price: Number(baseRentalPrice),
      extension_rate_daily: Number(extensionRate),
      security_deposit: Number(securityDeposit),
      tags: tagsArray,
      image_urls: imagesArray.length
        ? imagesArray
        : [
            "https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=1200&q=80",
          ],
      status: "active",
    });

    setName("");
    setDescription("");
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Upload Form */}
      <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 shadow-xl text-white space-y-6">
        <div className="flex items-center gap-2 font-sans text-lg font-bold text-rose-200 pb-3 border-b border-[#2E2A32]">
          <PlusCircle className="w-5 h-5 text-rose-400" />
          <span>Add New Gown to Inventory</span>
        </div>

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>
              Dress added to inventory! It is now live in the active catalog.
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Section 1: Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">
                Dress Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Velvet Solstice Gown"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">
                Ownership Type
              </label>
              <select
                value={ownerId}
                onChange={(e) => setOwnerId(e.target.value)}
                className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500 cursor-pointer"
              >
                <option value="">Store-Owned Item (In-House)</option>
                {consignors.map((c) => (
                  <option key={c.id} value={c.id}>
                    Consigned by: {c.full_name} ({c.email})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">
                Color Palette
              </label>
              <input
                type="text"
                placeholder="e.g. Emerald Green, Midnight Blue"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-semibold">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Describe silhouette, fabric grade, lining, back detail..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Section 2: Measurements & Size */}
          <div className="bg-[#121013] border border-[#2E2A32] p-4 rounded-xl space-y-3">
            <h4 className="font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Size & Physical
              Measurements
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">
                  Standard Size
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(e.target.value)}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                >
                  <option value="XS">XS</option>
                  <option value="S">S</option>
                  <option value="M">M</option>
                  <option value="L">L</option>
                  <option value="XL">XL</option>
                </select>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Bust (Inches)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={bust}
                  onChange={(e) => setBust(Number(e.target.value))}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Waist (Inches)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={waist}
                  onChange={(e) => setWaist(Number(e.target.value))}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Hips (Inches)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hip}
                  onChange={(e) => setHip(Number(e.target.value))}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Length (Inches)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={lengthInches}
                  onChange={(e) => setLengthInches(Number(e.target.value))}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Financial Parameters */}
          <div className="bg-[#121013] border border-[#2E2A32] p-4 rounded-xl space-y-3">
            <h4 className="font-semibold text-rose-300 uppercase tracking-wider">
              Financial Pricing Structure
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-neutral-400 mb-1">
                  Retail Value (₱)
                </label>
                <input
                  type="number"
                  value={retailPrice}
                  onChange={(e) => setRetailPrice(Number(e.target.value))}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Base 2-Day Rate (₱)
                </label>
                <input
                  type="number"
                  value={baseRentalPrice}
                  onChange={(e) => setBaseRentalPrice(Number(e.target.value))}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Extra Daily Extension (₱)
                </label>
                <input
                  type="number"
                  value={extensionRate}
                  onChange={(e) => setExtensionRate(Number(e.target.value))}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">
                  Security Deposit (₱)
                </label>
                <input
                  type="number"
                  value={securityDeposit}
                  onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                  className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-lg p-2 text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Image URLs & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">
                Image URLs (One per line)
              </label>
              <textarea
                rows={3}
                value={imageUrlInput}
                onChange={(e) => setImageUrlInput(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-rose-500"
              />
            </div>
            <div>
              <label className="block text-neutral-300 mb-1 font-semibold">
                Style Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Gala, Black-Tie, Velvet"
                className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-rose-900 hover:bg-rose-800 text-white font-bold py-3.5 rounded-xl transition shadow-lg text-sm"
          >
            Publish Gown to Inventory
          </button>
        </form>
      </div>

      {/* Inventory Items Management Table & Archival Protection Controls */}
      <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 shadow-xl text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2E2A32]">
          <h3 className="font-sans text-lg font-bold text-rose-200">
            Current Inventory & Archival Protection Controls ({inventory.length}
            )
          </h3>
          <span className="text-xs text-neutral-400">
            Archived items are excluded from public search but retained for
            historical records.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#121013] border-b border-[#2E2A32] uppercase text-[10px] text-rose-300">
              <tr>
                <th className="py-3 px-4">Item Name</th>
                <th className="py-3 px-4">Owner</th>
                <th className="py-3 px-4">Size & Specs</th>
                <th className="py-3 px-4">Base Rate / Deposit</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Archival Toggle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2A32]">
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-[#252129] transition">
                  <td className="py-3 px-4 font-semibold text-white">
                    {item.name}
                    <span className="block text-[10px] text-neutral-500">
                      {item.color}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {item.owner ? (
                      <span className="text-purple-300 font-medium">
                        {item.owner.full_name}
                      </span>
                    ) : (
                      <span className="text-neutral-500 font-mono">
                        Store-Owned
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-[11px]">
                    Size {item.size} • B:{item.bust_inches}" W:
                    {item.waist_inches}" H:{item.hip_inches}" L:
                    {item.length_inches}"
                  </td>
                  <td className="py-3 px-4 font-mono">
                    ₱{item.base_rental_price} / 2 days (₱{item.security_deposit}{" "}
                    dep)
                  </td>
                  <td className="py-3 px-4">
                    {item.status === "active" ? (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Active (Public)
                      </span>
                    ) : (
                      <span className="bg-neutral-800 text-neutral-400 border border-neutral-700 px-2 py-0.5 rounded text-[10px] font-semibold">
                        Archived (Hidden)
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {item.status === "active" ? (
                      <button
                        onClick={() =>
                          updateInventoryStatus(item.id, "archived")
                        }
                        className="bg-amber-950/80 hover:bg-amber-900 text-amber-200 border border-amber-700 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                      >
                        Archive Item
                      </button>
                    ) : (
                      <button
                        onClick={() => updateInventoryStatus(item.id, "active")}
                        className="bg-emerald-950 hover:bg-emerald-900 text-emerald-200 border border-emerald-700 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                      >
                        Restore Active
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
