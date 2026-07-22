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
    <header className="sticky top-5 rounded-full z-50 bg-[#97183e] backdrop-blur-md w-7xl text-white">
      {/* Top Demo Bar */}
      <div className="bg-[#1C191E] border-b border-[#2E2A32]/60 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 text-neutral-300">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-950/80 text-rose-300 border border-rose-800/50">
            <Sparkles className="w-3 h-3 mr-1 text-rose-400" /> DEMO ROLE
            SWITCHER
          </span>
          <span className="hidden sm:inline text-neutral-400">
            Active Mode:{" "}
            <strong className="text-white font-medium">
              {currentUser
                ? `${currentUser.full_name} (${currentUser.role.toUpperCase()})`
                : "Public Guest Customer"}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <label
            htmlFor="role-select"
            className="text-neutral-400 text-xs hidden md:inline"
          >
            Switch Role:
          </label>
          <select
            id="role-select"
            value={currentUser ? currentUser.id : "guest"}
            onChange={handleRoleChange}
            className="bg-[#2E2A32] text-white text-xs px-2.5 py-1 rounded border border-neutral-700 focus:outline-none focus:border-rose-500 cursor-pointer"
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
            className="flex items-center gap-1.5 bg-[#2E2A32] hover:bg-neutral-800 text-amber-300 border border-amber-800/40 px-2.5 py-1 rounded text-xs transition"
            title="Simulates the 8:00 PM daily automation trigger that updates 'out' rentals past end_date to 'late'"
          >
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span>Run 8 PM Cron</span>
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex flex-col group">
          <span className="font-sans text-2xl text-[#fdefee] font-bold group-hover:text-rose-300 transition">
            tela&tulle
          </span>
          <span className="text-[9px] uppercase tracking-[0.3em] text-[#f5f7cf] font-medium">
            Keeping style sustainable and accessible.
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-1 sm:space-x-4 text-sm font-medium">
          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                : "text-neutral-300 hover:text-white hover:bg-neutral-800/40"
            }`}
          >
            <Home className="w-4 h-4 text-rose-400" />
            <span>Home</span>
          </Link>

          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                : "text-neutral-300 hover:text-white hover:bg-neutral-800/40"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-rose-400" />
            <span>Catalog</span>
          </Link>

          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                : "text-neutral-300 hover:text-white hover:bg-neutral-800/40"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-rose-400" />
            <span>Lend With Us</span>
          </Link>

          {currentUser?.role === "admin" && (
            <Link
              href="/admin"
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                pathname.startsWith("/admin")
                  ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/40"
              }`}
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </Link>
          )}

          {currentUser?.role === "consignor" && (
            <Link
              href="/consignor"
              className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                pathname.startsWith("/consignor")
                  ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                  : "text-neutral-300 hover:text-white hover:bg-neutral-800/40"
              }`}
            >
              <UserCheck className="w-4 h-4 text-purple-400" />
              <span>Consignor Portal</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </Link>
          )}

          <Link
            href="/"
            className={`px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
              pathname === "/"
                ? "bg-rose-950/60 text-rose-300 border border-rose-800/40"
                : "text-neutral-300 hover:text-white hover:bg-neutral-800/40"
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-rose-400" />
            <span>Profile</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
