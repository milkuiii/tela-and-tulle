"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { RentalOperationsTable } from "@/components/admin/RentalOperationsTable";
import { ConsignorManager } from "@/components/admin/ConsignorManager";
import { DressUploadForm } from "@/components/admin/DressUploadForm";
import { PayoutSettlementView } from "@/components/admin/PayoutSettlementView";
import { GlobalSettingsPanel } from "@/components/admin/GlobalSettingsPanel";
import { CalendarView } from "@/components/admin/CalendarView";
import {
  Shield,
  ShieldAlert,
  UserCheck,
  PlusCircle,
  DollarSign,
  Settings,
  Layers,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { currentUser } = useAppStore();
  const [activeTab, setActiveTab] = useState<
    "rentals" | "consignors" | "inventory" | "payouts" | "settings" | "calendar"
  >("rentals");

  const isAdmin = currentUser?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 text-center text-[#2D1A22] space-y-4 shadow-glass">
        <div className="w-16 h-16 bg-amber-50 border border-amber-300/60 rounded-full flex items-center justify-center mx-auto text-amber-500">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#B32F4E]">
          Admin Portal Restricted
        </h2>
        <p className="text-xs text-[#2D1A22]/50 leading-relaxed max-w-md mx-auto">
          This portal is reserved strictly for authorized administrators to
          manage rentals, consignors, and global platform settings.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="bg-[#B32F4E] hover:bg-[#8D2040] text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-wine-glow"
          >
            Return to Customer Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <section className="relative bg-gradient-to-r from-[#FFEEEE] via-[#FFD6DA] to-[#F4F7CD] border border-[#FFB5BD]/40 rounded-3xl p-8 shadow-glass overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#FFB5BD]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8D9A2E]/10 border border-[#8D9A2E]/30 text-xs text-[#8D9A2E] font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" /> Protected Operations Portal
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#B32F4E]">
              Admin Control Center & Operations
            </h1>

            <p className="text-[#2D1A22]/60 text-xs sm:text-sm max-w-2xl">
              Centralized platform management: consignor account creation,
              operational rental matrix tracking, automated commission
              snapshotting, deposit retentions, and monthly payout settlements.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#FFB5BD]/40 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("rentals")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "rentals"
              ? "bg-[#B32F4E] text-white border border-[#B32F4E] shadow-wine-glow"
              : "bg-white/60 backdrop-blur-sm text-[#2D1A22]/60 hover:text-[#B32F4E] border border-[#FFB5BD]/50 hover:border-[#B32F4E]/40"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Rental Operations Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab("consignors")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "consignors"
              ? "bg-[#B32F4E] text-white border border-[#B32F4E] shadow-wine-glow"
              : "bg-white/60 backdrop-blur-sm text-[#2D1A22]/60 hover:text-[#B32F4E] border border-[#FFB5BD]/50 hover:border-[#B32F4E]/40"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Consignor Management</span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "inventory"
              ? "bg-[#B32F4E] text-white border border-[#B32F4E] shadow-wine-glow"
              : "bg-white/60 backdrop-blur-sm text-[#2D1A22]/60 hover:text-[#B32F4E] border border-[#FFB5BD]/50 hover:border-[#B32F4E]/40"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Gown Upload & Archival Controls</span>
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "calendar"
              ? "bg-[#B32F4E] text-white border border-[#B32F4E] shadow-wine-glow"
              : "bg-white/60 backdrop-blur-sm text-[#2D1A22]/60 hover:text-[#B32F4E] border border-[#FFB5BD]/50 hover:border-[#B32F4E]/40"
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>Booking Calendar</span>
        </button>

        <button
          onClick={() => setActiveTab("payouts")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "payouts"
              ? "bg-[#B32F4E] text-white border border-[#B32F4E] shadow-wine-glow"
              : "bg-white/60 backdrop-blur-sm text-[#2D1A22]/60 hover:text-[#B32F4E] border border-[#FFB5BD]/50 hover:border-[#B32F4E]/40"
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Monthly Payout Settlement</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "settings"
              ? "bg-[#B32F4E] text-white border border-[#B32F4E] shadow-wine-glow"
              : "bg-white/60 backdrop-blur-sm text-[#2D1A22]/60 hover:text-[#B32F4E] border border-[#FFB5BD]/50 hover:border-[#B32F4E]/40"
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Global Settings</span>
        </button>
      </div>

      {/* Tab Content Display */}
      <div>
        {activeTab === "rentals" && <RentalOperationsTable />}
        {activeTab === "consignors" && <ConsignorManager />}
        {activeTab === "inventory" && <DressUploadForm />}
        {activeTab === "payouts" && <PayoutSettlementView />}
        {activeTab === "settings" && <GlobalSettingsPanel />}
        {activeTab === "calendar" && <CalendarView />}
      </div>
    </div>
  );
}
