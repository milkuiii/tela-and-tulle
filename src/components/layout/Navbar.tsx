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
  HeartHandshake,
  User,
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

  const navLinks = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/catalog", label: "Catalog", icon: ShoppingBag },
    { href: "/lend-with-us", label: "Lend With Us", icon: HeartHandshake },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <header className="sticky top-5 rounded-full z-50 w-full bg-[#FFEEEE]/80 backdrop-blur-md border border-white/50 shadow-glass overflow-hidden">
      {/* Top Demo Bar */}
      <div className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 px-3 py-2 text-xs flex items-center justify-between gap-2 text-[#2D1A22]/70 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25 whitespace-nowrap">
            <Sparkles className="w-3 h-3 mr-1 text-[#B32F4E]" /> DEMO
          </span>
          <span className="hidden md:inline text-[#2D1A22]/50 whitespace-nowrap">
            Active:{" "}
            <strong className="text-[#2D1A22] font-semibold">
              {currentUser
                ? `${currentUser.full_name} (${currentUser.role.toUpperCase()})`
                : "Guest"}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <select
            id="role-select"
            value={currentUser ? currentUser.id : "guest"}
            onChange={handleRoleChange}
            className="bg-white/70 text-[#2D1A22] text-xs px-2 py-1 rounded border border-[#FFB5BD]/60 focus:outline-none focus:border-[#B32F4E] cursor-pointer transition max-w-[160px] sm:max-w-none"
          >
            <option value="guest">Public Guest</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.role === "admin" ? "👑" : "👗"} {u.full_name}
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
            className="flex items-center gap-1 bg-[#F4F7CD] hover:bg-[#E8EDAA] text-[#8D9A2E] border border-[#8D9A2E]/30 px-2 py-1 rounded text-xs transition shadow-sm shrink-0"
            title="Simulates the 8:00 PM daily automation trigger"
          >
            <Clock className="w-3.5 h-3.5 text-[#8D9A2E]" />
            <span className="hidden sm:inline">8 PM Cron</span>
          </button>
        </div>
      </div>

      {/* Main Header Nav */}
      <div className="px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand */}
        <Link href="/home" className="flex flex-col group shrink-0">
          <span className="font-display text-xl sm:text-2xl text-[#B32F4E] font-bold group-hover:text-[#8D2040] transition">
            tela&tulle
          </span>
          <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#8D9A2E] font-medium hidden xs:block">
            Keeping style sustainable and accessible.
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center gap-0.5 sm:gap-1 text-sm font-medium">
          {navLinks.map(({ href, label, icon: Icon }) => {
            const isActive =
              pathname === href ||
              (href !== "/home" && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                title={label}
                className={`px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                    : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${isActive ? "text-[#B32F4E]" : "text-[#2D1A22]/50"}`}
                />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          {currentUser?.role === "admin" && (
            <Link
              href="/admin"
              title="Admin Portal"
              className={`px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                pathname.startsWith("/admin")
                  ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                  : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
              }`}
            >
              <Shield className="w-4 h-4 text-[#8D9A2E] shrink-0" />
              <span className="hidden sm:inline">Admin Portal</span>
              <span className="w-2 h-2 rounded-full bg-[#8D9A2E] animate-pulse"></span>
            </Link>
          )}

          {currentUser?.role === "consignor" && (
            <Link
              href="/consignor"
              title="Consignor Portal"
              className={`px-2 sm:px-3 py-2 rounded-lg transition flex items-center gap-1.5 ${
                pathname.startsWith("/consignor")
                  ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                  : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
              }`}
            >
              <UserCheck className="w-4 h-4 text-[#8D9A2E] shrink-0" />
              <span className="hidden sm:inline">Consignor Portal</span>
              <span className="w-2 h-2 rounded-full bg-[#8D9A2E] animate-pulse"></span>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
