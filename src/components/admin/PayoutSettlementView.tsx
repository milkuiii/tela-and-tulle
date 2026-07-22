"use client";

import React from "react";
import { useAppStore } from "@/lib/store";
import { PayoutStatus } from "@/types/database";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { format, parseISO } from "date-fns";

export function PayoutSettlementView() {
  const { payouts, updatePayoutStatus } = useAppStore();

  const totalUnpaid = payouts
    .filter((p) => p.status === "unpaid")
    .reduce((sum, p) => sum + Number(p.total_due), 0);

  const totalPaid = payouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + Number(p.total_due), 0);

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-5 text-white flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-400 font-semibold block">
              Total Pending Unpaid Payouts
            </span>
            <span className="font-sans text-3xl font-bold text-white mt-1 block">
              ₱{totalUnpaid.toFixed(2)}
            </span>
          </div>
          <div className="p-3 bg-amber-950/60 border border-amber-800/60 rounded-2xl">
            <Clock className="w-6 h-6 text-amber-400" />
          </div>
        </div>

        <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-5 text-white flex items-center justify-between shadow-xl">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
              Total Settled Historical Payouts
            </span>
            <span className="font-sans text-3xl font-bold text-white mt-1 block">
              ₱{totalPaid.toFixed(2)}
            </span>
          </div>
          <div className="p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 shadow-xl text-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#2E2A32]">
          <div className="flex items-center gap-2 font-sans text-lg font-bold text-rose-200">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <span>Monthly Consignor Payout Settlement UI</span>
          </div>
          <span className="text-xs text-neutral-400">
            Review compiled monthly earnings and toggle status to mark as
            issued.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#121013] border-b border-[#2E2A32] uppercase text-[10px] text-rose-300">
              <tr>
                <th className="py-3.5 px-4">Payout Month</th>
                <th className="py-3.5 px-4">Consignor Name</th>
                <th className="py-3.5 px-4">Total Compiled Earnings</th>
                <th className="py-3.5 px-4">Payout Status</th>
                <th className="py-3.5 px-4">Payment Timestamp</th>
                <th className="py-3.5 px-4 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2E2A32]">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-[#252129] transition">
                  <td className="py-3.5 px-4 font-mono font-semibold text-white">
                    {format(parseISO(p.payout_month), "MMMM yyyy")}
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="font-semibold text-rose-200">
                      {p.consignor?.full_name || "Consignor"}
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      {p.consignor?.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-sm font-bold text-white">
                    ₱{Number(p.total_due).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {p.status === "paid" ? (
                      <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                        ✓ PAID
                      </span>
                    ) : (
                      <span className="bg-amber-950 text-amber-300 border border-amber-800 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                        UNPAID
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-neutral-400">
                    {p.paid_at
                      ? format(parseISO(p.paid_at), "PPP p")
                      : "Pending Release"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === "unpaid" ? (
                      <button
                        onClick={() => updatePayoutStatus(p.id, "paid")}
                        className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 font-semibold px-3 py-1.5 rounded-xl text-xs transition shadow-md"
                      >
                        Mark as PAID
                      </button>
                    ) : (
                      <button
                        onClick={() => updatePayoutStatus(p.id, "unpaid")}
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 px-2.5 py-1 rounded-xl text-[10px] transition"
                      >
                        Revert to UNPAID
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
