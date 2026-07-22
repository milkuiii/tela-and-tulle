"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { RentalOperationsTable } from "@/components/admin/RentalOperationsTable";
import { ConsignorManager } from "@/components/admin/ConsignorManager";
import { DressUploadForm } from "@/components/admin/DressUploadForm";
import { PayoutSettlementView } from "@/components/admin/PayoutSettlementView";
import { GlobalSettingsPanel } from "@/components/admin/GlobalSettingsPanel";
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
    "rentals" | "consignors" | "inventory" | "payouts" | "settings"
  >("rentals");

  const isAdmin = currentUser?.role === "admin";

  if (!isAdmin) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-[#1C191E] border border-[#2E2A32] rounded-3xl p-8 text-center text-white space-y-4 shadow-2xl">
        <div className="w-16 h-16 bg-amber-950/80 border border-amber-800/60 rounded-full flex items-center justify-center mx-auto text-amber-300">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-sans text-2xl font-bold text-rose-100">
          Admin Portal Restricted
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
          This portal is reserved strictly for authorized administrators to
          manage rentals, consignors, and global platform settings.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="bg-rose-900 hover:bg-rose-800 text-rose-100 px-4 py-2 rounded-xl text-xs font-semibold transition"
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
      <section className="relative bg-gradient-to-r from-[#1C191E] via-[#2D121F] to-[#1C191E] border border-[#2E2A32] rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-800/60 text-xs text-amber-300 font-semibold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" /> Protected Operations Portal
            </div>

            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-rose-100">
              Admin Control Center & Operations
            </h1>

            <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl">
              Centralized platform management: consignor account creation,
              operational rental matrix tracking, automated commission
              snapshotting, deposit retentions, and monthly payout settlements.
            </p>
          </div>
        </div>
      </section>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-[#2E2A32] pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("rentals")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "rentals"
              ? "bg-rose-900 text-rose-100 border border-rose-700 shadow-md"
              : "bg-[#1C191E] text-neutral-400 hover:text-white border border-[#2E2A32]"
          }`}
        >
          <Layers className="w-4 h-4 text-rose-400" />
          <span>Rental Operations Matrix</span>
        </button>

        <button
          onClick={() => setActiveTab("consignors")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "consignors"
              ? "bg-rose-900 text-rose-100 border border-rose-700 shadow-md"
              : "bg-[#1C191E] text-neutral-400 hover:text-white border border-[#2E2A32]"
          }`}
        >
          <UserCheck className="w-4 h-4 text-purple-400" />
          <span>Consignor Management</span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "inventory"
              ? "bg-rose-900 text-rose-100 border border-rose-700 shadow-md"
              : "bg-[#1C191E] text-neutral-400 hover:text-white border border-[#2E2A32]"
          }`}
        >
          <PlusCircle className="w-4 h-4 text-emerald-400" />
          <span>Gown Upload & Archival Controls</span>
        </button>

        <button
          onClick={() => setActiveTab("payouts")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "payouts"
              ? "bg-rose-900 text-rose-100 border border-rose-700 shadow-md"
              : "bg-[#1C191E] text-neutral-400 hover:text-white border border-[#2E2A32]"
          }`}
        >
          <DollarSign className="w-4 h-4 text-amber-400" />
          <span>Monthly Payout Settlement</span>
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-4 py-2.5 rounded-xl transition flex items-center gap-2 ${
            activeTab === "settings"
              ? "bg-rose-900 text-rose-100 border border-rose-700 shadow-md"
              : "bg-[#1C191E] text-neutral-400 hover:text-white border border-[#2E2A32]"
          }`}
        >
          <Settings className="w-4 h-4 text-neutral-400" />
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
      </div>
    </div>
  );
}
