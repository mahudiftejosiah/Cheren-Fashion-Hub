'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginAdminAction } from '@/app/actions/auth';
import { Scissors, Lock, Mail, ArrowRight, AlertCircle, KeyRound, Eye, EyeOff, Crown, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassphrase, setShowPassphrase] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Lock out after 5 failed attempts
    if (attempts >= 5) {
      setError('Too many failed attempts. Please refresh the page to try again.');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await loginAdminAction(formData);
    setLoading(false);

    if (res.success) {
      router.push('/admin');
      router.refresh();
    } else {
      setAttempts((prev) => prev + 1);
      setError(res.error || 'Login failed.');
    }
  };

  const remainingAttempts = 5 - attempts;
  const isLocked = attempts >= 5;

  return (
    // Full-screen isolated layout — no navbar, no footer, no links to public site
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-zinc-950 text-white relative overflow-hidden">

      {/* Ambient background orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-pink-500/10 via-purple-500/5 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-gradient-to-tl from-rose-500/10 to-transparent blur-3xl pointer-events-none" />

      {/* Security badge top bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600" />

      <div className="relative z-10 w-full max-w-md px-4">

        {/* Branding header */}
        <div className="text-center mb-8 space-y-3">
          <div className="relative w-16 h-16 mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-500 via-pink-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-pink-500/30">
              <Scissors className="w-7 h-7 text-white stroke-[2.2]" />
            </div>
            <Crown className="w-5 h-5 text-pink-300 absolute -top-2 -right-1" />
          </div>

          <div>
            <h1 className="font-cinzel text-2xl font-black tracking-widest text-white uppercase">
              Cheren Fashion
            </h1>
            <p className="text-[10px] tracking-[0.3em] uppercase text-pink-400 font-semibold mt-1">
              Studio Management Portal
            </p>
          </div>

          {/* Security seal */}
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>3-Layer Secured Access</span>
          </div>
        </div>

        {/* Login card */}
        <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl space-y-6">
          <div>
            <h2 className="text-lg font-bold text-white border-l-2 border-pink-500 pl-3">
              Administrator Login
            </h2>
            <p className="text-zinc-500 text-[11px] mt-1.5 pl-3">
              All three credentials are required for access.
            </p>
          </div>

          {/* Error alert */}
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="block">{error}</span>
                {!isLocked && attempts > 0 && (
                  <span className="text-rose-500/70 text-[10px] mt-0.5 block">
                    {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} remaining before lockout.
                  </span>
                )}
              </div>
            </div>
          )}

          {isLocked ? (
            <div className="py-6 text-center space-y-3">
              <Lock className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-rose-400 text-sm font-bold">Access Locked</p>
              <p className="text-zinc-500 text-xs">
                Too many failed attempts. Please refresh the page to try again.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" autoComplete="off">

              {/* Email */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    name="email"
                    required
                    autoComplete="off"
                    placeholder="Enter admin email"
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors font-mono"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    required
                    autoComplete="new-password"
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    tabIndex={-1}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Secret Passphrase */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                  Secret Passphrase
                  <span className="ml-2 text-[9px] text-zinc-600 normal-case font-normal tracking-normal">
                    (master key — required for all logins)
                  </span>
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassphrase ? 'text' : 'password'}
                    name="passphrase"
                    required
                    autoComplete="off"
                    placeholder="Enter secret passphrase"
                    className="w-full pl-10 pr-11 py-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-pink-500 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassphrase(!showPassphrase)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                    tabIndex={-1}
                    aria-label="Toggle passphrase visibility"
                  >
                    {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-px bg-zinc-800" />
                <ShieldCheck className="w-3.5 h-3.5 text-zinc-600" />
                <div className="flex-1 h-px bg-zinc-800" />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-2xl shadow-pink-500/20 hover:opacity-90 hover:scale-[1.02] transition-all flex items-center justify-center space-x-2 disabled:opacity-60 disabled:scale-100"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Access Admin Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer note */}
        <p className="text-center text-[10px] text-zinc-700 mt-6">
          Cheren Fashion Hub — Authorised Personnel Only
        </p>
      </div>
    </div>
  );
}
