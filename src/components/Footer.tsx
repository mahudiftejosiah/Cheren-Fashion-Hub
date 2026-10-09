import React from 'react';
import Link from 'next/link';
import { 
  Scissors, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  MessageCircle, 
  ShieldCheck,
  Crown
} from 'lucide-react';
import { SettingsData } from '@/lib/getSettings';

interface FooterProps {
  settings: SettingsData;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-300 pt-20 pb-12 border-t border-pink-200 dark:border-pink-500/20 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Ambient Glow */}
      <div className="fashion-orb w-96 h-96 -bottom-20 left-1/2 -translate-x-1/2 opacity-30" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-5">
            <Link href="/" className="flex items-center space-x-3.5 group">
              <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-red-500 via-pink-500 to-purple-700 flex items-center justify-center text-white font-bold shadow-pink-glow border border-pink-300/50">
                <Scissors className="w-5 h-5 stroke-[2.2]" />
                <Crown className="w-3.5 h-3.5 text-pink-300 absolute -top-1.5 -right-1" />
              </div>
              <span className="font-cinzel text-xl font-black text-zinc-900 dark:text-white tracking-wider uppercase">
                {settings.businessName}
              </span>
            </Link>

            <p className="text-zinc-500 dark:text-zinc-400 text-xs font-light leading-relaxed">
              {settings.bioText}
            </p>

            <div className="pt-2 flex items-center space-x-3">
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-pink-500/30 bg-zinc-900 flex items-center justify-center text-zinc-300 hover:text-pink-400 hover:border-pink-400 transition-all"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-pink-500/30 bg-zinc-900 flex items-center justify-center text-zinc-300 hover:text-pink-400 hover:border-pink-400 transition-all"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {settings.whatsappNumber && (
                <a
                  href={`https://wa.me/${settings.whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-pink-500/30 bg-zinc-900 flex items-center justify-center text-emerald-400 hover:border-emerald-400 transition-all"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Quick Navigation */}
          <div>
            <h3 className="text-zinc-900 dark:text-white font-cinzel text-sm font-bold mb-5 tracking-widest uppercase border-l-2 border-pink-400 pl-3">
              Quick Navigation
            </h3>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link href="/" className="hover:text-pink-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-pink-400 transition-colors">Fashion Collections</Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-pink-400 transition-colors">Photo & Video Gallery</Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-pink-400 transition-colors">Our Tailoring Process</Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-pink-400 transition-colors">Track My Order</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Enquiries & Policies */}
          <div>
            <h3 className="text-zinc-900 dark:text-white font-cinzel text-sm font-bold mb-5 tracking-widest uppercase border-l-2 border-pink-400 pl-3">
              Client Portal
            </h3>
            <ul className="space-y-3 text-xs font-medium">
              <li>
                <Link href="/faq" className="hover:text-pink-400 transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-pink-400 transition-colors">Contact Studio</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact & Studio Info */}
          <div>
            <h3 className="text-zinc-900 dark:text-white font-cinzel text-sm font-bold mb-5 tracking-widest uppercase border-l-2 border-pink-400 pl-3">
              Studio Details
            </h3>
            <ul className="space-y-3.5 text-xs text-zinc-500 dark:text-zinc-400 font-light">
              <li className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-pink-400 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-pink-400 shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-white transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-4 h-4 text-pink-400 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
              </li>
              <li className="flex items-center space-x-3">
                <Clock className="w-4 h-4 text-pink-400 shrink-0" />
                <span>{settings.openingHours}</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-900 flex flex-col md:flex-row items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-500 space-y-4 md:space-y-0">
          <p>© {currentYear} {settings.businessName}. All rights reserved.</p>
          
          <div className="flex items-center space-x-6">
            <Link href="/privacy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

