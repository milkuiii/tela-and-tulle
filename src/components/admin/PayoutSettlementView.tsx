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
        <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-5 text-[#2D1A22] flex items-center justify-between shadow-glass">
          <div>
            <span className="text-xs uppercase tracking-wider text-amber-600 font-semibold block">
              Total Pending Unpaid Payouts
            </span>
            <span className="font-sans text-3xl font-bold text-[#2D1A22] mt-1 block">
              ₱{totalUnpaid.toFixed(2)}
            </span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-300/50 rounded-2xl">
            <Clock className="w-6 h-6 text-amber-500" />
          </div>
        </div>

        <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-5 text-[#2D1A22] flex items-center justify-between shadow-glass">
          <div>
            <span className="text-xs uppercase tracking-wider text-[#8D9A2E] font-semibold block">
              Total Settled Historical Payouts
            </span>
            <span className="font-sans text-3xl font-bold text-[#2D1A22] mt-1 block">
              ₱{totalPaid.toFixed(2)}
            </span>
          </div>
          <div className="p-3 bg-[#8D9A2E]/10 border border-[#8D9A2E]/30 rounded-2xl">
            <CheckCircle2 className="w-6 h-6 text-[#8D9A2E]" />
          </div>
        </div>
      </div>

      {/* Payouts Table */}
      <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass text-[#2D1A22] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#FFB5BD]/40">
          <div className="flex items-center gap-2 font-display text-lg font-bold text-[#B32F4E]">
            <DollarSign className="w-5 h-5 text-[#8D9A2E]" />
            <span>Monthly Consignor Payout Settlement UI</span>
          </div>
          <span className="text-xs text-[#2D1A22]/40">
            Review compiled monthly earnings and toggle status to mark as
            issued.
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#2D1A22]/70">
            <thead className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 uppercase text-[10px] text-[#B32F4E] font-semibold tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Payout Month</th>
                <th className="py-3.5 px-4">Consignor Name</th>
                <th className="py-3.5 px-4">Total Compiled Earnings</th>
                <th className="py-3.5 px-4">Payout Status</th>
                <th className="py-3.5 px-4">Payment Timestamp</th>
                <th className="py-3.5 px-4 text-right">Settlement Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#FFB5BD]/30">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-[#FFB5BD]/10 transition">
                  <td className="py-3.5 px-4 font-mono font-semibold text-[#2D1A22]">
                    {format(parseISO(p.payout_month), "MMMM yyyy")}
                  </td>
                  <td className="py-3.5 px-4 space-y-0.5">
                    <div className="font-semibold text-[#B32F4E]">
                      {p.consignor?.full_name || "Consignor"}
                    </div>
                    <div className="text-[10px] text-[#2D1A22]/40">
                      {p.consignor?.email}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-sm font-bold text-[#2D1A22]">
                    ₱{Number(p.total_due).toFixed(2)}
                  </td>
                  <td className="py-3.5 px-4">
                    {p.status === "paid" ? (
                      <span className="bg-[#8D9A2E]/10 text-[#6D7A1E] border border-[#8D9A2E]/35 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                        ✓ PAID
                      </span>
                    ) : (
                      <span className="bg-amber-50 text-amber-700 border border-amber-300/60 px-2.5 py-1 rounded-full text-[10px] font-semibold">
                        UNPAID
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[10px] text-[#2D1A22]/40">
                    {p.paid_at
                      ? format(parseISO(p.paid_at), "PPP p")
                      : "Pending Release"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {p.status === "unpaid" ? (
                      <button
                        onClick={() => updatePayoutStatus(p.id, "paid")}
                        className="bg-[#8D9A2E] hover:bg-[#6D7A1E] text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition shadow-sm"
                      >
                        Mark as PAID
                      </button>
                    ) : (
                      <button
                        onClick={() => updatePayoutStatus(p.id, "unpaid")}
                        className="bg-white/60 hover:bg-white/80 text-[#2D1A22]/40 border border-[#FFB5BD]/50 px-2.5 py-1 rounded-xl text-[10px] transition"
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
