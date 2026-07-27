"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Sparkles,
  Shield,
  UserCheck,
  Clock,
  Crown,
  ShoppingBag,
  Home,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, setCurrentUser, users, triggerLateCheckCron } =
    useAppStore();

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "guest") {
      setCurrentUser(null);
    } else {
      const found = users.find((u) => u.id === val);
      if (found) setCurrentUser(found);
    }
  };

  return (
    <header className="sticky top-5 rounded-full z-50 w-7xl bg-[#FFEEEE]/80 backdrop-blur-md border border-white/50 shadow-glass overflow-hidden">
      {/* Top Demo Bar */}
      <div className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-[#2D1A22]/70">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25">
            <Sparkles className="w-3 h-3 mr-1 text-[#B32F4E]" /> DEMO ROLE
            SWITCHER
          </span>
          <span className="hidden sm:inline text-[#2D1A22]/50">
            Active Mode:{" "}
            <strong className="text-[#2D1A22] font-semibold">
              {currentUser
                ? `${currentUser.full_name} (${currentUser.role.toUpperCase()})`
                : "Public Guest Customer"}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="role-select"
            className="text-[#2D1A22]/50 text-xs hidden md:inline"
          >
            Switch Role:
          </label>
          <select
            id="role-select"
            value={currentUser ? currentUser.id : "guest"}
            onChange={handleRoleChange}
            className="bg-white/70 text-[#2D1A22] text-xs px-2.5 py-1 rounded border border-[#FFB5BD]/60 focus:outline-none focus:border-[#B32F4E] cursor-pointer transition"
          >
            <option value="guest">Public Guest Customer</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.role === "admin" ? "👑 Admin" : "👗 Consignor"}:{" "}
                {u.full_name}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              triggerLateCheckCron();
              alert(
                "8:00 PM Automation Cron Triggered! Any active rentals past end_date have been updated to status: LATE.",
              );
            }}
            className="flex items-center gap-1.5 bg-[#F4F7CD] hover:bg-[#E8EDAA] text-[#8D9A2E] border border-[#8D9A2E]/30 px-2.5 py-1 rounded text-xs transition shadow-sm"
            title="Simulates the 8:00 PM daily automation trigger that updates 'out' rentals past end_date to 'late'"
          >
            <Clock className="w-3.5 h-3.5 text-[#8D9A2E]" />
            <span>Run 8 PM Cron</span>
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex flex-col group">
          <span className="font-display text-2xl text-[#B32F4E] font-bold group-hover:text-[#8D2040] transition">
            tela&tulle
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#8D9A2E] font-medium">
            Keeping style sustainable and accessible.
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-4 text-sm font-medium">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
            }`}
          >
            <Home className="w-4 h-4 text-[#B32F4E]" />
            <span>Home</span>
          </Link>

          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#B32F4E]" />
            <span>Catalog</span>
          </Link>

          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#B32F4E]" />
            <span>Lend With Us</span>
          </Link>

          {currentUser?.role === "admin" && (
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                pathname.startsWith("/admin")
                  ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                  : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
              }`}
            >
              <Shield className="w-4 h-4 text-[#8D9A2E]" />
              <span>Admin Portal</span>
              <span className="w-2 h-2 rounded-full bg-[#8D9A2E] animate-pulse"></span>
            </Link>
          )}

          {currentUser?.role === "consignor" && (
            <Link
              href="/consignor"
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                pathname.startsWith("/consignor")
                  ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                  : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#8D9A2E]" />
              <span>Consignor Portal</span>
              <span className="w-2 h-2 rounded-full bg-[#8D9A2E] animate-pulse"></span>
            </Link>
          )}

          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-[#B32F4E]" />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
