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
  KeyRound,
  Copy,
  X,
} from "lucide-react";

/** Generate a random 12-character alphanumeric + symbol password. */
function generatePassword(): string {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%&";
  let pwd = "";
  const arr = new Uint8Array(12);
  crypto.getRandomValues(arr);
  for (const byte of arr) {
    pwd += chars[byte % chars.length];
  }
  return pwd;
}

export function ConsignorManager() {
  const { users, createConsignorUser } = useAppStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<"email" | "password" | null>(null);

  const consignors = users.filter((u) => u.role === "consignor");

  const handleCopy = async (text: string, field: "email" | "password") => {
    await navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !address) return;

    setLoading(true);
    setError(null);
    setCredentials(null);

    const password = generatePassword();

    const result = await createConsignorUser({
      full_name: fullName,
      email,
      phone_number: phone,
      address,
      password,
    });

    setLoading(false);

    if (!result.success) {
      setError(result.error ?? "Failed to create consignor account.");
      return;
    }

    setCredentials({ email, password });
    setFullName("");
    setEmail("");
    setPhone("");
    setAddress("");
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

        {/* Error banner */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl text-xs flex items-start gap-2">
            <X className="w-4 h-4 mt-0.5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Credentials reveal panel */}
        {credentials && (
          <div className="bg-[#2D1A22] border border-[#B32F4E]/40 rounded-xl p-4 space-y-3 text-white shadow-lg animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#FFB5BD] font-semibold text-xs">
                <CheckCircle2 className="w-4 h-4 text-[#8D9A2E]" />
                Account Created — Share These Credentials
              </div>
              <button
                onClick={() => setCredentials(null)}
                className="text-white/40 hover:text-white/80 transition"
                aria-label="Dismiss credentials"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {/* Email row */}
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 mb-0.5 uppercase tracking-wider">
                    <Mail className="w-3 h-3" /> Email
                  </div>
                  <span className="text-xs font-mono text-white truncate block">{credentials.email}</span>
                </div>
                <button
                  onClick={() => handleCopy(credentials.email, "email")}
                  className="shrink-0 text-white/40 hover:text-[#FFB5BD] transition"
                  title="Copy email"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {/* Password row */}
              <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-[10px] text-white/40 mb-0.5 uppercase tracking-wider">
                    <KeyRound className="w-3 h-3" /> Temporary Password
                  </div>
                  <span className="text-xs font-mono text-[#FFD6DC] tracking-widest">{credentials.password}</span>
                </div>
                <button
                  onClick={() => handleCopy(credentials.password, "password")}
                  className="shrink-0 text-white/40 hover:text-[#FFB5BD] transition"
                  title="Copy password"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              {copied && (
                <p className="text-[10px] text-[#8D9A2E] text-center animate-fade-in">
                  ✓ Copied {copied} to clipboard
                </p>
              )}
            </div>

            <p className="text-[10px] text-white/30 leading-relaxed">
              ⚠ This password will not be shown again. Share it securely with the consignor and ask them to change it on first login.
            </p>
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
            disabled={loading}
            className="w-full bg-[#B32F4E] hover:bg-[#8D2040] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition shadow-wine-glow mt-2 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating…
              </>
            ) : (
              "Create Consignor Account"
            )}
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

