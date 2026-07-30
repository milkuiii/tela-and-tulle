"use client";

import React from "react";
import Image from "next/image";
import LogoImage from "@/public/logo-dark.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import {
  Shield,
  UserCheck,
  Clock,
  ShoppingBag,
  Home,
  HeartHandshake,
  User,
  LogOut,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { currentUser, logout, triggerLateCheckCron } = useAppStore();

  const navLinks = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/catalog", label: "Catalog", icon: ShoppingBag },
    { href: "/fitting", label: "Fitting", icon: Crown},
    { href: "/lend-with-us", label: "Lend With Us", icon: HeartHandshake },
    ...(currentUser ? [{ href: "/profile", label: "Profile", icon: User }] : []),
  ];

  return (
    <header className="sticky top-5 rounded-full z-50 w-full bg-[#FFEEEE]/80 backdrop-blur-md border border-white/50 shadow-glass overflow-hidden">
      {/* Top Utility Bar */}
      <div className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 px-3 py-2 text-xs flex items-center justify-between gap-2 text-[#2D1A22]/70 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
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
          <button
            onClick={async () => {
              await triggerLateCheckCron();
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
      </div> */}

      {/* Main Header Nav */}
      <div className="px-3 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
        {/* Brand */}
        <Link href="/home" className="flex flex-col group shrink-0">
          {/* <span className="font-display text-xl sm:text-2xl text-[#B32F4E] font-bold group-hover:text-[#8D2040] transition">
            tela&tulle
          </span> */}
          <Image src={LogoImage} alt="Tela & Tulle Logo" className="w-auto h-12 aspect-auto" />
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

          {!currentUser ? (
            <Link
              href="/login"
              title="Login / Sign Up"
              className={`px-3 py-2 ml-1 rounded-lg transition flex items-center gap-1.5 font-semibold bg-[#B32F4E] text-white hover:bg-[#8D2040] shadow-sm shadow-[#B32F4E]/20 hover:-translate-y-0.5 active:translate-y-0`}
            >
              <User className="w-4 h-4 shrink-0 text-white" />
              <span className="hidden sm:inline">Login / Sign Up</span>
            </Link>
          ) : (
            <button
              onClick={() => logout()}
              title="Logout"
              className={`px-3 py-2 ml-1 rounded-lg transition flex items-center gap-1.5 font-semibold bg-white border border-[#FFB5BD] text-[#B32F4E] hover:bg-[#FFEEEE] shadow-sm hover:-translate-y-0.5 active:translate-y-0`}
            >
              <LogOut className="w-4 h-4 shrink-0 text-[#B32F4E]" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
