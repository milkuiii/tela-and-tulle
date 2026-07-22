"use client";

import React, { useState } from "react";
import Image from "next/image";
import { InventoryItem, Customer } from "@/types/database";
import { useAppStore } from "@/lib/store";
import { calculateRentalPrice, checkDressAvailability } from "@/lib/pricing";
import {
  X,
  Calendar,
  Shield,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  User,
  Mail,
  Phone,
  MapPin,
  Instagram,
} from "lucide-react";
import { addDays, format } from "date-fns";

interface DressDetailModalProps {
  dress: InventoryItem | null;
  onClose: () => void;
}

export function DressDetailModal({ dress, onClose }: DressDetailModalProps) {
  const { rentals, createCustomerAndRental } = useAppStore();

  // Default dates: Today + 3 days to Today + 7 days
  const defaultStart = format(addDays(new Date(), 3), "yyyy-MM-dd");
  const defaultEnd = format(addDays(new Date(), 7), "yyyy-MM-dd");

  const [startDate, setStartDate] = useState<string>(defaultStart);
  const [endDate, setEndDate] = useState<string>(defaultEnd);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);

  // Customer Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [socialHandle, setSocialHandle] = useState("");

  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!dress) return null;

  // Real-time availability check without turnaround buffer
  const availability = checkDressAvailability(
    dress.id,
    startDate,
    endDate,
    rentals,
    0,
  );

  // Real-time price calculation
  const priceBreakdown = calculateRentalPrice(dress, startDate, endDate);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!fullName || !email || !phone || !address) {
      setErrorMessage("Please fill in all required customer fields.");
      return;
    }

    if (!availability.isAvailable) {
      setErrorMessage(availability.reason || "Selected dates are unavailable.");
      return;
    }

    const res = createCustomerAndRental(
      {
        full_name: fullName,
        email,
        phone_number: phone,
        shipping_address: address,
        social_handle: socialHandle || undefined,
      },
      {
        dress_id: dress.id,
        start_date: startDate,
        end_date: endDate,
        amount_due: priceBreakdown.totalAmountDue,
        deposit_paid: priceBreakdown.securityDeposit,
      },
    );

    if (res.success) {
      setBookingSuccess(true);
    } else {
      setErrorMessage(res.error || "Failed to submit booking.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#1C191E] border border-[#2E2A32] rounded-3xl overflow-hidden shadow-2xl text-white my-8 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/60 hover:bg-black/80 text-neutral-300 hover:text-white p-2 rounded-full border border-white/10 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery & Measurement Specs */}
        <div className="w-full md:w-1/2 bg-[#121013] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#2E2A32]">
          <div className="space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-[#2E2A32]">
              <Image
                src={dress.image_urls[activeImgIndex] || dress.image_urls[0]}
                alt={dress.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Thumbnail Row */}
            {dress.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {dress.image_urls.map((url, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-16 h-20 rounded-lg overflow-hidden border transition ${
                      activeImgIndex === idx
                        ? "border-rose-500 ring-2 ring-rose-500/50"
                        : "border-[#2E2A32] opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Exact Physical Measurements Card */}
            <div className="bg-[#1C191E] border border-[#2E2A32] rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-semibold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Physical Measurements & Fit
                Specs
              </h4>
              <div className="grid grid-cols-2 gap-3 text-neutral-300 pt-1">
                <div className="bg-[#121013] p-2 rounded-lg border border-[#2E2A32]/60">
                  <span className="text-neutral-500 block">Bust:</span>
                  <strong className="text-white text-sm">
                    {dress.bust_inches}"
                  </strong>
                </div>
                <div className="bg-[#121013] p-2 rounded-lg border border-[#2E2A32]/60">
                  <span className="text-neutral-500 block">Waist:</span>
                  <strong className="text-white text-sm">
                    {dress.waist_inches}"
                  </strong>
                </div>
                <div className="bg-[#121013] p-2 rounded-lg border border-[#2E2A32]/60">
                  <span className="text-neutral-500 block">Hips:</span>
                  <strong className="text-white text-sm">
                    {dress.hip_inches}"
                  </strong>
                </div>
                <div className="bg-[#121013] p-2 rounded-lg border border-[#2E2A32]/60">
                  <span className="text-neutral-500 block">Length:</span>
                  <strong className="text-white text-sm">
                    {dress.length_inches}"
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Price Calculator & Booking Form */}
        <div className="w-full md:w-1/2 p-6 overflow-y-auto space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-950/80 text-rose-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-rose-800/50">
                Size {dress.size}
              </span>
              <span className="bg-[#2E2A32] text-neutral-300 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {dress.color}
              </span>
            </div>
            <h2 className="font-sans text-2xl font-bold text-rose-100 mt-2">
              {dress.name}
            </h2>
            <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
              {dress.description}
            </p>
          </div>

          {bookingSuccess ? (
            <div className="bg-emerald-950/60 border border-emerald-700 p-6 rounded-2xl space-y-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="font-sans text-xl font-bold text-emerald-200">
                Booking Request Submitted!
              </h3>
              <p className="text-xs text-emerald-300/80 leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your rental request for{" "}
                <strong>{dress.name}</strong> from {startDate} to {endDate} has
                been created with status{" "}
                <span className="underline font-semibold">PENDING</span>.
              </p>
              <div className="bg-black/40 p-3 rounded-xl text-left text-xs space-y-1 border border-emerald-900">
                <div>
                  Total Amount Due:{" "}
                  <strong>₱{priceBreakdown.totalAmountDue.toFixed(2)}</strong>
                </div>
                <div>
                  Security Deposit Included:{" "}
                  <strong>₱{priceBreakdown.securityDeposit.toFixed(2)}</strong>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-emerald-700 hover:bg-emerald-600 text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Return to Catalog
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Date Selection */}
              <div className="bg-[#121013] border border-[#2E2A32] rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-rose-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Select Rental Window
                  </span>
                  <span className="text-neutral-400">Baseline: 2 Days</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-400 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full bg-[#1C191E] border border-[#2E2A32] rounded-xl p-2.5 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>

                {/* Real-time Availability Alert */}
                {availability.isAvailable ? (
                  <div className="bg-emerald-950/40 border border-emerald-800/60 p-2.5 rounded-xl text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>
                      Dress is <strong>Available</strong> for selected dates!
                    </span>
                  </div>
                ) : (
                  <div className="bg-amber-950/60 border border-amber-700/80 p-3 rounded-xl text-xs text-amber-200 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-300 font-semibold">
                        Dates Unavailable
                      </strong>
                      <span>{availability.reason}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-[#121013] border border-[#2E2A32] rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-semibold text-neutral-300 uppercase tracking-wider">
                  Dynamic Pricing Breakdown
                </h4>

                <div className="flex justify-between text-neutral-400 pt-1">
                  <span>Base 2-Day Rental:</span>
                  <span className="text-white font-medium">
                    ₱{priceBreakdown.baseRentalPrice.toFixed(2)}
                  </span>
                </div>

                {priceBreakdown.extraDays > 0 && (
                  <div className="flex justify-between text-rose-300">
                    <span>
                      Extra Days ({priceBreakdown.extraDays} day
                      {priceBreakdown.extraDays > 1 ? "s" : ""} @ ₱
                      {dress.extension_rate_daily}/day):
                    </span>
                    <span className="font-medium">
                      +₱{priceBreakdown.extensionFee.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-neutral-400">
                  <span>Refundable Security Deposit:</span>
                  <span className="text-white font-medium">
                    ₱{priceBreakdown.securityDeposit.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#2E2A32] flex justify-between items-center text-sm font-bold">
                  <span className="text-rose-200">Total Amount Due:</span>
                  <span className="font-sans text-lg text-white">
                    ₱{priceBreakdown.totalAmountDue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Customer Details
                </h4>

                {errorMessage && (
                  <div className="p-2.5 bg-rose-950/80 border border-rose-700 rounded-xl text-xs text-rose-200">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="e.g. Isabella Reed"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                      <input
                        type="email"
                        placeholder="isabella@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-rose-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">
                      Social Handle (Optional)
                    </label>
                    <div className="relative">
                      <Instagram className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                      <input
                        type="text"
                        placeholder="@isabella_reed"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value)}
                        className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-rose-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-400 text-xs mb-1">
                    Shipping Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="12 Park Ave, Suite 40, New York, NY 10016"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#121013] border border-[#2E2A32] rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!availability.isAvailable}
                className={`w-full py-3.5 rounded-2xl text-sm font-bold transition flex items-center justify-center gap-2 shadow-xl ${
                  availability.isAvailable
                    ? "bg-gradient-to-r from-rose-800 to-rose-900 hover:from-rose-700 hover:to-rose-800 text-white border border-rose-600/50"
                    : "bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700"
                }`}
              >
                <span>
                  Request Booking (₱{priceBreakdown.totalAmountDue.toFixed(2)})
                </span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
