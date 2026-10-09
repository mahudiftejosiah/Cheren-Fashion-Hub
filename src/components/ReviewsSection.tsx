'use client';

import React, { useState } from 'react';
import { Star, ChevronDown, ChevronUp, CheckCircle2, Send, AlertCircle, MessageSquare } from 'lucide-react';
import { submitCustomerFeedback } from '@/app/actions/feedback';

interface Review {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  imageUrl: string | null;
  createdAt: Date;
}

interface ReviewsSectionProps {
  testimonials: Review[];
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          aria-label={`${star} star`}
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hovered || value)
                ? 'text-pink-500 fill-pink-500'
                : 'text-zinc-500 dark:text-zinc-600'
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-xs font-bold text-pink-600 dark:text-pink-400">
          {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][value]}
        </span>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.review.length > 120;
  const preview = isLong && !expanded ? review.review.slice(0, 120) + '…' : review.review;

  return (
    <div className="rounded-2xl bg-white dark:bg-zinc-950 border border-pink-200 dark:border-zinc-800 shadow-md overflow-hidden transition-all duration-300">
      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-pink-50/50 dark:hover:bg-zinc-900/50 transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex items-center space-x-4 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-purple-600 text-white font-black flex items-center justify-center text-sm shadow-pink-glow shrink-0">
            {review.customerName[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white truncate">{review.customerName}</h3>
            {/* Stars inline */}
            <div className="flex items-center space-x-0.5 mt-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < review.rating ? 'text-pink-500 fill-pink-500' : 'text-zinc-300 dark:text-zinc-600'}`}
                />
              ))}
              <span className="ml-1.5 text-[10px] font-bold text-zinc-500">
                {review.rating}/5
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3 shrink-0 ml-3">
          <span className="text-[10px] text-zinc-400 hidden sm:block">
            {new Date(review.createdAt).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
          </span>
          {expanded
            ? <ChevronUp className="w-4 h-4 text-pink-500 shrink-0" />
            : <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
          }
        </div>
      </button>

      {/* Expandable body */}
      {expanded && (
        <div className="px-5 pb-5 pt-1 border-t border-pink-100 dark:border-zinc-800 space-y-3">
          <p className="text-zinc-700 dark:text-zinc-300 text-sm italic leading-relaxed">
            "{review.review}"
          </p>
          <div className="flex items-center space-x-2 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Bespoke Client</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function ReviewsSection({ testimonials }: ReviewsSectionProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a star rating before submitting.');
      return;
    }
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    fd.set('rating', String(rating));

    const res = await submitCustomerFeedback(fd);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
      setRating(0);
      (e.target as HTMLFormElement).reset();
    } else {
      setError(res.error || 'Failed to submit review.');
    }
  };

  // Average rating
  const avgRating = testimonials.length
    ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
    : null;

  return (
    <section className="bg-pink-50/50 dark:bg-zinc-900/40 py-24 border-y border-pink-200 dark:border-pink-500/20 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* Section heading */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 tracking-[0.25em] uppercase block font-cinzel">
            Client Accolades
          </span>
          <h2 className="font-fashion-serif text-3xl sm:text-5xl font-bold text-zinc-900 dark:text-white">
            What Our Clients Say
          </h2>
          {avgRating && (
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-pink-500/10 border border-pink-400/30 text-pink-700 dark:text-pink-300">
              <Star className="w-4 h-4 fill-pink-500 text-pink-500" />
              <span className="text-sm font-black">{avgRating}</span>
              <span className="text-xs font-medium">average from {testimonials.length} verified client{testimonials.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {/* Reviews accordion list */}
        {testimonials.length === 0 ? (
          <div className="text-center py-10 text-zinc-500 dark:text-zinc-400 text-sm">
            No verified reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="space-y-3">
            {testimonials.map((t) => (
              <ReviewCard key={t.id} review={t} />
            ))}
          </div>
        )}

        {/* Leave a Review toggle */}
        <div className="pt-4">
          {!formOpen && !success && (
            <div className="text-center">
              <button
                onClick={() => setFormOpen(true)}
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-pink-glow hover:opacity-90 hover:scale-105 transition-all border border-pink-300/30"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Leave a Review</span>
              </button>
            </div>
          )}

          {success && (
            <div className="text-center py-8 space-y-4 rounded-3xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 text-emerald-500 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">
                Thank You for Your Feedback!
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm">
                Your review has been submitted and is pending verification by our team.
              </p>
              <button
                onClick={() => { setSuccess(false); setFormOpen(false); }}
                className="text-xs font-bold text-pink-600 dark:text-pink-400 hover:underline"
              >
                Close
              </button>
            </div>
          )}

          {formOpen && !success && (
            <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-pink-200 dark:border-zinc-800 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-fashion-serif text-2xl font-bold text-zinc-900 dark:text-white border-l-2 border-pink-500 pl-3">
                  Share Your Experience
                </h3>
                <button
                  onClick={() => { setFormOpen(false); setError(null); }}
                  className="text-xs font-bold text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  Cancel
                </button>
              </div>

              {error && (
                <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Star Rating Picker */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
                    Your Rating *
                  </label>
                  <StarPicker value={rating} onChange={setRating} />
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="customerName"
                    required
                    placeholder="e.g. Fatima Bello"
                    className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500"
                  />
                </div>

                {/* Optional order tracking */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Order Tracking Number <span className="text-zinc-400 font-normal normal-case">(optional — links review to your order)</span>
                  </label>
                  <input
                    type="text"
                    name="trackingNumber"
                    placeholder="e.g. FH-2026-0001"
                    className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500 font-mono"
                  />
                </div>

                {/* Review text */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                    Your Review *
                  </label>
                  <textarea
                    name="review"
                    required
                    rows={4}
                    minLength={20}
                    placeholder="Tell us about your experience with Cheren Fashion Hub..."
                    className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-white focus:outline-none focus:border-pink-500 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-pink-glow hover:opacity-90 transition-all flex items-center justify-center space-x-2 disabled:opacity-60"
                >
                  <Send className="w-4 h-4" />
                  <span>{loading ? 'Submitting Review...' : 'Submit My Review'}</span>
                </button>

                <p className="text-center text-[11px] text-zinc-400">
                  Reviews are moderated by our team before going live on the website.
                </p>
              </form>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
