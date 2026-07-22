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
          <span className="bg-amber-950/80 text-amber-300 border border-amber-800/60 px-2.5 py-1 rounded-full text-xs font-semibold">
            Pending
          </span>
        );
      case "booked":
        return (
          <span className="bg-blue-950/80 text-blue-300 border border-blue-800/60 px-2.5 py-1 rounded-full text-xs font-semibold">
            Booked
          </span>
        );
      case "out":
        return (
          <span className="bg-purple-950/80 text-purple-300 border border-purple-800/60 px-2.5 py-1 rounded-full text-xs font-semibold">
            Out with Client
          </span>
        );
      case "returned":
        return (
          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-2.5 py-1 rounded-full text-xs font-semibold">
            Returned
          </span>
        );
      case "late":
        return (
          <span className="bg-rose-950 text-rose-300 border border-rose-700 px-2.5 py-1 rounded-full text-xs font-bold animate-pulse flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 text-rose-400" /> LATE
          </span>
        );
      case "cancelled":
        return (
          <span className="bg-neutral-800 text-neutral-400 border border-neutral-700 px-2.5 py-1 rounded-full text-xs font-medium">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Status Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#1C191E] border border-[#2E2A32] p-4 rounded-2xl">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-rose-400" />
          <h3 className="font-sans text-lg font-bold text-white">
            Central Rental Operations Matrix
          </h3>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-neutral-400">Filter Status:</span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#121013] text-white border border-[#2E2A32] rounded-xl px-3 py-1.5 focus:outline-none focus:border-rose-500 cursor-pointer"
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
      <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl overflow-x-auto shadow-xl">
        <table className="w-full text-left text-xs text-neutral-300">
          <thead className="bg-[#121013] border-b border-[#2E2A32] uppercase text-[10px] tracking-wider text-rose-300 font-semibold">
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
          <tbody className="divide-y divide-[#2E2A32]">
            {filteredRentals.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-8 text-neutral-500">
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
                  <tr key={r.id} className="hover:bg-[#252129] transition">
                    {/* Customer & ID */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-white">
                        {r.customer?.full_name || "Guest Customer"}
                      </div>
                      <div className="text-[10px] text-neutral-500">
                        {r.customer?.email}
                      </div>
                      <div className="text-[10px] text-neutral-500 font-mono">
                        ID: {r.id.slice(0, 8)}
                      </div>
                    </td>

                    {/* Dress Item */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-medium text-rose-200">
                        {r.dress?.name || "Unknown Item"}
                      </div>
                      <div className="text-[10px] text-neutral-400">
                        Size {r.dress?.size} • {r.dress?.color}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-3.5 px-4 font-mono text-[11px]">
                      <div>{r.start_date}</div>
                      <div className="text-neutral-400">to {r.end_date}</div>
                    </td>

                    {/* Amount Due / Paid */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="font-semibold text-white">
                        ₱{r.amount_due.toFixed(2)} due
                      </div>
                      <div
                        className={`text-[10px] font-medium ${isFullyPaid ? "text-emerald-400" : "text-amber-400"}`}
                      >
                        ₱{r.amount_paid.toFixed(2)} paid{" "}
                        {isFullyPaid ? "✓" : "(Unpaid)"}
                      </div>
                    </td>

                    {/* Deposit */}
                    <td className="py-3.5 px-4 space-y-0.5">
                      <div className="text-neutral-200">
                        ₱{r.deposit_paid.toFixed(2)} deposit
                      </div>
                      {r.amount_retained > 0 ? (
                        <div className="text-[10px] text-rose-400 font-medium">
                          Retained: -₱{r.amount_retained.toFixed(2)} (Returned:
                          ₱{depositReturned.toFixed(2)})
                        </div>
                      ) : (
                        <div className="text-[10px] text-neutral-500">
                          Returned: ₱{depositReturned.toFixed(2)}
                        </div>
                      )}
                    </td>

                    {/* Commission Rate Snapshot */}
                    <td className="py-3.5 px-4">
                      {r.snapshot_commission_rate !== null ? (
                        <span className="font-mono bg-rose-950/60 border border-rose-800/40 text-rose-300 px-2 py-0.5 rounded text-[11px] font-semibold">
                          {(r.snapshot_commission_rate * 100).toFixed(0)}%
                          Snapshot
                        </span>
                      ) : (
                        <span className="text-neutral-500 text-[10px] italic">
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
                            className="bg-blue-900 hover:bg-blue-800 text-blue-100 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                            title="Confirm booking (snapshots global commission rate)"
                          >
                            Set Booked
                          </button>
                        )}

                        {r.status === "booked" && (
                          <button
                            onClick={() => updateRentalStatus(r.id, "out")}
                            className="bg-purple-900 hover:bg-purple-800 text-purple-100 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                          >
                            Mark Out
                          </button>
                        )}

                        {(r.status === "out" || r.status === "late") && (
                          <button
                            onClick={() => updateRentalStatus(r.id, "returned")}
                            className="bg-emerald-900 hover:bg-emerald-800 text-emerald-100 px-2.5 py-1 rounded text-[10px] font-semibold transition"
                          >
                            Mark Returned
                          </button>
                        )}

                        {["pending", "booked"].includes(r.status) && (
                          <button
                            onClick={() =>
                              updateRentalStatus(r.id, "cancelled")
                            }
                            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-400 px-2 py-1 rounded text-[10px] transition"
                          >
                            Cancel
                          </button>
                        )}

                        {/* Payment & Retained Deposit Modal Trigger */}
                        <button
                          onClick={() => openPaymentModal(r)}
                          className="bg-[#2E2A32] hover:bg-neutral-700 text-white p-1.5 rounded transition"
                          title="Manage Payments & Retain Deposit"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-rose-300" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1C191E] border border-[#2E2A32] rounded-3xl p-6 w-full max-w-md space-y-4 text-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#2E2A32] pb-3">
              <h3 className="font-sans text-lg font-bold text-rose-200">
                Payment & Retain Deposit Manager
              </h3>
              <button
                onClick={() => setEditingPaymentRental(null)}
                className="text-neutral-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-neutral-400">
              Rental ID:{" "}
              <strong className="text-white">{editingPaymentRental.id}</strong>{" "}
              ({editingPaymentRental.dress?.name})
            </p>

            <form onSubmit={savePaymentDetails} className="space-y-4 text-xs">
              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">
                  Amount Paid by Customer (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountPaidInput}
                  onChange={(e) => setAmountPaidInput(Number(e.target.value))}
                  className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-neutral-500 mt-0.5 block">
                  Total Amount Due: ₱
                  {editingPaymentRental.amount_due.toFixed(2)}
                </span>
              </div>

              <div>
                <label className="block text-neutral-300 mb-1 font-semibold">
                  Security Deposit Collected (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={depositPaidInput}
                  onChange={(e) => setDepositPaidInput(Number(e.target.value))}
                  className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-rose-300 mb-1 font-semibold">
                  Amount Retained for Damages / Late Fees (₱)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={amountRetainedInput}
                  onChange={(e) =>
                    setAmountRetainedInput(Number(e.target.value))
                  }
                  className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
                <span className="text-[10px] text-neutral-400 mt-0.5 block">
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

              <div className="pt-3 border-t border-[#2E2A32] flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingPaymentRental(null)}
                  className="w-1/2 bg-[#2E2A32] hover:bg-neutral-800 text-neutral-300 py-2.5 rounded-xl font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-rose-900 hover:bg-rose-800 text-white py-2.5 rounded-xl font-semibold transition shadow-md"
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
