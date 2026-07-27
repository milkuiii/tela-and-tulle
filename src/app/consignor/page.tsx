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

export default function ConsignorDashboardPage() {
  const { currentUser, users, setCurrentUser, inventory, rentals, payouts } =
    useAppStore();

  const isConsignor = currentUser?.role === "consignor";

  if (!isConsignor) {
    return (
      <div className="max-w-2xl mx-auto my-12 bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 text-center text-[#2D1A22] space-y-4 shadow-glass">
        <div className="w-16 h-16 bg-[#8D9A2E]/10 border border-[#8D9A2E]/30 rounded-full flex items-center justify-center mx-auto text-[#8D9A2E]">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-display text-2xl font-bold text-[#B32F4E]">
          Consignor Portal Restricted
        </h2>
        <p className="text-xs text-[#2D1A22]/50 leading-relaxed max-w-md mx-auto">
          This portal is reserved strictly for authorized consignor partners to
          view their private inventory ledgers and payout statements.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="bg-[#B32F4E] hover:bg-[#8D2040] text-white px-4 py-2 rounded-xl text-xs font-semibold transition shadow-wine-glow"
          >
            Return to Customer Catalog
          </Link>
        </div>
      </div>
    );
  }

  const consignorUser = currentUser;
  const activeConsignorId = consignorUser.id;

  // Helper to switch demo consignor
  const selectConsignor = (id: string) => {
    const target = users.find((u) => u.id === id);
    if (target) setCurrentUser(target);
  };

  // 1. DATA ISOLATION: Filter ONLY items owned by active consignor!
  const ownedInventory = inventory.filter(
    (item) => item.owner_id === activeConsignorId,
  );
  const ownedItemIds = ownedInventory.map((i) => i.id);

  // 2. Filter rentals for owned items
  const ownedRentals = rentals.filter((r) => ownedItemIds.includes(r.dress_id));

  // 3. Rental History count: completed lifecycle ('returned' or 'out')
  const completedRentalCount = ownedRentals.filter((r) =>
    ["returned", "out"].includes(r.status),
  ).length;

  // 4. Dynamic Payout Ledger calculation according to formula in instructions.md:
  // (base_rental_price + extension_rate_daily * extra_days) * snapshot_commission_rate
  // for all completed or ongoing rentals where amount_paid matches amount_due. Security deposits strictly excluded.
  const qualifyingRentals = ownedRentals.filter(
    (r) =>
      ["returned", "out"].includes(r.status) && r.amount_paid >= r.amount_due,
  );

  const totalCalculatedLedgerEarnings = qualifyingRentals.reduce(
    (sum, rental) => {
      const dress = ownedInventory.find((i) => i.id === rental.dress_id);
      if (!dress) return sum;
      return sum + calculateConsignorEarnings(rental, dress);
    },
    0,
  );

  // 5. Payout History filtered by consignor_id
  const ownedPayouts = payouts.filter(
    (p) => p.consignor_id === activeConsignorId,
  );

  const totalPaidOut = ownedPayouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.total_due), 0);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner & Demo Consignor Switcher */}
      <section className="relative bg-gradient-to-r from-[#FFEEEE] via-[#F4F7CD] to-[#FFEEEE] border border-[#FFB5BD]/40 rounded-3xl p-8 shadow-glass overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-[#8D9A2E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8D9A2E]/10 border border-[#8D9A2E]/30 text-xs text-[#8D9A2E] font-semibold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" /> Consignor Financial Portal
            </div>

            <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#B32F4E]">
              Private Consignment Dashboard
            </h1>

            <p className="text-[#2D1A22]/60 text-xs sm:text-sm max-w-2xl">
              Strict data isolation for{" "}
              <strong className="text-[#2D1A22]">
                {consignorUser?.full_name || "Consignor Partner"}
              </strong>
              . Track your active gowns, rental lifecycle history, dynamically
              snapshot commission payouts, and historical settlement receipts.
            </p>
          </div>

          {/* Consignor Selector dropdown for testing */}
          <div className="bg-white/60 backdrop-blur-sm border border-[#FFB5BD]/50 p-4 rounded-2xl space-y-2 text-xs text-[#2D1A22]/70">
            <div className="flex items-center gap-1.5 font-semibold text-[#B32F4E]">
              <Lock className="w-3.5 h-3.5 text-[#8D9A2E]" /> Active Consignor
              Identity:
            </div>
            <select
              value={activeConsignorId || ""}
              onChange={(e) => selectConsignor(e.target.value)}
              className="glass-input text-[#2D1A22] rounded-xl px-3 py-2 text-xs w-full cursor-pointer"
            >
              {users
                .filter((u) => u.role === "consignor")
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    👗 {c.full_name} ({c.email})
                  </option>
                ))}
            </select>
          </div>
        </div>
      </section>

      {/* Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Portfolio Items */}
        <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-5 text-[#2D1A22] shadow-glass flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#2D1A22]/50 font-semibold block">
              Consigned Gowns
            </span>
            <span className="font-sans text-3xl font-bold text-[#2D1A22] mt-1 block">
              {ownedInventory.length}
            </span>
            <span className="text-[10px] text-[#8D9A2E]">
              Isolated to your account
            </span>
          </div>
          <div className="p-3 bg-[#8D9A2E]/10 border border-[#8D9A2E]/30 rounded-2xl">
            <Package className="w-6 h-6 text-[#8D9A2E]" />
          </div>
        </div>

        {/* Completed Lifecycle Rentals */}
        <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-5 text-[#2D1A22] shadow-glass flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#2D1A22]/50 font-semibold block">
              Completed Rentals
            </span>
            <span className="font-sans text-3xl font-bold text-[#2D1A22] mt-1 block">
              {completedRentalCount}
            </span>
            <span className="text-[10px] text-emerald-600">
              'Out' or 'Returned' count
            </span>
          </div>
          <div className="p-3 bg-emerald-50 border border-emerald-300/50 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-emerald-500" />
          </div>
        </div>

        {/* Compiled Ledger Earnings */}
        <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-5 text-[#2D1A22] shadow-glass flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#B32F4E] font-semibold block">
              Compiled Payout Ledger
            </span>
            <span className="font-sans text-3xl font-bold text-[#2D1A22] mt-1 block">
              ₱{totalCalculatedLedgerEarnings.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#2D1A22]/40">
              Excludes deposits & unpaid
            </span>
          </div>
          <div className="p-3 bg-[#B32F4E]/10 border border-[#B32F4E]/25 rounded-2xl">
            <DollarSign className="w-6 h-6 text-[#B32F4E]" />
          </div>
        </div>

        {/* Total Historical Paid Out */}
        <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-5 text-[#2D1A22] shadow-glass flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#8D9A2E] font-semibold block">
              Released Payouts
            </span>
            <span className="font-sans text-3xl font-bold text-[#2D1A22] mt-1 block">
              ₱{totalPaidOut.toFixed(2)}
            </span>
            <span className="text-[10px] text-[#2D1A22]/40">
              Settled to your account
            </span>
          </div>
          <div className="p-3 bg-[#8D9A2E]/10 border border-[#8D9A2E]/30 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-[#8D9A2E]" />
          </div>
        </div>
      </div>

      {/* Consigned Gowns Catalog Section */}
      <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass text-[#2D1A22] space-y-4">
        <h3 className="font-display text-lg font-bold text-[#B32F4E] border-b border-[#FFB5BD]/40 pb-3">
          Your Consigned Wardrobe Portfolio ({ownedInventory.length})
        </h3>

        {ownedInventory.length === 0 ? (
          <p className="text-xs text-[#2D1A22]/30 py-4">
            No dresses currently listed under your consignor account.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedInventory.map((item) => (
              <div
                key={item.id}
                className="bg-white/55 backdrop-blur-sm border border-[#FFB5BD]/40 rounded-xl p-4 space-y-2 text-xs hover:shadow-soft transition"
              >
                <div className="font-display font-bold text-sm text-[#B32F4E]">
                  {item.name}
                </div>
                <div className="text-[#2D1A22]/50">
                  Color: {item.color} • Size {item.size}
                </div>
                <div className="text-[#2D1A22]/50 font-mono">
                  Base 2-Day Rate: ₱{item.base_rental_price} | Deposit: ₱
                  {item.security_deposit}
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-[#FFB5BD]/30">
                  <span className="text-[10px] text-[#2D1A22]/30">
                    Retail Value: ₱{item.retail_price}
                  </span>
                  {item.status === "active" ? (
                    <span className="bg-[#8D9A2E]/10 text-[#6D7A1E] text-[10px] px-2 py-0.5 rounded font-semibold border border-[#8D9A2E]/30">
                      Active
                    </span>
                  ) : (
                    <span className="bg-white/60 text-[#2D1A22]/30 text-[10px] px-2 py-0.5 rounded font-semibold border border-[#FFB5BD]/40">
                      Archived
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dynamic Payout Ledger Table */}
      <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass text-[#2D1A22] space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#FFB5BD]/40 pb-3">
          <div>
            <h3 className="font-display text-lg font-bold text-[#B32F4E]">
              Expected & Completed Rental Payout Ledger
            </h3>
            <p className="text-xs text-[#2D1A22]/50">
              Calculated as:{" "}
              <code className="bg-white/60 px-1.5 py-0.5 rounded text-[#B32F4E] font-mono border border-[#FFB5BD]/40">
                (base_rental_price + extension_fees) * snapshot_commission_rate
              </code>
              . Security deposits and unpaid booking amounts are strictly
              excluded.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D1A22]/70">
            <thead className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 uppercase text-[10px] text-[#B32F4E] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Rental ID / Dress</th>
                <th className="py-3 px-4">Rental Dates</th>
                <th className="py-3 px-4">Rental Subtotal (Excl. Deposit)</th>
                <th className="py-3 px-4">Commission Snapshot</th>
                <th className="py-3 px-4">Your Calculated Payout</th>
                <th className="py-3 px-4">Payment Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFB5BD]/30">
              {ownedRentals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-[#2D1A22]/25">
                    No rental activity recorded for your consigned items yet.
                  </td>
                </tr>
              ) : (
                ownedRentals.map((r) => {
                  const dress = ownedInventory.find((i) => i.id === r.dress_id);
                  const earnings = dress
                    ? calculateConsignorEarnings(r, dress)
                    : 0;
                  const isEligible =
                    ["returned", "out"].includes(r.status) &&
                    r.amount_paid >= r.amount_due;
                  const snapshotPct = (r.snapshot_commission_rate ?? 0.5) * 100;

                  return (
                    <tr key={r.id} className="hover:bg-[#FFB5BD]/10 transition">
                      <td className="py-3.5 px-4 font-medium text-[#2D1A22] space-y-0.5">
                        <div>{dress?.name || "Dress Item"}</div>
                        <div className="text-[10px] text-[#2D1A22]/30 font-mono">
                          ID: {r.id.slice(0, 8)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#2D1A22]/60">
                        {r.start_date} to {r.end_date}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-[#2D1A22]">
                        ₱
                        {(
                          Number(r.amount_due) - Number(r.deposit_paid)
                        ).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-[#B32F4E]/10 border border-[#B32F4E]/25 text-[#B32F4E] px-2 py-0.5 rounded text-[11px] font-mono">
                          {snapshotPct.toFixed(0)}% Rate
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-sm font-bold text-[#8D9A2E]">
                        ₱{earnings.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isEligible ? (
                          <span className="bg-[#8D9A2E]/10 text-[#6D7A1E] border border-[#8D9A2E]/35 px-2 py-0.5 rounded text-[10px] font-semibold">
                            ✓ Eligible Payout
                          </span>
                        ) : (
                          <span className="bg-amber-50 text-amber-700 border border-amber-300/60 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Pending Return / Payment
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Historical Released Payments Ledger */}
      <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass text-[#2D1A22] space-y-4">
        <h3 className="font-display text-lg font-bold text-[#B32F4E] border-b border-[#FFB5BD]/40 pb-3">
          Historical Monthly Payment Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D1A22]/70">
            <thead className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 uppercase text-[10px] text-[#B32F4E] font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Payout Month</th>
                <th className="py-3 px-4">Compiled Total Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Release Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFB5BD]/30">
              {ownedPayouts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-[#2D1A22]/25">
                    No historical payout entries found.
                  </td>
                </tr>
              ) : (
                ownedPayouts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#FFB5BD]/10 transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-[#2D1A22]">
                      {format(parseISO(p.payout_month), "MMMM yyyy")}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-sm font-bold text-[#2D1A22]">
                      ₱{Number(p.total_due).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === "paid" ? (
                        <span className="bg-[#8D9A2E]/10 text-[#6D7A1E] border border-[#8D9A2E]/35 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                          RELEASED & PAID
                        </span>
                      ) : (
                        <span className="bg-amber-50 text-amber-700 border border-amber-300/60 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                          UNPAID
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#2D1A22]/40">
                      {p.paid_at
                        ? format(parseISO(p.paid_at), "PPP p")
                        : "Pending Release"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
