'use client';

import React, { useState } from 'react';
import { ExternalLink, ChevronDown } from 'lucide-react';
import { updateQuoteStatusAction } from '@/app/actions/admin';

interface QuoteItem {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  outfitType: string;
  description: string;
  preferredFabric: string | null;
  desiredDeadline: string | null;
  referenceImageUrl: string | null;
  status: string;
  createdAt: Date;
}

const STATUS_OPTIONS = ['PENDING', 'CONTACTED', 'QUOTED', 'CLOSED'];

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
  CONTACTED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  QUOTED:    'bg-violet-500/15 text-violet-400 border-violet-500/30',
  CLOSED:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
};

export function AdminQuotesClient({ initialQuotes }: { initialQuotes: QuoteItem[] }) {
  const [quotes, setQuotes] = useState<QuoteItem[]>(initialQuotes);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    setLoadingId(quoteId);
    const res = await updateQuoteStatusAction(quoteId, newStatus);
    setLoadingId(null);
    if (res.success) {
      setQuotes((prev) =>
        prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary chips */}
      <div className="flex flex-wrap gap-2">
        {STATUS_OPTIONS.map((s) => {
          const count = quotes.filter((q) => q.status === s).length;
          return (
            <span key={s} className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[s]}`}>
              {s.replace(/_/g, ' ')}: {count}
            </span>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-zinc-500 rounded-3xl bg-zinc-900 border border-zinc-800">
            No quote requests in system.
          </div>
        ) : (
          quotes.map((q) => (
            <div
              key={q.id}
              className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800 shadow-lg space-y-4"
            >
              {/* Top row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase">
                  {q.outfitType}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {new Date(q.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Client info */}
              <div>
                <h3 className="font-fashion-serif text-xl font-bold text-white mb-1">
                  {q.fullName}
                </h3>
                <p className="text-xs text-zinc-400">{q.phone} • {q.email}</p>
              </div>

              {/* Description */}
              <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 space-y-1.5">
                <p className="italic">"{q.description}"</p>
                {q.preferredFabric && (
                  <p className="text-[11px] text-gold-400">Fabric: {q.preferredFabric}</p>
                )}
                {q.desiredDeadline && (
                  <p className="text-[11px] text-zinc-400">Target Date: {q.desiredDeadline}</p>
                )}
              </div>

              {q.referenceImageUrl && (
                <a
                  href={q.referenceImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1 text-xs font-bold text-gold-400 hover:underline"
                >
                  <span>View Reference Photo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {/* Status control */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[q.status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                  {q.status.replace(/_/g, ' ')}
                </span>

                <div className="flex items-center gap-2 flex-wrap justify-end">
                  {STATUS_OPTIONS.filter((s) => s !== q.status).map((s) => (
                    <button
                      key={s}
                      disabled={loadingId === q.id}
                      onClick={() => handleStatusChange(q.id, s)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors disabled:opacity-50 ${STATUS_STYLES[s]}`}
                    >
                      {loadingId === q.id ? '...' : s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
