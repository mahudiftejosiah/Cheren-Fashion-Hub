'use client';

import React, { useState } from 'react';
import { Star, CheckCircle2, XCircle, Trash2, Sparkles } from 'lucide-react';
import { moderateFeedback } from '@/app/actions/feedback';

interface FeedbackItem {
  id: string;
  customerName: string;
  rating: number;
  review: string;
  imageUrl: string | null;
  isApproved: boolean;
  isFeatured: boolean;
  createdAt: Date;
  order?: any;
}

interface AdminFeedbackClientProps {
  initialFeedbacks: FeedbackItem[];
}

export function AdminFeedbackClient({ initialFeedbacks }: AdminFeedbackClientProps) {
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>(initialFeedbacks);

  const handleAction = async (id: string, action: 'APPROVE' | 'REJECT' | 'DELETE' | 'FEATURE') => {
    if (action === 'DELETE' && !confirm('Delete this feedback entry permanently?')) return;

    const res = await moderateFeedback(id, action);
    if (res.success) {
      if (action === 'DELETE') {
        setFeedbacks(feedbacks.filter((f) => f.id !== id));
      } else if (action === 'APPROVE') {
        setFeedbacks(feedbacks.map((f) => (f.id === id ? { ...f, isApproved: true } : f)));
      } else if (action === 'REJECT') {
        setFeedbacks(feedbacks.map((f) => (f.id === id ? { ...f, isApproved: false, isFeatured: false } : f)));
      } else if (action === 'FEATURE') {
        setFeedbacks(feedbacks.map((f) => (f.id === id ? { ...f, isFeatured: !f.isFeatured, isApproved: true } : f)));
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {feedbacks.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-zinc-500 rounded-3xl bg-zinc-900 border border-zinc-800">
            No feedback entries in database.
          </div>
        ) : (
          feedbacks.map((f) => (
            <div
              key={f.id}
              className={`rounded-2xl p-6 border transition-all flex flex-col justify-between space-y-4 ${
                f.isApproved
                  ? 'bg-zinc-900 border-zinc-800'
                  : 'bg-amber-950/20 border-amber-500/30'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1 text-amber-400">
                    {Array.from({ length: f.rating }).map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-current" />
                    ))}
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      f.isApproved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                    }`}
                  >
                    {f.isApproved ? 'Approved' : 'Pending Moderation'}
                  </span>
                </div>

                <p className="text-zinc-200 text-sm italic mb-4">"{f.review}"</p>

                <div className="flex items-center space-x-3 text-xs text-zinc-400">
                  {f.imageUrl && (
                    <img src={f.imageUrl} alt="Customer photo" className="w-8 h-8 rounded-full object-cover" />
                  )}
                  <div>
                    <strong className="text-white block font-medium">{f.customerName}</strong>
                    {f.order && (
                      <span className="font-mono text-[10px] text-gold-400">
                        Order #{f.order.trackingNumber}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Moderation Controls */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <button
                  onClick={() => handleAction(f.id, 'FEATURE')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 transition-colors ${
                    f.isFeatured
                      ? 'bg-gold-500 text-zinc-950'
                      : 'bg-zinc-800 text-zinc-400 hover:text-white'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{f.isFeatured ? 'Featured on Home' : 'Feature'}</span>
                </button>

                <div className="flex items-center space-x-2">
                  {!f.isApproved ? (
                    <button
                      onClick={() => handleAction(f.id, 'APPROVE')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-white font-bold text-[10px] uppercase flex items-center space-x-1 hover:bg-emerald-600"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Approve</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAction(f.id, 'REJECT')}
                      className="px-3 py-1.5 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white font-bold text-[10px] uppercase flex items-center space-x-1"
                    >
                      <XCircle className="w-3 h-3" />
                      <span>Unpublish</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleAction(f.id, 'DELETE')}
                    className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/40"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
