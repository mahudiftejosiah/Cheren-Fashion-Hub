'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeProvider';
import { 
  Sun, 
  Moon, 
  Menu, 
  X, 
  Scissors, 
  Lock, 
  Sparkles,
  Crown
} from 'lucide-react';
import { SettingsData } from '@/lib/getSettings';

interface NavbarProps {
  settings: SettingsData;
}

export function Navbar({ settings }: NavbarProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Collections', href: '/collections' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Track Order', href: '/track-order' },
    { name: 'How It Works', href: '/how-it-works' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-pink-200 dark:border-pink-500/20 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl transition-all">
      {/* Top Metallic Red-Pink-Purple Accent Bar */}
      <div className="h-1 bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 shadow-pink-glow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-22">
          
          {/* Brand Logo & Decorative Emblem */}
          <Link href="/" className="flex items-center space-x-3.5 group py-2">
            <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-red-500 via-pink-500 to-purple-700 flex items-center justify-center text-white font-bold shadow-pink-glow group-hover:scale-105 transition-transform duration-300 border border-pink-300/40">
              <Scissors className="w-5 h-5 text-white stroke-[2.2]" />
              <Crown className="w-3.5 h-3.5 text-pink-300 absolute -top-1.5 -right-1" />
            </div>
            <div>
              <span className="font-cinzel text-xl sm:text-2xl font-black tracking-wider text-zinc-900 dark:text-white block group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors uppercase">
                {settings.businessName}
              </span>
              <span className="text-[9px] tracking-[0.25em] uppercase text-pink-600 dark:text-pink-400 font-semibold block font-sans">
                {settings.tagline}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-xs font-bold uppercase tracking-widest transition-all relative py-1.5 ${
                    isActive
                      ? 'text-pink-600 dark:text-pink-400 font-extrabold'
                      : 'text-zinc-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400'
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 rounded-full shadow-pink-glow animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Book Consultation CTA */}
            <Link
              href="/book"
              className={`px-5 py-2.5 rounded-full text-xs font-extrabold uppercase tracking-widest transition-all shadow-pink-glow ${
                pathname === '/book'
                  ? 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white'
                  : 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white hover:opacity-90 hover:scale-105'
              }`}
            >
              Book Consultation
            </Link>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-full border border-pink-400/40 dark:border-pink-500/30 text-zinc-700 dark:text-zinc-300 hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-500 hover:bg-pink-500/10 transition-all shadow-sm"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle Mode"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-pink-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="flex lg:hidden items-center space-x-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full border border-pink-400/40 dark:border-pink-500/30 text-zinc-700 dark:text-zinc-300"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-pink-400" /> : <Moon className="w-4 h-4 text-purple-600" />}
            </button>
            
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-pink-400/40 dark:border-pink-500/30 text-pink-600 dark:text-pink-400 hover:bg-pink-500/10"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-pink-200 dark:border-pink-500/20 bg-white dark:bg-zinc-950 px-6 pt-4 pb-8 space-y-4 shadow-2xl">
          <div className="flex flex-col space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-colors ${
                  pathname === link.href
                    ? 'bg-pink-500/20 text-pink-600 dark:text-pink-400 border border-pink-400/40'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-pink-50 dark:hover:bg-zinc-900 hover:text-pink-600 dark:hover:text-pink-400'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Book Consultation CTA — Mobile */}
            <Link
              href="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 px-4 py-3.5 rounded-xl text-sm font-extrabold uppercase tracking-wider text-center text-white bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 shadow-pink-glow hover:opacity-90 transition-opacity"
            >
              Book Consultation
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}


