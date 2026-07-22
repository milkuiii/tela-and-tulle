"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export function GlobalSettingsPanel() {
  const { globalSettings, updateGlobalCommissionRate } = useAppStore();

  const [rateInput, setRateInput] = useState<number>(
    globalSettings.global_commission_rate * 100,
  );
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateFraction = Number(rateInput) / 100;
    if (rateFraction < 0 || rateFraction > 1) return;

    updateGlobalCommissionRate(rateFraction);
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 4000);
  };

  return (
    <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-6 shadow-xl text-white space-y-6 max-w-xl">
      <div className="flex items-center gap-2 font-sans text-lg font-bold text-rose-200 pb-3 border-b border-[#2E2A32]">
        <Settings className="w-5 h-5 text-rose-400" />
        <span>Global Platform Settings & Commission</span>
      </div>

      <p className="text-xs text-neutral-400 leading-relaxed">
        The global commission rate determines the platform snapshot percentage
        captured the exact moment a rental status transitions from{" "}
        <strong className="text-white">'pending'</strong> to{" "}
        <strong className="text-white">'booked'</strong>. Downstream payouts
        rely strictly on the captured snapshot field.
      </p>

      {successMsg && (
        <div className="bg-emerald-950/80 border border-emerald-700 text-emerald-300 p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Global Commission Rate updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-neutral-300 mb-1 font-semibold">
            Global Commission Rate Percentage (%)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={rateInput}
              onChange={(e) => setRateInput(Number(e.target.value))}
              className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl p-2.5 text-white font-mono text-sm focus:outline-none focus:border-rose-500"
            />
            <span className="text-lg font-bold text-neutral-400">%</span>
          </div>
          <span className="text-[10px] text-neutral-500 mt-1 block">
            Current Rate Decimal:{" "}
            <strong>{globalSettings.global_commission_rate}</strong> (Consignor
            gets{" "}
            {((1 - globalSettings.global_commission_rate) * 100).toFixed(0)}% /
            Platform gets{" "}
            {(globalSettings.global_commission_rate * 100).toFixed(0)}%)
          </span>
        </div>

        <button
          type="submit"
          className="bg-rose-900 hover:bg-rose-800 text-white font-semibold px-5 py-3 rounded-xl transition flex items-center gap-2 text-xs shadow-md"
        >
          <Save className="w-4 h-4" />
          <span>Save Global Rate</span>
        </button>
      </form>
    </div>
  );
}
