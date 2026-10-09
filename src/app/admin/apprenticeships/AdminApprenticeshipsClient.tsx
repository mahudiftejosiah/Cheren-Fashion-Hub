'use client';

import React, { useState } from 'react';
import { MapPin, X, CheckCircle2, XCircle, Eye } from 'lucide-react';
import { updateApprenticeshipStatusAction } from '@/app/actions/admin';

interface ApplicationItem {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  location: string;
  experienceLevel: string;
  skillLevel: string;
  motivation: string;
  availability: string;
  status: string;
  internalNotes: string | null;
  createdAt: Date;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING:   'bg-amber-500/15 text-amber-400 border-amber-500/30',
  REVIEWED:  'bg-blue-500/15 text-blue-400 border-blue-500/30',
  ACCEPTED:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  REJECTED:  'bg-rose-500/15 text-rose-400 border-rose-500/30',
};

const NEXT_ACTIONS: Record<string, string[]> = {
  PENDING:  ['REVIEWED', 'ACCEPTED', 'REJECTED'],
  REVIEWED: ['ACCEPTED', 'REJECTED'],
  ACCEPTED: ['REJECTED'],
  REJECTED: ['ACCEPTED'],
};

export function AdminApprenticeshipsClient({ initialApps }: { initialApps: ApplicationItem[] }) {
  const [apps, setApps] = useState<ApplicationItem[]>(initialApps);
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const res = await updateApprenticeshipStatusAction(id, newStatus);
    setLoadingId(null);
    if (res.success) {
      setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a)));
      // Also update selectedApp if it's currently open
      if (selectedApp?.id === id) setSelectedApp((prev) => prev ? { ...prev, status: newStatus } : prev);
      showToast(`Application marked as ${newStatus.toLowerCase()}.`);
    }
  };

  const STATUS_OPTIONS = ['PENDING', 'REVIEWED', 'ACCEPTED', 'REJECTED'];
  const filtered = filter === 'ALL' ? apps : apps.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-[73px] lg:top-6 right-4 lg:right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-2xl flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-colors ${filter === 'ALL' ? 'bg-zinc-200 text-zinc-900 border-zinc-300' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
        >
          All ({apps.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-colors ${filter === s ? STATUS_STYLES[s] : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
          >
            {s} ({apps.filter((a) => a.status === s).length})
          </button>
        ))}
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 ? (
          <div className="col-span-3 p-12 text-center text-zinc-500 rounded-3xl bg-zinc-900 border border-zinc-800">
            No applications match this filter.
          </div>
        ) : (
          filtered.map((app) => (
            <div
              key={app.id}
              className="rounded-2xl p-6 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 shadow-lg transition-all space-y-4 flex flex-col"
            >
              {/* Top row */}
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-[10px] font-bold uppercase">
                  {app.experienceLevel}
                </span>
                <span className="text-[10px] text-zinc-500">
                  {new Date(app.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Name & location */}
              <div>
                <h3 className="font-fashion-serif text-xl font-bold text-white mb-1">{app.fullName}</h3>
                <p className="text-zinc-400 text-xs flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-gold-500 shrink-0" />
                  <span>{app.location}</span>
                </p>
              </div>

              {/* Motivation snippet */}
              <p className="line-clamp-2 italic text-zinc-400 text-xs">"{app.motivation}"</p>

              {/* Status badge */}
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-zinc-500">Availability: {app.availability}</span>
                <span className={`px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${STATUS_STYLES[app.status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                  {app.status}
                </span>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-zinc-800 space-y-2 mt-auto">
                {/* View details */}
                <button
                  onClick={() => setSelectedApp(app)}
                  className="w-full py-2 rounded-xl border border-zinc-700 text-xs font-bold text-zinc-300 hover:bg-zinc-800 hover:text-white flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> View Details
                </button>

                {/* Status transitions */}
                <div className="flex flex-wrap gap-1.5">
                  {(NEXT_ACTIONS[app.status] ?? []).map((nextStatus) => (
                    <button
                      key={nextStatus}
                      disabled={loadingId === app.id}
                      onClick={() => handleStatusChange(app.id, nextStatus)}
                      className={`flex-1 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${STATUS_STYLES[nextStatus]}`}
                    >
                      {loadingId === app.id ? '...' : nextStatus}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Details Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl space-y-6">
            <button
              onClick={() => setSelectedApp(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-zinc-800 pb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block mb-1">
                Apprenticeship Applicant Profile
              </span>
              <h2 className="font-fashion-serif text-3xl font-bold text-white">{selectedApp.fullName}</h2>
              <span className={`mt-2 inline-block px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase ${STATUS_STYLES[selectedApp.status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                {selectedApp.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div><span className="text-zinc-500 block">Phone</span><strong className="text-white">{selectedApp.phone}</strong></div>
              <div><span className="text-zinc-500 block">Email</span><strong className="text-white break-all">{selectedApp.email}</strong></div>
              <div><span className="text-zinc-500 block">Location</span><strong className="text-white">{selectedApp.location}</strong></div>
              <div><span className="text-zinc-500 block">Experience Level</span><strong className="text-gold-400">{selectedApp.experienceLevel}</strong></div>
              <div><span className="text-zinc-500 block">Skill Level</span><strong className="text-white">{selectedApp.skillLevel}</strong></div>
              <div><span className="text-zinc-500 block">Availability</span><strong className="text-white">{selectedApp.availability}</strong></div>
            </div>

            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-2">
                Motivation & Statement of Intent
              </span>
              <p className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 leading-relaxed">
                {selectedApp.motivation}
              </p>
            </div>

            {/* Status actions inside modal */}
            <div className="pt-4 border-t border-zinc-800">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-3">Update Status</span>
              <div className="flex flex-wrap gap-2">
                {(NEXT_ACTIONS[selectedApp.status] ?? []).map((nextStatus) => (
                  <button
                    key={nextStatus}
                    disabled={loadingId === selectedApp.id}
                    onClick={() => handleStatusChange(selectedApp.id, nextStatus)}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50 ${STATUS_STYLES[nextStatus]}`}
                  >
                    {loadingId === selectedApp.id ? 'Updating...' : `Mark as ${nextStatus}`}
                  </button>
                ))}
                {(NEXT_ACTIONS[selectedApp.status] ?? []).length === 0 && (
                  <span className="text-zinc-500 text-xs italic">No further status changes available.</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
