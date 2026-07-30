"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { Settings, Save, CheckCircle2 } from "lucide-react";

export function GlobalSettingsPanel() {
  const { globalSettings, updateGlobalCommissionRate } = useAppStore();

  const [rateInput, setRateInput] = useState<number>(
    (globalSettings?.global_commission_rate ?? 0.50) * 100,
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
    <div className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass text-[#2D1A22] space-y-6 max-w-xl">
      <div className="flex items-center gap-2 font-display text-lg font-bold text-[#B32F4E] pb-3 border-b border-[#FFB5BD]/40">
        <Settings className="w-5 h-5 text-[#B32F4E]" />
        <span>Global Platform Settings & Commission</span>
      </div>

      <p className="text-xs text-[#2D1A22]/50 leading-relaxed">
        The global commission rate determines the platform snapshot percentage
        captured the exact moment a rental status transitions from{" "}
        <strong className="text-[#2D1A22]">'pending'</strong> to{" "}
        <strong className="text-[#2D1A22]">'booked'</strong>. Downstream payouts
        rely strictly on the captured snapshot field.
      </p>

      {successMsg && (
        <div className="bg-[#8D9A2E]/10 border border-[#8D9A2E]/40 text-[#6D7A1E] p-3 rounded-xl text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-[#8D9A2E]" />
          <span>Global Commission Rate updated successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-[#2D1A22]/60 mb-1 font-semibold">
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
              className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22] font-mono text-sm"
            />
            <span className="text-lg font-bold text-[#2D1A22]/40">%</span>
          </div>
          <span className="text-[10px] text-[#2D1A22]/40 mt-1 block">
            Current Rate Decimal:{" "}
            <strong>{globalSettings?.global_commission_rate ?? 0.50}</strong> (Consignor
            gets{" "}
            {((1 - (globalSettings?.global_commission_rate ?? 0.50)) * 100).toFixed(0)}% /
            Platform gets{" "}
            {((globalSettings?.global_commission_rate ?? 0.50) * 100).toFixed(0)}%)
          </span>
        </div>

        <button
          type="submit"
          className="bg-[#B32F4E] hover:bg-[#8D2040] text-white font-semibold px-5 py-3 rounded-xl transition flex items-center gap-2 text-xs shadow-wine-glow"
        >
          <Save className="w-4 h-4" />
          <span>Save Global Rate</span>
        </button>
      </form>
    </div>
  );
}
