'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';

interface WhatsAppWidgetProps {
  whatsappNumber: string;
}

export function WhatsAppWidget({ whatsappNumber }: WhatsAppWidgetProps) {
  if (!whatsappNumber) return null;

  const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent('Hello! I would like to inquire about your fashion collection and bespoke tailoring services.')}`;

  return (
    <a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-3 rounded-full shadow-luxury hover:scale-105 transition-all group"
      aria-label="Chat on WhatsApp"
    >
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
      </span>
      <MessageCircle className="w-5 h-5" />
      <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline-block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
