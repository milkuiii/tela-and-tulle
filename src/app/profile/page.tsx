"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { format, parseISO } from "date-fns";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Instagram,
  CalendarDays,
  Package,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Hourglass,
  ArrowUpRight,
  Pencil,
  ShoppingBag,
} from "lucide-react";
import Link from "next/link";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string; icon: React.ElementType }
> = {
  pending: {
    label: "Pending",
    color: "#D97706",
    bg: "rgba(217, 119, 6, 0.08)",
    border: "rgba(217, 119, 6, 0.3)",
    icon: Hourglass,
  },
  booked: {
    label: "Confirmed",
    color: "#8D9A2E",
    bg: "rgba(141, 154, 46, 0.08)",
    border: "rgba(141, 154, 46, 0.3)",
    icon: CheckCircle2,
  },
  out: {
    label: "Out for Rental",
    color: "#B32F4E",
    bg: "rgba(179, 47, 78, 0.08)",
    border: "rgba(179, 47, 78, 0.3)",
    icon: ArrowUpRight,
  },
  returned: {
    label: "Returned",
    color: "#6D7A1E",
    bg: "rgba(109, 122, 30, 0.08)",
    border: "rgba(109, 122, 30, 0.3)",
    icon: CheckCircle2,
  },
  late: {
    label: "Late",
    color: "#DC2626",
    bg: "rgba(220, 38, 38, 0.08)",
    border: "rgba(220, 38, 38, 0.3)",
    icon: AlertTriangle,
  },
  cancelled: {
    label: "Cancelled",
    color: "#6B7280",
    bg: "rgba(107, 114, 128, 0.08)",
    border: "rgba(107, 114, 128, 0.3)",
    icon: XCircle,
  },
};

export default function ProfilePage() {
  const { currentUser, customers, rentals, inventory } = useAppStore();
  const [editMode, setEditMode] = useState(false);

  // For guest / no-customer scenario — prompt to browse
  // A real app would match by email from auth; here we show a demo guest view
  const demoCustomer = customers[0] ?? null;
  const activeCustomer = demoCustomer;

  const customerRentals = activeCustomer
    ? rentals
        .filter((r) => r.customer_id === activeCustomer.id)
        .sort(
          (a, b) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        )
    : [];

  const stats = {
    total: customerRentals.length,
    active: customerRentals.filter((r) => ["booked", "out"].includes(r.status))
      .length,
    completed: customerRentals.filter((r) => r.status === "returned").length,
    pending: customerRentals.filter((r) => r.status === "pending").length,
  };

  if (!activeCustomer) {
    return (
      <div className="max-w-2xl mx-auto my-12 space-y-6 text-center">
        <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-3xl p-12 shadow-glass space-y-5">
          <div className="w-20 h-20 bg-[#B32F4E]/10 border border-[#B32F4E]/20 rounded-full flex items-center justify-center mx-auto">
            <User className="w-9 h-9 text-[#B32F4E]" />
          </div>
          <h1 className="font-display text-2xl font-bold text-[#B32F4E]">
            Your Profile
          </h1>
          <p className="text-sm text-[#2D1A22]/50 leading-relaxed max-w-md mx-auto">
            You don't have an account yet. Rent a gown to create your customer
            profile and track your rental history here.
          </p>
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 bg-[#B32F4E] hover:bg-[#8D2040] text-white px-6 py-3 rounded-2xl font-semibold text-sm transition shadow-wine-glow"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20">
      {/* ── Profile Header Card ── */}
      <section className="relative bg-gradient-to-br from-[#2D1A22] via-[#4A1E2D] to-[#1A1012] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-glass overflow-hidden">
        <div className="absolute -right-12 -top-12 w-72 h-72 bg-[#B32F4E]/15 rounded-full blur-[60px] pointer-events-none" />
        <div className="absolute -left-8 -bottom-8 w-48 h-48 bg-[#8D9A2E]/10 rounded-full blur-[40px] pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-[#B32F4E] to-[#8D2040] flex items-center justify-center shadow-wine-glow shrink-0">
            <span className="font-display text-3xl font-bold text-white">
              {activeCustomer.full_name.charAt(0)}
            </span>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="font-display text-2xl sm:text-3xl font-bold text-white">
                {activeCustomer.full_name}
              </h1>
              <span className="px-2.5 py-0.5 bg-[#8D9A2E]/20 border border-[#8D9A2E]/30 text-[#A8B83A] text-[10px] font-semibold uppercase tracking-wider rounded-full">
                Customer
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-white/50 text-sm">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5" />
                {activeCustomer.email}
              </span>
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" />
                {activeCustomer.phone_number}
              </span>
              {activeCustomer.social_handle && (
                <span className="flex items-center gap-1.5">
                  <Instagram className="w-3.5 h-3.5" />
                  {activeCustomer.social_handle}
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5 text-white/40 text-xs">
              <MapPin className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate max-w-xs">{activeCustomer.shipping_address}</span>
            </div>
          </div>

          {/* Edit button */}
          <button
            onClick={() => setEditMode(!editMode)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold rounded-xl transition shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" />
            {editMode ? "Cancel" : "Edit Profile"}
          </button>
        </div>
      </section>

      {/* ── Edit Mode placeholder (UI only) ── */}
      {editMode && (
        <div className="bg-[#F4F7CD]/70 backdrop-blur-md border border-[#8D9A2E]/20 rounded-2xl p-6 shadow-glass space-y-4">
          <h2 className="font-display text-lg font-bold text-[#8D9A2E]">
            Edit Profile Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", value: activeCustomer.full_name, icon: User },
              { label: "Email Address", value: activeCustomer.email, icon: Mail },
              { label: "Phone Number", value: activeCustomer.phone_number, icon: Phone },
              {
                label: "Social Handle",
                value: activeCustomer.social_handle ?? "",
                icon: Instagram,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </label>
                <input
                  defaultValue={value}
                  className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl"
                />
              </div>
            ))}
            <div className="sm:col-span-2 space-y-1.5">
              <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Shipping Address
              </label>
              <input
                defaultValue={activeCustomer.shipping_address}
                className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl"
              />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button className="bg-[#8D9A2E] hover:bg-[#6D7A1E] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition">
              Save Changes
            </button>
            <button
              onClick={() => setEditMode(false)}
              className="bg-white/60 hover:bg-white/80 text-[#2D1A22] border border-[#FFB5BD]/50 px-5 py-2.5 rounded-xl text-xs font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Rentals", value: stats.total, icon: Package, color: "#B32F4E" },
          { label: "Active Bookings", value: stats.active, icon: CalendarDays, color: "#8D9A2E" },
          { label: "Completed", value: stats.completed, icon: CheckCircle2, color: "#6D7A1E" },
          { label: "Pending", value: stats.pending, icon: Clock3, color: "#D97706" },
        ].map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-5 shadow-glass flex items-center gap-4"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
              style={{ background: `${color}12`, borderColor: `${color}30` }}
            >
              <Icon className="w-5 h-5" style={{ color }} />
            </div>
            <div>
              <div className="text-2xl font-sans font-bold text-[#2D1A22]">
                {value}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-[#2D1A22]/50 font-semibold">
                {label}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Rental History Table ── */}
      <section className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass space-y-5">
        <h2 className="font-display text-xl font-bold text-[#B32F4E] border-b border-[#FFB5BD]/40 pb-3">
          Rental History
        </h2>

        {customerRentals.length === 0 ? (
          <div className="text-center py-12 space-y-4">
            <Package className="w-12 h-12 text-[#FFB5BD] mx-auto" />
            <p className="text-sm text-[#2D1A22]/40">
              No rentals on record. Browse the catalog to get started!
            </p>
            <Link
              href="/catalog"
              className="inline-flex items-center gap-2 bg-[#B32F4E] hover:bg-[#8D2040] text-white px-5 py-2.5 rounded-xl text-xs font-semibold transition shadow-wine-glow"
            >
              <ShoppingBag className="w-4 h-4" />
              Explore Gowns
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D1A22]/70">
              <thead className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 uppercase text-[10px] text-[#B32F4E] font-semibold tracking-wider">
                <tr>
                  <th className="py-3 px-4">Gown</th>
                  <th className="py-3 px-4">Rental Window</th>
                  <th className="py-3 px-4">Amount Due</th>
                  <th className="py-3 px-4">Deposit</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#FFB5BD]/30">
                {customerRentals.map((rental) => {
                  const gown = inventory.find((i) => i.id === rental.dress_id);
                  const cfg = STATUS_CONFIG[rental.status] ?? STATUS_CONFIG.pending;
                  const StatusIcon = cfg.icon;

                  return (
                    <tr
                      key={rental.id}
                      className="hover:bg-[#FFB5BD]/10 transition"
                    >
                      <td className="py-3.5 px-4 font-medium text-[#2D1A22] space-y-0.5">
                        <div className="font-display font-bold text-sm text-[#B32F4E]">
                          {gown?.name ?? "Gown"}
                        </div>
                        <div className="text-[10px] text-[#2D1A22]/35 font-mono">
                          {rental.id.slice(0, 8)}…
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2D1A22]/60">
                        {rental.start_date}{" "}
                        <span className="text-[#2D1A22]/30">→</span>{" "}
                        {rental.end_date}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#2D1A22]">
                        ₱{Number(rental.amount_due).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[#2D1A22]/60">
                        ₱{Number(rental.deposit_paid).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border"
                          style={{
                            color: cfg.color,
                            background: cfg.bg,
                            borderColor: cfg.border,
                          }}
                        >
                          <StatusIcon className="w-3 h-3" />
                          {cfg.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
