'use client';

import React, { useState } from 'react';
import { submitApprenticeshipApplication } from '@/app/actions/apprenticeship';
import { GraduationCap, Scissors, CheckCircle2, BookOpen, Award, Send, AlertCircle } from 'lucide-react';

export default function ApprenticeshipPage() {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitApprenticeshipApplication(formData);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(res.error || 'Application submission failed.');
    }
  };

  const curriculum = [
    { title: 'Pattern Drafting & Draping', desc: 'Master physical measurement translation onto pattern paper and mannequin draping.' },
    { title: 'Haute Couture Sewing & Finishings', desc: 'Hand embroidery, French seams, invisible zippers, and coat lining techniques.' },
    { title: 'African Traditional Craft', desc: 'Precision cutting for Agbada, Senator sets, Corset lace dresses, and Gele styling.' },
    { title: 'Fashion Business & Studio Admin', desc: 'Pricing custom work, client consultations, order tracking systems, and digital marketing.' },
  ];

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 text-gold-500 text-xs font-bold uppercase tracking-widest mb-3">
          <GraduationCap className="w-4 h-4" />
          <span>Fashion Academy & Mentorship</span>
        </span>
        <h1 className="font-fashion-serif text-4xl sm:text-6xl font-bold text-zinc-900 dark:text-white mb-4">
          Become a Fashion Apprentice
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-base sm:text-lg">
          Join our immersive hands-on training program designed for aspiring fashion designers, tailors, and garment constructors.
        </p>
      </div>

      {/* Program Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {curriculum.map((c, i) => (
          <div
            key={i}
            className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm space-y-3"
          >
            <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-500 flex items-center justify-center font-bold">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-fashion-serif text-xl font-bold text-zinc-900 dark:text-white">
              {c.title}
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400 text-xs leading-relaxed">
              {c.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Application Form Box */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-lg">
        <div className="text-center max-w-md mx-auto mb-8">
          <h2 className="font-fashion-serif text-3xl font-bold text-zinc-900 dark:text-white mb-2">
            Apprenticeship Application
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-xs">
            Fill out the form below to apply for our next intake cohort.
          </p>
        </div>

        {successMsg ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-fashion-serif text-2xl font-bold text-zinc-900 dark:text-white">
              Application Submitted!
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm max-w-md mx-auto">
              {successMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g. Samuel Okafor"
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
                  placeholder="+234 812 000 0000"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="samuel@example.com"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Current Location / City *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Lekki, Lagos"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Experience Level *
                </label>
                <select
                  name="experienceLevel"
                  defaultValue="Beginner"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="Complete Beginner">Complete Beginner</option>
                  <option value="Intermediate Tailor">Intermediate Tailor</option>
                  <option value="Advanced Designer">Advanced Designer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Current Skill Level
                </label>
                <input
                  type="text"
                  name="skillLevel"
                  placeholder="e.g. Basic machine sewing"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Availability
                </label>
                <select
                  name="availability"
                  defaultValue="Full-Time (Mon-Fri)"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                >
                  <option value="Full-Time (Mon-Fri)">Full-Time (Mon-Fri)</option>
                  <option value="Part-Time Weekend">Part-Time Weekend</option>
                  <option value="Evening Cohort">Evening Cohort</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Why do you want to become an apprentice with us? *
              </label>
              <textarea
                name="motivation"
                required
                rows={4}
                placeholder="Share your passion for fashion, career aspirations, and what you hope to learn..."
                className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.01] transition-transform flex items-center justify-center space-x-2"
            >
              <GraduationCap className="w-4 h-4" />
              <span>{loading ? 'Submitting Application...' : 'Submit Apprenticeship Application'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
