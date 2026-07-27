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
      <div className="lg:col-span-1 bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 space-y-4 shadow-glass text-[#2D1A22]">
        <div className="flex items-center gap-2 font-display text-lg font-bold text-[#B32F4E] pb-3 border-b border-[#FFB5BD]/40">
          <UserPlus className="w-5 h-5 text-[#B32F4E]" />
          <span>Register New Consignor</span>
        </div>

        <p className="text-xs text-[#2D1A22]/50 leading-relaxed">
          Only Admins can register new consignor accounts. Consignors gain
          access to their isolated inventory ledger and monthly payout reports.
        </p>

        {successMsg && (
          <div className="bg-[#8D9A2E]/10 border border-[#8D9A2E]/40 text-[#6D7A1E] p-3 rounded-xl text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#8D9A2E]" />
            <span>Consignor user created successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-[#2D1A22]/60 mb-1 font-medium">
              Full Name *
            </label>
            <input
              type="text"
              placeholder="e.g. Elena Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2D1A22]/60 mb-1 font-medium">
              Email Address *
            </label>
            <input
              type="email"
              placeholder="elena@fashionhouse.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2D1A22]/60 mb-1 font-medium">
              Phone Number *
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
              required
            />
          </div>

          <div>
            <label className="block text-[#2D1A22]/60 mb-1 font-medium">
              Physical Address (For Payouts / Drops) *
            </label>
            <input
              type="text"
              placeholder="742 Luxury Way, Beverly Hills, CA"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#B32F4E] hover:bg-[#8D2040] text-white font-semibold py-3 rounded-xl transition shadow-wine-glow mt-2"
          >
            Create Consignor Account
          </button>
        </form>
      </div>

      {/* Consignors Table */}
      <div className="lg:col-span-2 bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 space-y-4 shadow-glass text-[#2D1A22]">
        <div className="flex items-center justify-between pb-3 border-b border-[#FFB5BD]/40">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-[#B32F4E]">
            <UserCheck className="w-5 h-5 text-[#8D9A2E]" />
            <span>Active Consignor Directory ({consignors.length})</span>
          </div>
        </div>

        <div className="divide-y divide-[#FFB5BD]/30">
          {consignors.map((c) => (
            <div
              key={c.id}
              className="py-3.5 flex flex-wrap items-center justify-between gap-4 hover:bg-[#FFB5BD]/10 px-3 rounded-xl transition"
            >
              <div className="space-y-1">
                <div className="font-semibold text-[#B32F4E] flex items-center gap-2 text-sm">
                  <span>{c.full_name}</span>
                  <span className="bg-[#8D9A2E]/10 text-[#6D7A1E] text-[10px] px-2 py-0.5 rounded-full border border-[#8D9A2E]/30">
                    CONSIGNOR
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#2D1A22]/50">
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-[#B32F4E]/40" /> {c.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#B32F4E]/40" />{" "}
                    {c.phone_number}
                  </span>
                </div>
                <div className="text-[11px] text-[#2D1A22]/40 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#2D1A22]/25" /> {c.address}
                </div>
              </div>

              <div className="text-right text-xs font-mono text-[#2D1A22]/30">
                <div>ID: {c.id.slice(0, 8)}...</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
