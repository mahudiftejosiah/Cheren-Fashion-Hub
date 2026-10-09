'use client';

import React, { useState } from 'react';
import { submitAppointmentRequest } from '@/app/actions/appointments';
import { Calendar as CalendarIcon, Clock, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function BookConsultationPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitAppointmentRequest(formData);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(res.error || 'Booking failed.');
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="text-center">
        <span className="text-xs font-bold text-gold-500 uppercase tracking-widest block mb-2">
          Personal Appointment
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
          Book a Personal Consultation
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
          Reserve an in-person studio consultation or virtual video fitting with our lead fashion designer.
        </p>
      </div>

      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-lg">
        {successMsg ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="font-fashion-serif text-2xl font-bold text-zinc-900 dark:text-white">
              Consultation Booked!
            </h2>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-md mx-auto">
              {successMsg}
            </p>
            <button
              onClick={() => setSuccessMsg(null)}
              className="mt-4 px-6 py-2.5 rounded-full bg-gold-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors"
            >
              Book Another Appointment
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Dr. Ngozi Eze"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="+234 800 000 0000"
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
                  placeholder="ngozi@example.com"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Preferred Date *
                </label>
                <input
                  type="date"
                  name="preferredDate"
                  required
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Preferred Time Slot *
                </label>
                <select
                  name="preferredTime"
                  defaultValue="10:00 AM"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="09:00 AM">09:00 AM</option>
                  <option value="10:00 AM">10:00 AM</option>
                  <option value="11:30 AM">11:30 AM</option>
                  <option value="01:00 PM">01:00 PM</option>
                  <option value="03:00 PM">03:00 PM</option>
                  <option value="05:00 PM">05:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Service Type *
                </label>
                <select
                  name="serviceType"
                  defaultValue="In-Studio Bespoke Fitting"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="In-Studio Bespoke Fitting">In-Studio Bespoke Fitting</option>
                  <option value="Virtual Video Consultation">Virtual Video Consultation</option>
                  <option value="Bridal Party Fitting Session">Bridal Party Fitting Session</option>
                  <option value="Wardrobe Styling Consultation">Wardrobe Styling Consultation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Additional Information / Outfit Inspiration
              </label>
              <textarea
                name="additionalInfo"
                rows={4}
                placeholder="Tell us about your upcoming event date, style expectations, or specific questions..."
                className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.01] transition-transform flex items-center justify-center space-x-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>{loading ? 'Processing Booking...' : 'Confirm Consultation Booking'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
