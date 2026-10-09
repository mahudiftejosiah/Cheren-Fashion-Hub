'use client';

import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  Package, 
  Truck, 
  Star, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  Send, 
  ShieldCheck, 
  Scissors, 
  Ruler, 
  Sparkles,
  X,
} from 'lucide-react';
import { getOrderByTrackingNumber, confirmOrderReceipt } from '@/app/actions/orders';
import { submitCustomerFeedback } from '@/app/actions/feedback';

const STAGES = [
  { key: 'ORDER_RECEIVED', label: 'Order Received', desc: 'Order logged into system' },
  { key: 'CONSULTATION', label: 'Consultation', desc: 'Fabric & design aligned' },
  { key: 'MEASUREMENTS_CONFIRMED', label: 'Measurements Confirmed', desc: 'Sizing verified' },
  { key: 'IN_PRODUCTION', label: 'In Production', desc: 'Pattern cutting & stitching' },
  { key: 'QUALITY_CHECK', label: 'Quality Check', desc: 'Zero-defect inspection' },
  { key: 'READY', label: 'Ready for Dispatch', desc: 'Packaged in suit bag' },
  { key: 'OUT_FOR_DELIVERY', label: 'Out for Delivery', desc: 'With express courier' },
  { key: 'DELIVERED', label: 'Delivered', desc: 'Arrived at your address' },
  { key: 'CUSTOMER_CONFIRMED', label: 'Customer Confirmed', desc: 'Receipt confirmed by you' },
];

export function TrackOrderClient() {
  const [trackingInput, setTrackingInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderData, setOrderData] = useState<any>(null);

  // Delivery receipt confirmation state
  const [confirming, setConfirming] = useState(false);
  const [confirmMsg, setConfirmMsg] = useState<string | null>(null);

  // Feedback state
  const [rating, setRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [feedbackSubmitting, setFeedbackSubmitting] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setLoading(true);
    setError(null);
    setConfirmMsg(null);
    setFeedbackSuccess(null);

    const res = await getOrderByTrackingNumber(trackingInput);
    setLoading(false);

    if (res.success && res.order) {
      setOrderData(res.order);
    } else {
      setError(res.error || 'Failed to locate order.');
      setOrderData(null);
    }
  };

  const handleCancel = () => {
    setTrackingInput('');
    setOrderData(null);
    setError(null);
    setConfirmMsg(null);
    setFeedbackSuccess(null);
    setFeedbackError(null);
  };

  const handleConfirmReceipt = async () => {
    if (!orderData) return;
    setConfirming(true);
    setConfirmMsg(null);

    const res = await confirmOrderReceipt(orderData.trackingNumber);
    setConfirming(false);

    if (res.success) {
      setConfirmMsg(res.message);
      setOrderData({
        ...orderData,
        status: 'CUSTOMER_CONFIRMED',
        confirmedAt: res.confirmedAt,
        stageIndex: STAGES.length - 1,
      });
    } else {
      setConfirmMsg(res.error || 'Confirmation failed.');
    }
  };

  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderData) return;

    setFeedbackSubmitting(true);
    setFeedbackError(null);
    setFeedbackSuccess(null);

    const formData = new FormData();
    formData.append('trackingNumber', orderData.trackingNumber);
    formData.append('rating', rating.toString());
    formData.append('review', reviewText);
    formData.append('customerName', orderData.customerName);
    if (imageUrl) formData.append('imageUrl', imageUrl);

    const res = await submitCustomerFeedback(formData);
    setFeedbackSubmitting(false);

    if (res.success) {
      setFeedbackSuccess(res.message || 'Feedback submitted!');
      setOrderData({ ...orderData, hasFeedback: true });
    } else {
      setFeedbackError(res.error || 'Failed to submit review.');
    }
  };

  return (
    <div className="space-y-10">
      
      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="max-w-xl mx-auto">
        <div className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Tracking Number (e.g. FH-2026-0001)"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              className="w-full pl-5 pr-32 py-4 rounded-full bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 text-sm font-mono text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500 shadow-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center space-x-1.5"
            >
              {loading ? (
                <span>Searching...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track</span>
                </>
              )}
            </button>
          </div>

          {/* Cancel button — only shown when there's input or results */}
          {(trackingInput || orderData || error) && (
            <button
              type="button"
              onClick={handleCancel}
              className="shrink-0 px-5 py-4 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-300 font-bold text-xs uppercase tracking-wider transition-colors flex items-center space-x-1.5"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </form>

      {/* Error Alert */}
      {error && (
        <div className="max-w-xl mx-auto p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-sm flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Order Details & Progress Timeline */}
      {orderData && (
        <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-lg space-y-10">
          
          {/* Header info */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-zinc-100 dark:border-zinc-800 gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500 block">
                Tracking Reference
              </span>
              <h2 className="font-mono text-2xl font-bold text-zinc-900 dark:text-white">
                {orderData.trackingNumber}
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 text-sm font-medium mt-1">
                Outfit: <span className="text-zinc-900 dark:text-white font-bold">{orderData.outfitTitle}</span>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <div className="px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-500 text-xs font-bold uppercase tracking-wider">
                Status: {orderData.status.replace(/_/g, ' ')}
              </div>
            </div>
          </div>

          {/* Key Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Customer</span>
              <p className="font-bold text-sm text-zinc-900 dark:text-white">{orderData.customerName}</p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Expected Completion</span>
              <p className="font-bold text-sm text-zinc-900 dark:text-white flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-gold-500" />
                {orderData.expectedCompletionDate || 'To be scheduled'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
              <span className="text-[10px] uppercase font-bold text-zinc-400 block mb-1">Delivery Destination</span>
              <p className="font-bold text-sm text-zinc-900 dark:text-white truncate flex items-center">
                <MapPin className="w-3.5 h-3.5 mr-1 text-gold-500 shrink-0" />
                {orderData.deliveryAddress || 'Studio Pickup'}
              </p>
            </div>
          </div>

          {/* 9-Stage Interactive Timeline */}
          <div>
            <h3 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white mb-6">
              Tailoring Workflow Progress
            </h3>

            <div className="space-y-4">
              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= orderData.stageIndex;
                const isCurrent = idx === orderData.stageIndex;

                return (
                  <div
                    key={stage.key}
                    className={`flex items-start space-x-4 p-4 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-gold-500/10 border-gold-500 shadow-sm'
                        : isCompleted
                        ? 'bg-zinc-50 dark:bg-zinc-800/30 border-zinc-200 dark:border-zinc-800'
                        : 'opacity-40 border-zinc-100 dark:border-zinc-900'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        isCompleted
                          ? 'bg-gold-500 text-zinc-950 shadow-glow'
                          : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-500'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4
                          className={`font-bold text-sm ${
                            isCurrent
                              ? 'text-gold-600 dark:text-gold-400 font-extrabold'
                              : 'text-zinc-900 dark:text-white'
                          }`}
                        >
                          {stage.label}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500 animate-pulse">
                            Current Stage
                          </span>
                        )}
                      </div>
                      <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{stage.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Delivery Receipt Confirmation Action Box */}
          <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800">
            {orderData.status === 'DELIVERED' && !orderData.confirmedAt && (
              <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-4">
                <ShieldCheck className="w-8 h-8 text-emerald-500 mx-auto" />
                <h4 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">
                  Have you received your outfit?
                </h4>
                <p className="text-zinc-600 dark:text-zinc-300 text-xs max-w-md mx-auto">
                  Please confirm receipt below once your garment has been physically delivered to you.
                </p>

                <button
                  onClick={handleConfirmReceipt}
                  disabled={confirming}
                  className="px-8 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition-all"
                >
                  {confirming ? 'Confirming...' : 'YES, I HAVE RECEIVED IT'}
                </button>

                {confirmMsg && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{confirmMsg}</p>
                )}
              </div>
            )}

            {(orderData.status === 'CUSTOMER_CONFIRMED' || orderData.confirmedAt) && (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center justify-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Delivery confirmed on {new Date(orderData.confirmedAt || Date.now()).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {/* Feedback & Star Rating Form (Unlocked after receipt confirmation or if confirmed) */}
          {(orderData.status === 'CUSTOMER_CONFIRMED' || orderData.confirmedAt) && (
            <div className="pt-8 border-t border-zinc-100 dark:border-zinc-800 space-y-6">
              <div className="text-center max-w-md mx-auto">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-500 block">
                  Your Opinion Matters
                </span>
                <h3 className="font-fashion-serif text-2xl font-bold text-zinc-900 dark:text-white">
                  Leave a Review & Rating
                </h3>
              </div>

              {orderData.hasFeedback || feedbackSuccess ? (
                <div className="p-6 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-center text-gold-600 dark:text-gold-400 text-sm font-bold space-y-2">
                  <Sparkles className="w-6 h-6 mx-auto" />
                  <p>{feedbackSuccess || 'Feedback has been submitted for this order. Thank you!'}</p>
                </div>
              ) : (
                <form onSubmit={handleFeedbackSubmit} className="max-w-lg mx-auto space-y-5">
                  {/* Star Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2 text-center">
                      Rate Your Outfit (1 - 5 Stars)
                    </label>
                    <div className="flex items-center justify-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-125 transition-transform"
                        >
                          <Star
                            className={`w-7 h-7 ${
                              star <= rating
                                ? 'text-amber-400 fill-amber-400'
                                : 'text-zinc-300 dark:text-zinc-700'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Review text */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Written Review / Experience
                    </label>
                    <textarea
                      required
                      rows={4}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your thoughts on fit, fabric quality, and tailoring craftsmanship..."
                      className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  {/* Optional Photo URL */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">
                      Optional Photo URL (Upload your photo wearing the outfit)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/your-photo.jpg"
                      className="w-full p-3 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                    />
                  </div>

                  {feedbackError && (
                    <p className="text-xs font-bold text-rose-500 text-center">{feedbackError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={feedbackSubmitting}
                    className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-md hover:scale-[1.02] transition-all flex items-center justify-center space-x-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>{feedbackSubmitting ? 'Submitting...' : 'Submit Feedback'}</span>
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      )}

    </div>
  );
}
