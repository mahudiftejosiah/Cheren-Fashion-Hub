'use client';

import React, { useState } from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageCircle, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Instagram, 
  Facebook 
} from 'lucide-react';
import { submitContactMessage } from '@/app/actions/contact';
import { SettingsData } from '@/lib/getSettings';

interface ContactClientProps {
  settings: SettingsData;
}

export function ContactClient({ settings }: ContactClientProps) {
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    const formData = new FormData(e.currentTarget);
    const res = await submitContactMessage(formData);
    setLoading(false);

    if (res.success) {
      setSuccessMsg(res.message);
      (e.target as HTMLFormElement).reset();
    } else {
      setErrorMsg(res.error || 'Failed to send message.');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      
      {/* Col 1: Business Details & Location */}
      <div className="space-y-8">
        <div className="rounded-3xl bg-zinc-950 text-white p-8 border border-zinc-800 space-y-6">
          <h2 className="font-fashion-serif text-3xl font-bold border-l-2 border-gold-500 pl-4">
            Studio Details
          </h2>

          <ul className="space-y-6 text-sm text-zinc-300">
            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold mb-1">Studio Address</strong>
                <span>{settings.address}</span>
              </div>
            </li>

            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold mb-1">Telephone & Enquiries</strong>
                <a href={`tel:${settings.phone}`} className="hover:text-gold-400 transition-colors">
                  {settings.phone}
                </a>
              </div>
            </li>

            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold mb-1">Official Email</strong>
                <a href={`mailto:${settings.email}`} className="hover:text-gold-400 transition-colors">
                  {settings.email}
                </a>
              </div>
            </li>

            <li className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-full bg-gold-500/10 text-gold-400 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <strong className="block text-white font-bold mb-1">Opening Hours</strong>
                <span>{settings.openingHours}</span>
              </div>
            </li>
          </ul>

          {/* WhatsApp Action Button */}
          <div className="pt-4 border-t border-zinc-800">
            <a
              href={`https://wa.me/${settings.whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-colors shadow-lg"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Chat</span>
            </a>
          </div>
        </div>

        {/* Map placeholder card */}
        <div className="rounded-3xl overflow-hidden bg-zinc-900 border border-zinc-800 p-6 text-center space-y-3">
          <MapPin className="w-8 h-8 text-gold-400 mx-auto" />
          <h3 className="font-fashion-serif text-xl font-bold text-white">Visit Atelier In Person</h3>
          <p className="text-zinc-400 text-xs max-w-sm mx-auto">
            Our atelier is situated in the prime commercial fashion district of Lagos. Parking and private fitting rooms available.
          </p>
        </div>
      </div>

      {/* Col 2: Contact Form */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 sm:p-10 shadow-lg">
        <h2 className="font-fashion-serif text-3xl font-bold text-zinc-900 dark:text-white mb-2">
          Send Us a Message
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 text-xs mb-8">
          Fill out the form below and our client coordinator will respond within 24 hours.
        </p>

        {successMsg ? (
          <div className="text-center py-12 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-fashion-serif text-2xl font-bold text-zinc-900 dark:text-white">
              Message Sent!
            </h3>
            <p className="text-zinc-600 dark:text-zinc-300 text-sm">
              {successMsg}
            </p>
            <button
              onClick={() => setSuccessMsg(null)}
              className="mt-4 px-6 py-2.5 rounded-full bg-gold-500 text-zinc-950 font-bold text-xs uppercase tracking-wider hover:bg-gold-400 transition-colors"
            >
              Send Another Message
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Your Name *
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="e.g. Chief Kemi Johnson"
                className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="kemi@example.com"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="+234 800 111 2222"
                  className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                placeholder="e.g. Wedding Outfit Enquiry"
                className="w-full p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 mb-1">
                Your Message *
              </label>
              <textarea
                name="message"
                required
                rows={5}
                placeholder="Write your message or inquiry details..."
                className="w-full p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-gold-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow hover:scale-[1.01] transition-transform flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Sending...' : 'Send Contact Message'}</span>
            </button>
          </form>
        )}
      </div>

    </div>
  );
}
