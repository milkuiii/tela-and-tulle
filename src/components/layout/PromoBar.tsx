"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import LogoImage from "@/public/logo-dark-var2.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";

export function PromoBar() {
    const promos = [
        "Get 10% off when you book early! Promo automatically applied at checkout.",
        "Post us and get P50.00 off your next rental!"
    ];

    const [currentPromoIndex, setCurrentPromoIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPromoIndex((prevIndex) => (prevIndex + 1) % promos.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [promos.length]);

    return (
        <div className="fixed top-0 left-0 w-full bg-[#B32F4E] text-white text-sm font-semibold z-[60] py-2 px-4 flex justify-center items-center">
            <p className="text-center animate-fade-in transition-opacity duration-500">
                {promos[currentPromoIndex]}
            </p>
        </div>
    );
}