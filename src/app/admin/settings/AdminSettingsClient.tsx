'use client';

import React, { useState } from 'react';
import { Save, CheckCircle2, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { updateBusinessSettingsAction } from '@/app/actions/admin';
import { SettingsData } from '@/lib/getSettings';

interface AdminSettingsClientProps {
  settings: SettingsData;
}

export function AdminSettingsClient({ settings }: AdminSettingsClientProps) {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateBusinessSettingsAction(formData);
    setLoading(false);

    if (res.success) {
      setMsg(res.message || 'Settings saved successfully!');
    } else {
      setError(res.error || 'Failed to update settings.');
    }
  };

  return (
    <div className="rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-10 shadow-2xl space-y-6">
      {msg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{msg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand Core */}
        <div className="space-y-4">
          <h2 className="font-fashion-serif text-xl font-bold text-white border-l-2 border-gold-500 pl-3">
            Brand Identity
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Business Name *
              </label>
              <input
                type="text"
                name="businessName"
                defaultValue={settings.businessName}
                required
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Tagline *
              </label>
              <input
                type="text"
                name="tagline"
                defaultValue={settings.tagline}
                required
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h2 className="font-fashion-serif text-xl font-bold text-white border-l-2 border-gold-500 pl-3">
            Contact & WhatsApp
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Telephone Number
              </label>
              <input
                type="text"
                name="phone"
                defaultValue={settings.phone}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                WhatsApp Number (Digits only, no + sign)
              </label>
              <input
                type="text"
                name="whatsappNumber"
                defaultValue={settings.whatsappNumber}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Official Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={settings.email}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Studio Address
              </label>
              <input
                type="text"
                name="address"
                defaultValue={settings.address}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Opening Hours
              </label>
              <input
                type="text"
                name="openingHours"
                defaultValue={settings.openingHours}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h2 className="font-fashion-serif text-xl font-bold text-white border-l-2 border-gold-500 pl-3">
            Social Media Links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                name="instagramUrl"
                defaultValue={settings.instagramUrl}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                TikTok URL
              </label>
              <input
                type="url"
                name="tiktokUrl"
                defaultValue={settings.tiktokUrl}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Facebook URL
              </label>
              <input
                type="url"
                name="facebookUrl"
                defaultValue={settings.facebookUrl}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        {/* Text Copy */}
        <div className="space-y-4 pt-4 border-t border-zinc-800">
          <h2 className="font-fashion-serif text-xl font-bold text-white border-l-2 border-gold-500 pl-3">
            About & Mission Texts
          </h2>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
              Short Bio / Introduction
            </label>
            <textarea
              name="bioText"
              rows={3}
              defaultValue={settings.bioText}
              className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Mission Statement
              </label>
              <textarea
                name="missionText"
                rows={3}
                defaultValue={settings.missionText}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                Vision Statement
              </label>
              <textarea
                name="visionText"
                rows={3}
                defaultValue={settings.visionText}
                className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-all flex items-center justify-center space-x-2"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving Settings...' : 'Save All Business Settings'}</span>
        </button>
      </form>
    </div>
  );
}
