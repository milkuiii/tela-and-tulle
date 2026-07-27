"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Rental, RentalStatus } from "@/types/database";
import { calculateDepositReturned } from "@/lib/pricing";
import {
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle,
  RefreshCw,
  DollarSign,
  Edit3,
  XCircle,
} from "lucide-react";

export function RentalOperationsTable() {
  const { rentals, updateRentalStatus, updateRentalPayment } = useAppStore();

  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [editingPaymentRental, setEditingPaymentRental] =
    useState<Rental | null>(null);

  // Payment edit modal state
  const [amountPaidInput, setAmountPaidInput] = useState<number>(0);
  const [depositPaidInput, setDepositPaidInput] = useState<number>(0);
  const [amountRetainedInput, setAmountRetainedInput] = useState<number>(0);

  const filteredRentals = rentals.filter((r) => {
    if (filterStatus === "all") return true;
    return r.status === filterStatus;
  });

  const openPaymentModal = (rental: Rental) => {
    setEditingPaymentRental(rental);
    setAmountPaidInput(rental.amount_paid);
    setDepositPaidInput(rental.deposit_paid);
    setAmountRetainedInput(rental.amount_retained);
  };

  const savePaymentDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPaymentRental) return;

    updateRentalPayment(
      editingPaymentRental.id,
      Number(amountPaidInput),
      Number(depositPaidInput),
      Number(amountRetainedInput),
    );
    setEditingPaymentRental(null);
  };

  const getStatusBadge = (status: RentalStatus) => {
    switch (status) {
      case "pending":
        return (
          <span className="bg-amber-50 text-amber-700 border border-amber-300/60 px-2.5 py-1 rounded-full text-xs font-semibold">
            Pending
          </span>
        );
      case "booked":
        return (
          <span className="bg-blue-50 text-blue-700 border border-blue-300/60 px-2.5 py-1 rounded-full text-xs font-semibold">
            Booked
          </span>
        );
      case "out":
        return (
          <span className="bg-[#F4F7CD] text-[#6D7A1E] border border-[#8D9A2E]/40 px-2.5 py-1 rounded-full text-xs font-semibold">
            Out with Client
          </span>
        );
      case "returned":
        return (
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-300/60 px-2.5 py-1 rounded-full text-xs font-semibold">
            Returned
          </span>
        );
      case "late":
        return (
          <span className="bg-[#B32F4E]/10 text-[#B32F4E] border border-[#B32F4E]/30 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> LATE
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-white/60 text-[#2D1A22]/40 border border-[#FFB5BD]/40 px-2.5 py-1 rounded-full text-xs font-medium">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 p-4 rounded-2xl shadow-glass">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#B32F4E]" />
          <h3 className="font-display text-lg font-bold text-[#B32F4E]">
            Central Rental Operations Matrix
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#2D1A22]/50">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="glass-input text-[#2D1A22] rounded-xl px-3 py-1.5 cursor-pointer text-xs"
          >
            <option value="all">All Statuses ({rentals.length})</option>
            <option value="pending">Pending</option>
            <option value="booked">Booked</option>
            <option value="out">Out with Client</option>
            <option value="returned">Returned</option>
            <option value="late">Late (Alert)</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Table Matrix */}
      <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl overflow-x-auto shadow-glass">
        <table className="w-full text-left text-xs text-[#2D1A22]/70">
          <thead className="bg-[#F4F7CD]/80 border-b border-[#FFB5BD]/40 uppercase text-[10px] tracking-wider text-[#B32F4E] font-semibold">
            <tr>
              <th className="py-3.5 px-4">Rental ID / Customer</th>
              <th className="py-3.5 px-4">Dress Item</th>
              <th className="py-3.5 px-4">Dates</th>
              <th className="py-3.5 px-4">Amount Due / Paid</th>
              <th className="py-3.5 px-4">Deposit Paid / Retained</th>
              <th className="py-3.5 px-4">Commission Snapshot</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#FFB5BD]/30">
            {filteredRentals.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-[#2D1A22]/30">
                  No rental entries match the selected status filter.
                </td>
              </tr>
            ) : (
              filteredRentals.map((r) => {
                const depositReturned = calculateDepositReturned(
                  r.deposit_paid,
                  r.amount_retained,
                );
                const isFullyPaid = r.amount_paid >= r.amount_due;

                return (
                  <tr key={r.id} className="hover:bg-[#FFB5BD]/10 transition">
                    {/* Customer & ID */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-[#2D1A22]">
                        {r.customer?.full_name || "Guest Customer"}
                      </div>
                      <div className="text-[10px] text-[#2D1A22]/40">
                        {r.customer?.email}
                      </div>
                      <div className="text-[10px] text-[#2D1A22]/30 font-mono">
                        ID: {r.id.slice(0, 8)}
                      </div>
                    </td>

                    {/* Dress Item */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-medium text-[#B32F4E]">
                        {r.dress?.name || "Unknown Item"}
                      </div>
                      <div className="text-[10px] text-[#2D1A22]/40">
                        Size {r.dress?.size} • {r.dress?.color}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div>{r.start_date}</div>
                      <div className="text-[#2D1A22]/40">to {r.end_date}</div>
                    </td>

                    {/* Amount Due / Paid */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-[#2D1A22]">
                        ₱{r.amount_due.toFixed(2)} due
                      </div>
                      <div
                        className={`text-[10px] font-medium ${isFullyPaid ? "text-emerald-600" : "text-amber-600"}`}
                      >
                        ₱{r.amount_paid.toFixed(2)} paid{" "}
                        {isFullyPaid ? "✓" : "(Unpaid)"}
                      </div>
                    </td>

                    {/* Deposit */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="text-[#2D1A22]/70">
                        ₱{r.deposit_paid.toFixed(2)} deposit
                      </div>
                      {r.amount_retained > 0 ? (
                        <div className="text-[10px] text-[#B32F4E] font-medium">
                          Retained: -₱{r.amount_retained.toFixed(2)} (Returned:
                          ₱{depositReturned.toFixed(2)})
                        </div>
                      ) : (
                        <div className="text-[10px] text-[#2D1A22]/30">
                          Returned: ₱{depositReturned.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Commission Rate Snapshot */}
                    <td className="py-3.5 px-4">
                      {r.snapshot_commission_rate !== null ? (
                        <span className="font-mono bg-[#B32F4E]/10 border border-[#B32F4E]/25 text-[#B32F4E] px-2 py-0.5 rounded text-[11px] font-semibold">
                          {(r.snapshot_commission_rate * 100).toFixed(0)}%
                          Snapshot
                        </span>
                      ) : (
                        <span className="text-[#2D1A22]/30 text-[10px] italic">
                          Pending Booked
                        </span>
                      )}
                    </td>

                    {/* Status Badge */}
                    <td className="py-3.5 px-4">{getStatusBadge(r.status)}</td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-y-1">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick Status Workflow Buttons */}
                        {r.status === "pending" && (
                          <button
                            onClick={() => updateRentalStatus(r.id, "booked")}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-300/60 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                            title="Confirm booking (snapshots global commission rate)"
                          >
                            Set Booked
                          </button>
                        )}

                        {r.status === "booked" && (
                          <button
                            onClick={() => updateRentalStatus(r.id, "out")}
                            className="bg-[#F4F7CD] hover:bg-[#E8EDAA] text-[#6D7A1E] border border-[#8D9A2E]/40 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                          >
                            Mark Out
                          </button>
                        )}

                        {(r.status === "out" || r.status === "late") && (
                          <button
                            onClick={() =>
                              updateRentalStatus(r.id, "returned")
                            }
                            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-300/60 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                          >
                            Mark Returned
                          </button>
                        )}

                        {["pending", "booked"].includes(r.status) && (
                          <button
                            onClick={() =>
                              updateRentalStatus(r.id, "cancelled")
                            }
                            className="bg-white/60 hover:bg-white/80 text-[#2D1A22]/40 border border-[#FFB5BD]/50 px-2 py-1 rounded text-[10px] transition"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Payment & Retained Deposit Modal Trigger */}
                        <button
                          onClick={() => openPaymentModal(r)}
                          className="bg-white/70 hover:bg-white/90 text-[#2D1A22]/60 p-1.5 rounded border border-[#FFB5BD]/50 transition"
                          title="Manage Payments & Retain Deposit"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#B32F4E]" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Payment & Retained Deposit Modal */}
      {editingPaymentRental && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1A22]/50 backdrop-blur-md">
          <div className="bg-[#FFEEEE]/95 backdrop-blur-lg border border-white/55 rounded-3xl p-6 w-full max-w-md space-y-4 text-[#2D1A22] shadow-2xl shadow-[#B32F4E]/10">
            <div className="flex items-center justify-between border-b border-[#FFB5BD]/40 pb-3">
              <h3 className="font-display text-lg font-bold text-[#B32F4E]">
                Payment & Retain Deposit Manager
              </h3>
              <button
                onClick={() => setEditingPaymentRental(null)}
                className="text-[#2D1A22]/40 hover:text-[#B32F4E] transition"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#2D1A22]/50">
              Rental ID:{" "}
              <strong className="text-[#2D1A22]">{editingPaymentRental.id}</strong>{" "}
              ({editingPaymentRental.dress?.name})
            </p>

            <form onSubmit={savePaymentDetails} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#2D1A22]/70 mb-1 font-semibold">
                  Amount Paid by Customer (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountPaidInput}
                  onChange={(e) => setAmountPaidInput(Number(e.target.value))}
                  className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
                />
                <span className="text-[10px] text-[#2D1A22]/40 mt-0.5 block">
                  Total Amount Due: ₱
                  {editingPaymentRental.amount_due.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-[#2D1A22]/70 mb-1 font-semibold">
                  Security Deposit Collected (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={depositPaidInput}
                  onChange={(e) => setDepositPaidInput(Number(e.target.value))}
                  className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
                />
              </div>

              <div>
                <label className="block text-[#B32F4E] mb-1 font-semibold">
                  Amount Retained for Damages / Late Fees (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountRetainedInput}
                  onChange={(e) =>
                    setAmountRetainedInput(Number(e.target.value))
                  }
                  className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
                />
                <span className="text-[10px] text-[#2D1A22]/40 mt-0.5 block">
                  Deposit Returned to Customer Formula: Deposit Paid (₱
                  {depositPaidInput}) - Retained (₱{amountRetainedInput}) ={" "}
                  <strong>
                    ₱
                    {calculateDepositReturned(
                      depositPaidInput,
                      amountRetainedInput,
                    ).toFixed(2)}
                  </strong>
                </span>
              </div>

              <div className="pt-3 border-t border-[#FFB5BD]/40 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPaymentRental(null)}
                  className="w-1/2 bg-white/60 hover:bg-white/80 border border-[#FFB5BD]/50 text-[#2D1A22]/60 py-2.5 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-[#B32F4E] hover:bg-[#8D2040] text-white py-2.5 rounded-xl font-semibold transition shadow-wine-glow"
                >
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
