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
      <div className="max-w-2xl mx-auto my-12 bg-[#1C191E] border border-[#2E2A32] rounded-3xl p-8 text-center text-white space-y-4 shadow-2xl">
        <div className="w-16 h-16 bg-purple-950/80 border border-purple-800/60 rounded-full flex items-center justify-center mx-auto text-purple-300">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="font-sans text-2xl font-bold text-rose-100">
          Consignor Portal Restricted
        </h2>
        <p className="text-xs text-neutral-400 leading-relaxed max-w-md mx-auto">
          This portal is reserved strictly for authorized consignor partners to
          view their private inventory ledgers and payout statements.
        </p>
        <div className="pt-2 flex justify-center gap-3">
          <Link
            href="/"
            className="bg-rose-900 hover:bg-rose-800 text-rose-100 px-4 py-2 rounded-xl text-xs font-semibold transition"
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
      <section className="relative bg-gradient-to-r from-[#1C191E] via-[#1E122A] to-[#1C191E] border border-[#2E2A32] rounded-3xl p-8 text-white shadow-2xl">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800/60 text-xs text-purple-300 font-semibold uppercase tracking-wider">
              <UserCheck className="w-3.5 h-3.5" /> Consignor Financial Portal
            </div>

            <h1 className="font-sans text-3xl sm:text-4xl font-bold text-rose-100">
              Private Consignment Dashboard
            </h1>

            <p className="text-neutral-300 text-xs sm:text-sm max-w-2xl">
              Strict data isolation for{" "}
              <strong className="text-white">
                {consignorUser?.full_name || "Consignor Partner"}
              </strong>
              . Track your active gowns, rental lifecycle history, dynamically
              snapshot commission payouts, and historical settlement receipts.
            </p>
          </div>

          {/* Consignor Selector dropdown for testing */}
          <div className="bg-[#121013] border border-[#2E2A32] p-4 rounded-2xl space-y-2 text-xs text-neutral-300">
            <div className="flex items-center gap-1.5 font-semibold text-rose-300">
              <Lock className="w-3.5 h-3.5 text-purple-400" /> Active Consignor
              Identity:
            </div>
            <select
              value={activeConsignorId || ""}
              onChange={(e) => selectConsignor(e.target.value)}
              className="bg-[#2E2A32] text-white border border-neutral-700 rounded-xl px-3 py-2 text-xs w-full focus:outline-none focus:border-rose-500 cursor-pointer"
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
        <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-5 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
              Consigned Gowns
            </span>
            <span className="font-sans text-3xl font-bold text-white mt-1 block">
              {ownedInventory.length}
            </span>
            <span className="text-[10px] text-purple-300">
              Isolated to your account
            </span>
          </div>
          <div className="p-3 bg-purple-950/60 border border-purple-800/60 rounded-2xl">
            <Package className="w-6 h-6 text-purple-400" />
          </div>
        </div>

        {/* Completed Lifecycle Rentals */}
        <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-5 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-neutral-400 font-semibold block">
              Completed Rentals
            </span>
            <span className="font-sans text-3xl font-bold text-white mt-1 block">
              {completedRentalCount}
            </span>
            <span className="text-[10px] text-emerald-300">
              'Out' or 'Returned' count
            </span>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl">
            <TrendingUp className="w-6 h-6 text-emerald-400" />
          </div>
        </div>

        {/* Compiled Ledger Earnings */}
        <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-5 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-rose-300 font-semibold block">
              Compiled Payout Ledger
            </span>
            <span className="font-sans text-3xl font-bold text-white mt-1 block">
              ₱{totalCalculatedLedgerEarnings.toFixed(2)}
            </span>
            <span className="text-[10px] text-neutral-400">
              Excludes deposits & unpaid
            </span>
          </div>
          <div className="p-3 bg-rose-950/60 border border-rose-800/60 rounded-2xl">
            <DollarSign className="w-6 h-6 text-rose-400" />
          </div>
        </div>

        {/* Total Historical Paid Out */}
        <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-5 text-white shadow-xl flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
              Released Payouts
            </span>
            <span className="font-sans text-3xl font-bold text-white mt-1 block">
              ₱{totalPaidOut.toFixed(2)}
            </span>
            <span className="text-[10px] text-neutral-400">
              Settled to your account
            </span>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Consigned Gowns Catalog Section */}
      <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 shadow-xl text-white space-y-4">
        <h3 className="font-sans text-lg font-bold text-rose-200 border-b border-[#2E2A32] pb-3">
          Your Consigned Wardrobe Portfolio ({ownedInventory.length})
        </h3>

        {ownedInventory.length === 0 ? (
          <p className="text-xs text-neutral-500 py-4">
            No dresses currently listed under your consignor account.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedInventory.map((item) => (
              <div
                key={item.id}
                className="bg-[#121013] border border-[#2E2A32] rounded-xl p-4 space-y-2 text-xs"
              >
                <div className="font-sans font-bold text-sm text-white">
                  {item.name}
                </div>
                <div className="text-neutral-400">
                  Color: {item.color} • Size {item.size}
                </div>
                <div className="text-neutral-400 font-mono">
                  Base 2-Day Rate: ₱{item.base_rental_price} | Deposit: ₱
                  {item.security_deposit}
                </div>
                <div className="pt-2 flex justify-between items-center border-t border-[#2E2A32]">
                  <span className="text-[10px] text-neutral-500">
                    Retail Value: ₱{item.retail_price}
                  </span>
                  {item.status === "active" ? (
                    <span className="bg-emerald-950 text-emerald-300 text-[10px] px-2 py-0.5 rounded font-semibold border border-emerald-800">
                      Active
                    </span>
                  ) : (
                    <span className="bg-neutral-800 text-neutral-400 text-[10px] px-2 py-0.5 rounded font-semibold">
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
      <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 shadow-xl text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2E2A32] pb-3">
          <div>
            <h3 className="font-sans text-lg font-bold text-rose-200">
              Expected & Completed Rental Payout Ledger
            </h3>
            <p className="text-xs text-neutral-400">
              Calculated as:{" "}
              <code className="bg-[#121013] px-1.5 py-0.5 rounded text-rose-300 font-mono">
                (base_rental_price + extension_fees) * snapshot_commission_rate
              </code>
              . Security deposits and unpaid booking amounts are strictly
              excluded.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#121013] border-b border-[#2E2A32] uppercase text-[10px] text-rose-300">
              <tr>
                <th className="py-3 px-4">Rental ID / Dress</th>
                <th className="py-3 px-4">Rental Dates</th>
                <th className="py-3 px-4">Rental Subtotal (Excl. Deposit)</th>
                <th className="py-3 px-4">Commission Snapshot</th>
                <th className="py-3 px-4">Your Calculated Payout</th>
                <th className="py-3 px-4">Payment Eligibility</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2A32]">
              {ownedRentals.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-neutral-500">
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
                    <tr key={r.id} className="hover:bg-[#252129] transition">
                      <td className="py-3.5 px-4 font-medium text-white space-y-0.5">
                        <div>{dress?.name || "Dress Item"}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">
                          ID: {r.id.slice(0, 8)}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-[11px] text-neutral-300">
                        {r.start_date} to {r.end_date}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-semibold text-white">
                        ₱
                        {(
                          Number(r.amount_due) - Number(r.deposit_paid)
                        ).toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="bg-rose-950 border border-rose-800 text-rose-300 px-2 py-0.5 rounded text-[11px] font-mono">
                          {snapshotPct.toFixed(0)}% Rate
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-sm font-bold text-emerald-400">
                        ₱{earnings.toFixed(2)}
                      </td>
                      <td className="py-3.5 px-4">
                        {isEligible ? (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[10px] font-semibold">
                            ✓ Eligible Payout
                          </span>
                        ) : (
                          <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded text-[10px] font-semibold">
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
      <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 shadow-xl text-white space-y-4">
        <h3 className="font-sans text-lg font-bold text-rose-200 border-b border-[#2E2A32] pb-3">
          Historical Monthly Payment Receipts
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#121013] border-b border-[#2E2A32] uppercase text-[10px] text-rose-300">
              <tr>
                <th className="py-3 px-4">Payout Month</th>
                <th className="py-3 px-4">Compiled Total Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Release Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2A32]">
              {ownedPayouts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-neutral-500">
                    No historical payout entries found.
                  </td>
                </tr>
              ) : (
                ownedPayouts.map((p) => (
                  <tr key={p.id} className="hover:bg-[#252129] transition">
                    <td className="py-3.5 px-4 font-mono font-semibold text-white">
                      {format(parseISO(p.payout_month), "MMMM yyyy")}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-sm font-bold text-white">
                      ₱{Number(p.total_due).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-4">
                      {p.status === "paid" ? (
                        <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                          RELEASED & PAID
                        </span>
                      ) : (
                        <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-0.5 rounded-full text-[10px] font-semibold">
                          UNPAID
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[10px] text-neutral-400">
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
