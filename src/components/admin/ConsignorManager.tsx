"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import {
  UserCheck,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react";

export function ConsignorManager() {
  const { users, createConsignorUser } = useAppStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [successMsg, setSuccessMsg] = useState(false);

  const consignors = users.filter((u) => u.role === "consignor");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address) return;

    createConsignorUser({
      full_name: fullName,
      email,
      phone_number: phone,
      address,
    });

    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Create Form */}
      <div className="lg:col-span-1 bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 space-y-4 shadow-xl text-white">
        <div className="flex items-center gap-2 font-sans text-lg font-bold text-rose-200 pb-3 border-b border-[#2E2A32]">
          <UserPlus className="w-5 h-5 text-rose-400" />
          <span>Register New Consignor</span>
        </div>

        <p className="text-xs text-neutral-400 leading-relaxed">
          Only Admins can register new consignor accounts. Consignors gain
          access to their isolated inventory ledger and monthly payout reports.
        </p>

        {successMsg && (
          <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Consignor user created successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1 font-medium">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Elena Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-medium">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="elena@fashionhouse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-medium">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block text-neutral-300 mb-1 font-medium">
              Physical Address (For Payouts / Drops) *
            </label>
            <input
              type="text"
              placeholder="742 Luxury Way, Beverly Hills, CA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-rose-900 hover:bg-rose-800 text-white font-semibold py-3 rounded-xl transition shadow-md mt-2"
          >
            Create Consignor Account
          </button>
        </form>
      </div>

      {/* Consignors Table */}
      <div className="lg:col-span-2 bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 space-y-4 shadow-xl text-white">
        <div className="flex items-center justify-between pb-3 border-b border-[#2E2A32]">
          <div className="flex items-center gap-2 font-sans text-lg font-bold text-rose-200">
            <UserCheck className="w-5 h-5 text-purple-400" />
            <span>Active Consignor Directory ({consignors.length})</span>
          </div>
        </div>

        <div className="divide-y divide-[#2E2A32]">
          {consignors.map((c) => (
            <div
              key={c.id}
              className="py-3.5 flex flex-wrap items-center justify-between gap-4 hover:bg-[#252129] px-3 rounded-xl transition"
            >
              <div className="space-y-1">
                <div className="font-semibold text-rose-100 flex items-center gap-2 text-sm">
                  <span>{c.full_name}</span>
                  <span className="bg-purple-950/80 text-purple-300 text-[10px] px-2 py-0.5 rounded-full border border-purple-800/40">
                    CONSIGNOR
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-400">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-neutral-500" /> {c.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-neutral-500" />{" "}
                    {c.phone_number}
                  </span>
                </div>
                <div className="text-[11px] text-neutral-500 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-neutral-600" /> {c.address}
                </div>
              </div>

              <div className="text-right text-xs font-mono text-neutral-400">
                <div>ID: {c.id.slice(0, 8)}...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
