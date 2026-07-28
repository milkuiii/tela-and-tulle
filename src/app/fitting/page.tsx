"use client";

import React from "react";
import Link from "next/link";
import { useAppStore } from "@/lib/store";
import { calculateConsignorEarnings } from "@/lib/pricing";
import {
  UserCheck,
  DollarSign,
  Package,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export default function FittingPage() {
  const { currentUser, users, setCurrentUser, inventory, rentals, payouts } =
    useAppStore();

  const isConsignor = currentUser?.role === "consignor";
}
