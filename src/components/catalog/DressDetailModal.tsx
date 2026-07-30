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

  const handleBookingSubmit = async (e: React.FormEvent) => {
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

    const res = await createCustomerAndRental(
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D1A22]/50 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-[#FFEEEE]/95 backdrop-blur-lg border border-white/55 rounded-3xl overflow-hidden shadow-2xl shadow-[#B32F4E]/10 text-[#2D1A22] my-8 max-h-[90vh] flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/70 hover:bg-white/90 text-[#2D1A22]/60 hover:text-[#B32F4E] p-2 rounded-full border border-white/60 transition shadow-soft"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery & Measurement Specs */}
        <div className="w-full md:w-1/2 bg-[#F4F7CD]/70 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#FFB5BD]/40">
          <div className="space-y-4">
            {/* Main Featured Image */}
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden border border-white/50 shadow-soft">
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
                        ? "border-[#B32F4E] ring-2 ring-[#B32F4E]/30"
                        : "border-[#FFB5BD]/50 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image src={url} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Exact Physical Measurements Card */}
            <div className="bg-white/60 backdrop-blur-sm border border-[#FFB5BD]/40 rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-display font-semibold text-[#B32F4E] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Physical Measurements & Fit
                Specs
              </h4>
              <div className="grid grid-cols-2 gap-3 text-[#2D1A22]/70 pt-1">
                <div className="bg-white/70 p-2 rounded-lg border border-[#FFB5BD]/30">
                  <span className="text-[#2D1A22]/40 block">Bust:</span>
                  <strong className="text-[#2D1A22] text-sm">
                    {dress.bust_inches}"
                  </strong>
                </div>
                <div className="bg-white/70 p-2 rounded-lg border border-[#FFB5BD]/30">
                  <span className="text-[#2D1A22]/40 block">Waist:</span>
                  <strong className="text-[#2D1A22] text-sm">
                    {dress.waist_inches}"
                  </strong>
                </div>
                <div className="bg-white/70 p-2 rounded-lg border border-[#FFB5BD]/30">
                  <span className="text-[#2D1A22]/40 block">Hips:</span>
                  <strong className="text-[#2D1A22] text-sm">
                    {dress.hip_inches}"
                  </strong>
                </div>
                <div className="bg-white/70 p-2 rounded-lg border border-[#FFB5BD]/30">
                  <span className="text-[#2D1A22]/40 block">Length:</span>
                  <strong className="text-[#2D1A22] text-sm">
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
              <span className="bg-[#B32F4E]/10 text-[#B32F4E] text-xs font-semibold px-2.5 py-0.5 rounded-full border border-[#B32F4E]/25">
                Size {dress.size}
              </span>
              <span className="bg-white/60 text-[#2D1A22]/60 text-xs font-medium px-2.5 py-0.5 rounded-full border border-[#FFB5BD]/50">
                {dress.color}
              </span>
            </div>
            <h2 className="font-display text-2xl font-bold text-[#B32F4E] mt-2">
              {dress.name}
            </h2>
            <p className="text-xs text-[#2D1A22]/60 mt-1 leading-relaxed">
              {dress.description}
            </p>
          </div>

          {bookingSuccess ? (
            <div className="bg-[#8D9A2E]/10 border border-[#8D9A2E]/40 p-6 rounded-2xl space-y-4 text-center">
              <CheckCircle2 className="w-12 h-12 text-[#8D9A2E] mx-auto" />
              <h3 className="font-display text-xl font-bold text-[#8D9A2E]">
                Booking Request Submitted!
              </h3>
              <p className="text-xs text-[#2D1A22]/60 leading-relaxed">
                Thank you, <strong>{fullName}</strong>. Your rental request for{" "}
                <strong>{dress.name}</strong> from {startDate} to {endDate} has
                been created with status{" "}
                <span className="underline font-semibold">PENDING</span>.
              </p>
              <div className="bg-white/60 p-3 rounded-xl text-left text-xs space-y-1 border border-[#FFB5BD]/40">
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
                className="w-full bg-[#8D9A2E] hover:bg-[#6D7A1E] text-white font-semibold py-2.5 rounded-xl text-xs transition"
              >
                Return to Catalog
              </button>
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              {/* Date Selection */}
              <div className="bg-white/55 backdrop-blur-sm border border-[#FFB5BD]/40 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between text-xs font-semibold text-[#B32F4E]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4" /> Select Rental Window
                  </span>
                  <span className="text-[#2D1A22]/40">Baseline: 2 Days</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[#2D1A22]/50 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#2D1A22]/50 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full glass-input rounded-xl p-2.5 text-[#2D1A22]"
                    />
                  </div>
                </div>

                {/* Real-time Availability Alert */}
                {availability.isAvailable ? (
                  <div className="bg-[#8D9A2E]/10 border border-[#8D9A2E]/40 p-2.5 rounded-xl text-xs text-[#6D7A1E] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#8D9A2E] shrink-0" />
                    <span>
                      Dress is <strong>Available</strong> for selected dates!
                    </span>
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-300/60 p-3 rounded-xl text-xs text-amber-700 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block text-amber-600 font-semibold">
                        Dates Unavailable
                      </strong>
                      <span>{availability.reason}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Breakdown Card */}
              <div className="bg-white/55 backdrop-blur-sm border border-[#FFB5BD]/40 rounded-2xl p-4 space-y-2 text-xs">
                <h4 className="font-semibold text-[#2D1A22]/60 uppercase tracking-wider">
                  Dynamic Pricing Breakdown
                </h4>

                <div className="flex justify-between text-[#2D1A22]/50 pt-1">
                  <span>Base 2-Day Rental:</span>
                  <span className="text-[#2D1A22] font-medium">
                    ₱{priceBreakdown.baseRentalPrice.toFixed(2)}
                  </span>
                </div>

                {priceBreakdown.extraDays > 0 && (
                  <div className="flex justify-between text-[#B32F4E]">
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

                <div className="flex justify-between text-[#2D1A22]/50">
                  <span>Refundable Security Deposit:</span>
                  <span className="text-[#2D1A22] font-medium">
                    ₱{priceBreakdown.securityDeposit.toFixed(2)}
                  </span>
                </div>

                <div className="pt-2 border-t border-[#FFB5BD]/40 flex justify-between items-center text-sm font-bold">
                  <span className="text-[#B32F4E]">Total Amount Due:</span>
                  <span className="font-sans text-lg text-[#2D1A22]">
                    ₱{priceBreakdown.totalAmountDue.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Customer Contact Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-[#2D1A22]/50">
                  Customer Details
                </h4>

                {errorMessage && (
                  <div className="p-2.5 bg-[#B32F4E]/10 border border-[#B32F4E]/30 rounded-xl text-xs text-[#B32F4E]">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[#2D1A22]/50 mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 absolute left-3 top-3 text-[#B32F4E]/40" />
                      <input
                        type="text"
                        placeholder="e.g. Isabella Reed"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-[#2D1A22]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#2D1A22]/50 mb-1">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 absolute left-3 top-3 text-[#B32F4E]/40" />
                      <input
                        type="email"
                        placeholder="isabella@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-[#2D1A22]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#2D1A22]/50 mb-1">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 absolute left-3 top-3 text-[#B32F4E]/40" />
                      <input
                        type="tel"
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-[#2D1A22]"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#2D1A22]/50 mb-1">
                      Social Handle (Optional)
                    </label>
                    <div className="relative">
                      <Instagram className="w-3.5 h-3.5 absolute left-3 top-3 text-[#B32F4E]/40" />
                      <input
                        type="text"
                        placeholder="@isabella_reed"
                        value={socialHandle}
                        onChange={(e) => setSocialHandle(e.target.value)}
                        className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-[#2D1A22]"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[#2D1A22]/50 text-xs mb-1">
                    Shipping Address *
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-3 top-3 text-[#B32F4E]/40" />
                    <input
                      type="text"
                      placeholder="12 Park Ave, Suite 40, New York, NY 10016"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs text-[#2D1A22]"
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
                    ? "bg-gradient-to-r from-[#B32F4E] to-[#8D2040] hover:from-[#8D2040] hover:to-[#6B1830] text-white border border-[#B32F4E]/40 shadow-wine-glow"
                    : "bg-[#FFB5BD]/30 text-[#2D1A22]/30 cursor-not-allowed border border-[#FFB5BD]/30"
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
