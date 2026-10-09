'use client';

import React, { useState } from 'react';
import { Mail, MailOpen, CheckCheck, X } from 'lucide-react';
import { markMessageAsRead, markAllMessagesAsRead } from '@/app/actions/admin';

interface MessageItem {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export function AdminMessagesClient({ initialMessages }: { initialMessages: MessageItem[] }) {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');
  const [selectedMsg, setSelectedMsg] = useState<MessageItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleMarkRead = async (id: string) => {
    setLoadingId(id);
    const res = await markMessageAsRead(id);
    setLoadingId(null);
    if (res.success) {
      setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, isRead: true } : m)));
      if (selectedMsg?.id === id) setSelectedMsg((prev) => prev ? { ...prev, isRead: true } : prev);
      showToast('Message marked as read.');
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);
    const res = await markAllMessagesAsRead();
    setMarkingAll(false);
    if (res.success) {
      setMessages((prev) => prev.map((m) => ({ ...m, isRead: true })));
      showToast('All messages marked as read.');
    }
  };

  const unreadCount = messages.filter((m) => !m.isRead).length;
  const filtered = filter === 'ALL' ? messages : filter === 'UNREAD' ? messages.filter((m) => !m.isRead) : messages.filter((m) => m.isRead);

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-[73px] lg:top-6 right-4 lg:right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-2xl flex items-center space-x-2">
          <CheckCheck className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Filter chips */}
        <div className="flex flex-wrap gap-2">
          {(['ALL', 'UNREAD', 'READ'] as const).map((f) => {
            const count = f === 'ALL' ? messages.length : f === 'UNREAD' ? messages.filter((m) => !m.isRead).length : messages.filter((m) => m.isRead).length;
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-colors ${
                  filter === f
                    ? f === 'UNREAD'
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-zinc-200 text-zinc-900 border-zinc-300'
                    : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>

        {/* Mark all read */}
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            disabled={markingAll}
            className="px-4 py-2 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/25 transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            {markingAll ? 'Marking...' : `Mark All Read (${unreadCount})`}
          </button>
        )}
      </div>

      {/* Messages grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-2 p-12 text-center text-zinc-500 rounded-3xl bg-zinc-900 border border-zinc-800">
            No messages in this category.
          </div>
        ) : (
          filtered.map((m) => (
            <div
              key={m.id}
              className={`rounded-2xl p-6 bg-zinc-900 shadow-lg space-y-4 transition-all border ${
                m.isRead ? 'border-zinc-800 opacity-75' : 'border-gold-500/40 ring-1 ring-gold-500/10'
              }`}
            >
              {/* Top row */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {m.isRead ? (
                    <MailOpen className="w-4 h-4 text-zinc-500" />
                  ) : (
                    <Mail className="w-4 h-4 text-gold-400" />
                  )}
                  <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase">
                    {m.subject || 'General Enquiry'}
                  </span>
                  {!m.isRead && (
                    <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
                  )}
                </div>
                <span className="text-[10px] text-zinc-500">
                  {new Date(m.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Sender */}
              <div>
                <h3 className="font-fashion-serif text-xl font-bold text-white mb-1">{m.name}</h3>
                <p className="text-xs text-zinc-400">
                  {m.email}{m.phone ? ` • ${m.phone}` : ''}
                </p>
              </div>

              {/* Message preview */}
              <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed line-clamp-3">
                "{m.message}"
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedMsg(m)}
                  className="text-xs font-bold text-gold-400 hover:underline"
                >
                  Read Full Message →
                </button>
                {!m.isRead && (
                  <button
                    onClick={() => handleMarkRead(m.id)}
                    disabled={loadingId === m.id}
                    className="px-3 py-1.5 rounded-lg bg-blue-500/15 border border-blue-500/30 text-blue-400 text-[10px] font-bold uppercase tracking-wider hover:bg-blue-500/25 transition-colors flex items-center gap-1 disabled:opacity-50"
                  >
                    <MailOpen className="w-3 h-3" />
                    {loadingId === m.id ? '...' : 'Mark Read'}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Full message modal */}
      {selectedMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedMsg(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block mb-1">
                {selectedMsg.subject || 'General Enquiry'}
              </span>
              <h2 className="font-fashion-serif text-2xl font-bold text-white">{selectedMsg.name}</h2>
              <p className="text-xs text-zinc-400 mt-1">
                {selectedMsg.email}{selectedMsg.phone ? ` • ${selectedMsg.phone}` : ''}
              </p>
              <p className="text-[10px] text-zinc-500 mt-1">
                Received: {new Date(selectedMsg.createdAt).toLocaleString()}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
              {selectedMsg.message}
            </div>

            {!selectedMsg.isRead && (
              <button
                onClick={() => {
                  handleMarkRead(selectedMsg.id);
                  setSelectedMsg(null);
                }}
                disabled={loadingId === selectedMsg.id}
                className="w-full py-3 rounded-full bg-blue-500/15 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-wider hover:bg-blue-500/25 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <MailOpen className="w-4 h-4" />
                {loadingId === selectedMsg.id ? 'Marking...' : 'Mark as Read'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
