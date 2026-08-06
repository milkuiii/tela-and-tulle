"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, ArrowRight, AlertCircle, Loader2, Phone, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { createUserProfile } from "@/app/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/home");
        router.refresh();
      } else {
        // 1. Create the auth user
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
        if (!signUpData.user) throw new Error("Sign up succeeded but no user was returned.");

        // 2. Insert the matching row into public.users using Server Action to bypass RLS
        const res = await createUserProfile({
          id: signUpData.user.id,
          email,
          fullName,
          phone,
          address,
        });

        if (!res.success) {
          throw new Error(`Account created but profile setup failed: ${res.error}. Please contact support.`);
        }

        router.push("/home");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] w-full flex items-center justify-center p-4">
      {/* Background Gradients */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[#FFB5BD]/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#F4F7CD]/40 blur-[120px]" />
      </div>

      <div className="w-full max-w-md relative animate-in fade-in zoom-in-95 duration-500">
        {/* Decorative Elements */}
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#B32F4E]/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-[#8D9A2E]/10 rounded-full blur-2xl" />

        <div className="bg-white/60 backdrop-blur-xl border border-white/50 p-8 rounded-3xl shadow-glass relative overflow-hidden">
          {/* Header */}
          <div className="text-center mb-8 relative z-10">
            <Link href="/home" className="inline-block mb-6 group">
              <span className="font-display text-3xl text-[#B32F4E] font-bold group-hover:text-[#8D2040] transition block">
                tela&tulle
              </span>
              <span className="text-[9px] uppercase tracking-[0.3em] text-[#8D9A2E] font-medium block mt-1">
                {isLogin ? "Welcome Back" : "Join Our Community"}
              </span>
            </Link>
            <h1 className="text-2xl font-bold text-[#2D1A22] mb-2">
              {isLogin ? "Sign In to Your Account" : "Create an Account"}
            </h1>
            <p className="text-sm text-[#2D1A22]/60">
              {isLogin
                ? "Access your wardrobe and manage your rentals"
                : "Join the most sustainable fashion community"}
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-100 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-4 relative z-10" onSubmit={handleSubmit}>
            {!isLogin && (
              <>
                <div className="space-y-1.5 group">
                  <label className="text-xs font-semibold text-[#2D1A22]/70 uppercase tracking-wider ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-4 w-4 text-[#2D1A22]/40 group-focus-within:text-[#B32F4E] transition-colors" />
                    </div>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 bg-white/40 focus:bg-white focus:border-[#B32F4E]/50 focus:ring-4 focus:ring-[#B32F4E]/10 transition-all outline-none text-[#2D1A22] placeholder:text-[#2D1A22]/30"
                      placeholder="Sophia Martinez"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <label className="text-xs font-semibold text-[#2D1A22]/70 uppercase tracking-wider ml-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Phone className="h-4 w-4 text-[#2D1A22]/40 group-focus-within:text-[#B32F4E] transition-colors" />
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 bg-white/40 focus:bg-white focus:border-[#B32F4E]/50 focus:ring-4 focus:ring-[#B32F4E]/10 transition-all outline-none text-[#2D1A22] placeholder:text-[#2D1A22]/30"
                      placeholder="+63 912 345 6789"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 group">
                  <label className="text-xs font-semibold text-[#2D1A22]/70 uppercase tracking-wider ml-1">
                    Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-4 w-4 text-[#2D1A22]/40 group-focus-within:text-[#B32F4E] transition-colors" />
                    </div>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 bg-white/40 focus:bg-white focus:border-[#B32F4E]/50 focus:ring-4 focus:ring-[#B32F4E]/10 transition-all outline-none text-[#2D1A22] placeholder:text-[#2D1A22]/30"
                      placeholder="123 Main St, Manila"
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-[#2D1A22]/70 uppercase tracking-wider ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-[#2D1A22]/40 group-focus-within:text-[#B32F4E] transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 bg-white/40 focus:bg-white focus:border-[#B32F4E]/50 focus:ring-4 focus:ring-[#B32F4E]/10 transition-all outline-none text-[#2D1A22] placeholder:text-[#2D1A22]/30"
                  placeholder="sophia@example.com"
                />
              </div>
            </div>

            <div className="space-y-1.5 group">
              <label className="text-xs font-semibold text-[#2D1A22]/70 uppercase tracking-wider ml-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-[#2D1A22]/40 group-focus-within:text-[#B32F4E] transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/60 bg-white/40 focus:bg-white focus:border-[#B32F4E]/50 focus:ring-4 focus:ring-[#B32F4E]/10 transition-all outline-none text-[#2D1A22] placeholder:text-[#2D1A22]/30"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex justify-end pt-1">
                {/* <button
                  type="button"
                  className="text-xs font-medium text-[#B32F4E] hover:text-[#8D2040] transition-colors"
                >
                  Forgot password?
                </button> */}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-[#B32F4E] hover:bg-[#8D2040] text-white py-3.5 rounded-xl font-semibold shadow-lg shadow-[#B32F4E]/20 flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:hover:translate-y-0"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="mt-8 text-center text-sm text-[#2D1A22]/60 relative z-10">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
              }}
              className="font-semibold text-[#B32F4E] hover:text-[#8D2040] transition-colors underline underline-offset-4 decoration-[#B32F4E]/30 hover:decoration-[#8D2040]"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
