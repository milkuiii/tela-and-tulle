"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  HeartHandshake,
  DollarSign,
  Package,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  Star,
  Users,
  Gem,
  BarChart3,
  CheckCircle2,
  Send,
  Instagram,
  User,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const BENEFITS = [
  {
    icon: DollarSign,
    title: "50% Commission on Every Rental",
    body: "Earn half of every rental fee for your gown — automatically tracked and compiled into monthly payout settlements.",
    color: "#B32F4E",
    bg: "rgba(179, 47, 78, 0.07)",
    border: "rgba(179, 47, 78, 0.2)",
  },
  {
    icon: ShieldCheck,
    title: "Security Deposit Protection",
    body: "Every rental is backed by a customer security deposit, protecting your gown against damage or late returns.",
    color: "#8D9A2E",
    bg: "rgba(141, 154, 46, 0.07)",
    border: "rgba(141, 154, 46, 0.2)",
  },
  {
    icon: BarChart3,
    title: "Private Financial Dashboard",
    body: "Access a real-time ledger showing your gown's full rental lifecycle, payout eligibility, and historical settlement receipts.",
    color: "#B32F4E",
    bg: "rgba(179, 47, 78, 0.07)",
    border: "rgba(179, 47, 78, 0.2)",
  },
  {
    icon: Users,
    title: "Reach the Right Audience",
    body: "Your pieces are presented to curated audiences seeking high-fashion rentals for galas, weddings, and editorial shoots.",
    color: "#8D9A2E",
    bg: "rgba(141, 154, 46, 0.07)",
    border: "rgba(141, 154, 46, 0.2)",
  },
  {
    icon: Gem,
    title: "White-Glove Handling",
    body: "Tela & Tulle manages all customer-facing logistics. You drop off your piece; we handle the rest.",
    color: "#B32F4E",
    bg: "rgba(179, 47, 78, 0.07)",
    border: "rgba(179, 47, 78, 0.2)",
  },
  {
    icon: TrendingUp,
    title: "Sustainable Fashion Impact",
    body: "Every rental reduces overconsumption. Your pieces circulate meaningfully instead of collecting dust.",
    color: "#8D9A2E",
    bg: "rgba(141, 154, 46, 0.07)",
    border: "rgba(141, 154, 46, 0.2)",
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Apply as a Consignor",
    body: "Fill out the form below. Our admin team will review your application and create your private consignor account.",
  },
  {
    step: "02",
    title: "Drop Off Your Gowns",
    body: "Schedule a drop-off or ship your gowns to us. We photograph, measure, and upload every piece to the catalog.",
  },
  {
    step: "03",
    title: "Earn Every Rental",
    body: "When customers rent your gown, you earn 50% of the rental fee. No logistics, no hassle — just earnings.",
  },
  {
    step: "04",
    title: "Monthly Settlements",
    body: "Payouts are compiled monthly. Track everything in your private consignor dashboard and receive direct settlements.",
  },
];

const FAQS = [
  {
    q: "Who can apply to be a consignor?",
    a: "Any individual or brand with designer, couture, or high-quality eveningwear pieces can apply. We curate carefully to ensure catalog quality.",
  },
  {
    q: "How is my commission calculated?",
    a: "You receive 50% of the base rental rate plus any extension fees. Security deposits are excluded from commission — they exist solely to protect your gown.",
  },
  {
    q: "Can I set my own rental price?",
    a: "Pricing is collaboratively set between you and our admin team based on retail value, condition, and market demand. You'll always see the final pricing before listing.",
  },
  {
    q: "What happens if my gown is damaged?",
    a: "Customer security deposits cover potential damages. Our admin team manages claims, and any retained amount is documented transparently on your dashboard.",
  },
  {
    q: "Can I withdraw my gown from the catalog?",
    a: "Yes. Contact our admin team and we'll archive your listing. Any active or upcoming rentals will be honored before withdrawal.",
  },
  {
    q: "How long does the application process take?",
    a: "Typically 3–5 business days. Once approved, we'll schedule a gown drop-off and have you live in the catalog within a week.",
  },
];

export default function LendWithUsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    instagram: "",
    address: "",
    gownCount: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // UI-only submission demo
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-20">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A2210] via-[#2C3A12] to-[#1A1012] border border-white/10 p-10 sm:p-16 shadow-glass min-h-[400px] flex items-center">
        <div className="absolute -right-16 -top-16 w-[400px] h-[400px] bg-[#8D9A2E]/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -left-16 -bottom-16 w-[300px] h-[300px] bg-[#B32F4E]/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8D9A2E]/20 border border-[#8D9A2E]/30 text-xs text-[#A8B83A] font-semibold uppercase tracking-widest">
            <HeartHandshake className="w-3.5 h-3.5" /> Consignor Partnership Program
          </div>

          <h1 className="font-display text-4xl sm:text-6xl font-bold text-white leading-tight">
            Let Your Gowns{" "}
            <span className="text-[#A8B83A]">Work for You.</span>
          </h1>

          <p className="text-white/60 text-base sm:text-lg leading-relaxed font-sans max-w-2xl">
            Partner with Tela & Tulle to earn passive income from your designer
            wardrobe. Every rental generates real earnings, tracked transparently
            in your private consignor dashboard.
          </p>

          <div className="flex flex-wrap gap-5 pt-2 border-t border-white/10">
            {[
              { num: "50%", label: "Your Commission" },
              { num: "₱0", label: "Upfront Cost" },
              { num: "Monthly", label: "Payout Cadence" },
            ].map(({ num, label }) => (
              <div key={label} className="space-y-0.5">
                <div className="text-2xl font-display font-bold text-[#A8B83A]">{num}</div>
                <div className="text-xs text-white/40 uppercase tracking-wider">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits Grid ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8D9A2E]/10 border border-[#8D9A2E]/25 text-xs text-[#8D9A2E] font-semibold uppercase tracking-widest">
            <Star className="w-3.5 h-3.5" /> Why Partner With Us
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#B32F4E]">
            The Consignor Advantage
          </h2>
          <p className="text-[#2D1A22]/50 text-sm max-w-xl mx-auto">
            Everything you need to earn from your wardrobe, without lifting a finger.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {BENEFITS.map(({ icon: Icon, title, body, color, bg, border }) => (
            <div
              key={title}
              className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass hover:shadow-rose-glow hover:-translate-y-1 transition-all duration-300 group space-y-4"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center border transition-transform duration-200 group-hover:scale-110"
                style={{ background: bg, borderColor: border }}
              >
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div>
                <h3 className="font-display font-bold text-[#2D1A22] text-sm mb-1.5">
                  {title}
                </h3>
                <p className="text-xs text-[#2D1A22]/55 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#B32F4E]">
            From Wardrobe to Earnings
          </h2>
          <p className="text-[#2D1A22]/50 text-sm max-w-xl mx-auto">
            Four simple steps to turn idle designer pieces into a passive income stream.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {HOW_IT_WORKS.map(({ step, title, body }, idx) => (
            <div key={step} className="relative group">
              {/* Connector line on desktop */}
              {idx < HOW_IT_WORKS.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-[#B32F4E]/20 to-transparent z-0" />
              )}

              <div className="relative z-10 bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl p-6 shadow-glass hover:-translate-y-1 transition-all duration-300 space-y-3 h-full">
                <div className="text-4xl font-display font-black text-[#B32F4E]/10">
                  {step}
                </div>
                <div className="w-8 h-8 rounded-xl bg-[#B32F4E]/10 border border-[#B32F4E]/20 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-[#B32F4E]" />
                </div>
                <h3 className="font-display font-bold text-[#2D1A22] text-sm">{title}</h3>
                <p className="text-xs text-[#2D1A22]/55 leading-relaxed">{body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Application Form ── */}
      <section id="apply" className="space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#B32F4E]/10 border border-[#B32F4E]/25 text-xs text-[#B32F4E] font-semibold uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5" /> Apply Now
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#B32F4E]">
            Become a Consignor Partner
          </h2>
          <p className="text-[#2D1A22]/50 text-sm max-w-xl mx-auto">
            Fill in the form and our team will be in touch within 3–5 business days.
          </p>
        </div>

        {submitted ? (
          <div className="max-w-2xl mx-auto bg-[#F4F7CD]/70 backdrop-blur-md border border-[#8D9A2E]/25 rounded-3xl p-10 text-center shadow-glass space-y-4">
            <div className="w-16 h-16 bg-[#8D9A2E]/15 border border-[#8D9A2E]/30 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 text-[#8D9A2E]" />
            </div>
            <h3 className="font-display text-2xl font-bold text-[#8D9A2E]">
              Application Submitted!
            </h3>
            <p className="text-sm text-[#2D1A22]/60 max-w-md mx-auto leading-relaxed">
              Thank you, <strong>{form.name || "Partner"}</strong>. Our admin team will review your application and reach out to <strong>{form.email}</strong> within 3–5 business days.
            </p>
            <button
              onClick={() => { setSubmitted(false); setForm({ name: "", email: "", phone: "", instagram: "", address: "", gownCount: "", message: "" }); }}
              className="text-xs text-[#B32F4E] hover:text-[#8D2040] transition font-semibold"
            >
              Submit another application
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-3xl p-8 shadow-glass space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3 h-3" /> Full Name *
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Maria Santos"
                  className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl placeholder:text-[#2D1A22]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                  className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl placeholder:text-[#2D1A22]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-3 h-3" /> Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="+63 9XX XXX XXXX"
                  className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl placeholder:text-[#2D1A22]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Instagram className="w-3 h-3" /> Instagram / TikTok
                </label>
                <input
                  name="instagram"
                  value={form.instagram}
                  onChange={handleChange}
                  placeholder="@yourhandle"
                  className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl placeholder:text-[#2D1A22]/30"
                />
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" /> Address (for drop-off/payout) *
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  required
                  placeholder="Full address for gown drop-off and payout settlements"
                  className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl placeholder:text-[#2D1A22]/30"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Package className="w-3 h-3" /> Estimated Gown Count *
                </label>
                <select
                  name="gownCount"
                  value={form.gownCount}
                  onChange={handleChange}
                  required
                  className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl cursor-pointer"
                >
                  <option value="">Select range…</option>
                  <option value="1-3">1–3 pieces</option>
                  <option value="4-10">4–10 pieces</option>
                  <option value="11-25">11–25 pieces</option>
                  <option value="25+">25+ pieces</option>
                </select>
              </div>

              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-[#2D1A22]/60 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Tell Us About Your Collection
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your gowns — designers, styles, occasions they're suited for. Anything you'd like us to know…"
                  className="glass-input w-full px-3 py-2.5 text-sm text-[#2D1A22] rounded-xl placeholder:text-[#2D1A22]/30 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#B32F4E] hover:bg-[#8D2040] text-white py-3.5 rounded-2xl font-semibold text-sm transition-all shadow-wine-glow hover:-translate-y-0.5 active:translate-y-0"
            >
              <Send className="w-4 h-4" />
              Submit Application
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-center text-[10px] text-[#2D1A22]/35">
              By submitting, you agree that our admin team may contact you at the details provided.
            </p>
          </form>
        )}
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#B32F4E]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map(({ q, a }, idx) => (
            <div
              key={q}
              className="bg-[#FFEEEE]/70 backdrop-blur-md border border-white/50 rounded-2xl shadow-glass overflow-hidden transition-all duration-200"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left group"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
              >
                <span className="font-display font-bold text-sm text-[#2D1A22] group-hover:text-[#B32F4E] transition pr-4">
                  {q}
                </span>
                <span className="shrink-0 text-[#B32F4E]">
                  {openFaq === idx ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </span>
              </button>

              {openFaq === idx && (
                <div className="px-5 pb-5">
                  <div className="border-t border-[#FFB5BD]/30 pt-4 text-xs text-[#2D1A22]/60 leading-relaxed">
                    {a}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#8D9A2E] via-[#6D7A1E] to-[#8D9A2E] border border-white/10 p-10 sm:p-14 text-center shadow-glass">
        <div className="absolute inset-0 bg-[#1A2210]/30 pointer-events-none rounded-3xl" />
        <div className="relative z-10 space-y-5 max-w-xl mx-auto">
          <HeartHandshake className="w-10 h-10 text-white/60 mx-auto" />
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            Your Wardrobe. Your Earnings.
          </h2>
          <p className="text-white/60 text-sm leading-relaxed">
            Join our growing network of consignor partners and turn idle fashion
            into a meaningful income stream.
          </p>
          <a
            href="#apply"
            className="inline-flex items-center gap-2 bg-white text-[#8D9A2E] hover:bg-[#F4F7CD] px-8 py-3.5 rounded-2xl font-bold text-sm transition-all shadow-lg hover:-translate-y-0.5"
          >
            <HeartHandshake className="w-4 h-4" />
            Apply Now
          </a>
        </div>
      </section>
    </div>
  );
}
