"use client";

import React, { useState } from "react";
import Image from "next/image";
import LogoImage from "@/public/logo-dark-var2.png";
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
  Crown,
  Menu,
  X,
} from "lucide-react";

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { currentUser, logout, triggerLateCheckCron } = useAppStore();

  const navLinks = [
    { href: "/home", label: "Home", icon: Home },
    { href: "/catalog", label: "Catalog", icon: ShoppingBag },
    {
      href: "https://calendar.app.google/xs5EftF93um84CuMA",
      label: "Fitting",
      icon: Crown,
      isExternal: true,
    },
    { href: "/lend-with-us", label: "Lend With Us", icon: HeartHandshake },
    ...(currentUser
      ? [{ href: "/profile", label: "Profile", icon: User }]
      : []),
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  const renderNavLinks = (isMobile = false) => {
    return (
      <>
        {navLinks.map((item) => {
          const { href, label, icon: Icon, isExternal } = item;
          const isActive =
            pathname === href ||
            (href !== "/home" && pathname.startsWith(href));

          const navItemClasses = `px-2 lg:px-3 py-2 rounded-lg transition flex items-center gap-2 ${
            isActive
              ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
              : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
          }`;

          if (isExternal) {
            return (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                title={label}
                className={navItemClasses}
                onClick={closeMenu}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? "text-[#B32F4E]" : "text-[#2D1A22]/50"
                  }`}
                />
                <span className={isMobile ? "inline" : "hidden lg:inline"}>
                  {label}
                </span>
              </a>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={navItemClasses}
              onClick={closeMenu}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-[#B32F4E]" : "text-[#2D1A22]/50"
                }`}
              />
              <span className={isMobile ? "inline" : "hidden lg:inline"}>
                {label}
              </span>
            </Link>
          );
        })}

        {currentUser?.role === "admin" && (
          <Link
            href="/admin"
            title="Admin Portal"
            onClick={closeMenu}
            className={`px-2 lg:px-3 py-2 rounded-lg transition flex items-center gap-2 ${
              pathname.startsWith("/admin")
                ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
            }`}
          >
            <Shield className="w-4 h-4 text-[#8D9A2E] shrink-0" />
            <span className={isMobile ? "inline" : "hidden lg:inline"}>
              Admin Portal
            </span>
            <span className="w-2 h-2 rounded-full bg-[#8D9A2E] animate-pulse"></span>
          </Link>
        )}

        {currentUser?.role === "consignor" && (
          <Link
            href="/consignor"
            title="Consignor Portal"
            onClick={closeMenu}
            className={`px-2 lg:px-3 py-2 rounded-lg transition flex items-center gap-2 ${
              pathname.startsWith("/consignor")
                ? "bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/25"
                : "text-[#2D1A22]/60 hover:text-[#B32F4E] hover:bg-[#FFB5BD]/20"
            }`}
          >
            <UserCheck className="w-4 h-4 text-[#8D9A2E] shrink-0" />
            <span className={isMobile ? "inline" : "hidden lg:inline"}>
              Consignor Portal
            </span>
            <span className="w-2 h-2 rounded-full bg-[#8D9A2E] animate-pulse"></span>
          </Link>
        )}

        {!currentUser ? (
          <Link
            href="/login"
            title="Login / Sign Up"
            onClick={closeMenu}
            className={`px-3 lg:px-4 py-2 mt-2 md:mt-0 md:ml-1 rounded-lg transition flex items-center justify-center gap-2 font-semibold bg-[#B32F4E] text-white hover:bg-[#8D2040] shadow-sm shadow-[#B32F4E]/20 hover:-translate-y-0.5 active:translate-y-0`}
          >
            <User className="w-4 h-4 shrink-0 text-white" />
            <span className={isMobile ? "inline" : "hidden lg:inline"}>
              Login / Sign Up
            </span>
          </Link>
        ) : (
          <button
            onClick={() => {
              logout();
              closeMenu();
            }}
            title="Logout"
            className={`px-3 lg:px-4 py-2 mt-2 md:mt-0 md:ml-1 rounded-lg transition flex items-center justify-center gap-2 font-semibold bg-white border border-[#FFB5BD] text-[#B32F4E] hover:bg-[#FFEEEE] shadow-sm hover:-translate-y-0.5 active:translate-y-0 w-full md:w-auto`}
          >
            <LogOut className="w-4 h-4 shrink-0 text-[#B32F4E]" />
            <span className={isMobile ? "inline" : "hidden lg:inline"}>
              Logout
            </span>
          </button>
        )}
      </>
    );
  };

  return (
    <header className="sticky top-5 z-50 w-full">
      <div className="bg-[#FFEEEE]/90 backdrop-blur-md border border-white/50 shadow-glass rounded-full overflow-hidden">
        {/* Top Utility Bar */}
        {/* <div className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 px-4 py-2 text-xs flex items-center justify-between gap-2 text-[#2D1A22]/70 overflow-x-auto">
          <div className="flex items-center gap-2 shrink-0">
            <span className="hidden md:inline text-[#2D1A22]/50 whitespace-nowrap">
              Active:{" "}
              <strong className="text-[#2D1A22] font-semibold">
                {currentUser
                  ? `${currentUser.full_name} (${currentUser.role.toUpperCase()})`
                  : "Guest"}
              </strong>
            </span>
            <span className="md:hidden text-[#2D1A22]/50 whitespace-nowrap">
              {currentUser ? currentUser.full_name : "Guest"}
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

        {/* 
        TODO: Implement a hamburger menu for mobile view that includes the same links as the desktop navigation. The mobile menu should slide down from the top and cover the content below it, with a semi-transparent background. It should also include a close button to hide the menu when not needed.
         */}

        {/* Main Header Nav */}
        <div className="px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-2">
          {/* Brand */}
          <Link
            href="/home"
            className="flex flex-col group shrink-0"
            onClick={closeMenu}
          >
            <Image
              src={LogoImage}
              alt="Tela & Tulle Logo"
              className="w-auto h-10 sm:h-12 aspect-auto"
            />
            <span className="text-[8px] sm:text-[9px] uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[#8D9A2E] font-medium hidden xs:block">
              Keeping style sustainable and accessible.
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-0.5 text-sm font-medium">
            {renderNavLinks()}
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-[#B32F4E] hover:bg-[#FFB5BD]/20 rounded-lg transition"
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-[calc(100%+0.5rem)] left-0 w-full bg-[#FFEEEE]/95 backdrop-blur-xl border border-white/50 shadow-lg rounded-3xl overflow-hidden z-50">
          <nav className="flex flex-col p-4 gap-2 text-sm font-medium max-h-[70vh] overflow-y-auto">
            {renderNavLinks(true)}
          </nav>
        </div>
      )}
    </header>
  );
}
