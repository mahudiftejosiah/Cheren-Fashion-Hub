'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { submitQuoteRequest } from '@/app/actions/quotes';
import { Send, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function QuotePage() {
  const searchParams = useSearchParams();
  const defaultOutfit = searchParams.get('outfit') || '';

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitQuoteRequest(formData);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(res.error || 'Failed to submit quote request.');
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-2">
          Bespoke Estimator
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Request a Custom Quotation
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Share your style vision, fabric preferences, or reference photos. Our designers will calculate estimated pricing and production timelines.
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-lg">
        {successMsg ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-fashion-serif text-2xl font-bold text-zinc-900 dark:text-white">
              Quote Request Received!
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-md mx-auto">
              {successMsg}
            </p>
            <button
              onClick={() => setSuccessMsg(null)}
              className="mt-4 px-6 py-2.5 rounded-full bg-gold-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors"
            >
              Submit Another Quote
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Grid 1: Personal Contact */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Adewale Johnson"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Phone / WhatsApp *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+234 812 345 6789"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="adewale@example.com"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Grid 2: Outfit Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Outfit Type / Category *
                </label>
                <select
                  name="outfitType"
                  defaultValue={defaultOutfit ? 'Custom' : 'Agbada'}
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="Traditional Agbada Set">Traditional Agbada Set</option>
                  <option value="Bespoke Suit & Tuxedo">Bespoke Suit & Tuxedo</option>
                  <option value="Haute Couture Evening Gown">Haute Couture Evening Gown</option>
                  <option value="Bridal / Wedding Outfit">Bridal / Wedding Outfit</option>
                  <option value="Occasion / Celebration Wear">Occasion / Celebration Wear</option>
                  <option value="Custom Design (Photo Inspired)">Custom Design (Photo Inspired)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Preferred Fabric (Optional)
                </label>
                <input
                  type="text"
                  name="preferredFabric"
                  placeholder="e.g. Italian Wool, Silk Damask, Velvet, Lace"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Outfit Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Outfit Description & Specific Instructions *
              </label>
              <textarea
                name="description"
                required
                rows={5}
                defaultValue={defaultOutfit ? `Recreation request for: ${defaultOutfit}` : ''}
                placeholder="Describe color scheme, embroidery details, sleeve cuts, collar styling, or fitting preferences..."
                className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            {/* Grid 3: Deadline & Reference Image */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Desired Completion Deadline Date
                </label>
                <input
                  type="date"
                  name="desiredDeadline"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Optional Reference Image URL
                </label>
                <input
                  type="url"
                  name="referenceImageUrl"
                  placeholder="https://images.unsplash.com/sample-inspiration.jpg"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.01] transition-transform flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Submitting Request...' : 'Submit Quotation Request'}</span>
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
