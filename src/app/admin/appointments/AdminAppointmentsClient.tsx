'use client';

import React, { useState } from 'react';
import { updateAppointmentStatusAction } from '@/app/actions/admin';

interface AppointmentItem {
  id: string;
  name: string;
  phone: string;
  email: string;
  preferredDate: string;
  preferredTime: string;
  serviceType: string;
  additionalInfo: string | null;
  status: string;
  createdAt: Date;
}

const STATUS_OPTIONS = ['PENDING', 'APPROVED', 'RESCHEDULED', 'REJECTED', 'COMPLETED'];

const STATUS_STYLES: Record<string, string> = {
  PENDING:     'bg-amber-500/15 text-amber-400 border-amber-500/30',
  APPROVED:    'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  RESCHEDULED: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
  REJECTED:    'bg-rose-500/15 text-rose-400 border-rose-500/30',
  COMPLETED:   'bg-violet-500/15 text-violet-400 border-violet-500/30',
};

// Which actions to show as quick buttons per current status
const NEXT_ACTIONS: Record<string, string[]> = {
  PENDING:     ['APPROVED', 'RESCHEDULED', 'REJECTED'],
  APPROVED:    ['COMPLETED', 'RESCHEDULED', 'REJECTED'],
  RESCHEDULED: ['APPROVED', 'REJECTED'],
  REJECTED:    ['APPROVED'],
  COMPLETED:   [],
};

export function AdminAppointmentsClient({ initialAppointments }: { initialAppointments: AppointmentItem[] }) {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(initialAppointments);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [filter, setFilter] = useState('ALL');

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const res = await updateAppointmentStatusAction(id, newStatus);
    setLoadingId(null);
    if (res.success) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
      );
    }
  };

  const filtered = filter === 'ALL' ? appointments : appointments.filter((a) => a.status === filter);

  return (
    <div className="space-y-6">
      {/* Summary chips + filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('ALL')}
          className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-colors ${filter === 'ALL' ? 'bg-zinc-200 text-zinc-900 border-zinc-300' : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
        >
          All ({appointments.length})
        </button>
        {STATUS_OPTIONS.map((s) => {
          const count = appointments.filter((a) => a.status === s).length;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider transition-colors ${filter === s ? STATUS_STYLES[s] : 'bg-zinc-800 text-zinc-500 border-zinc-700 hover:border-zinc-500'}`}
            >
              {s.replace(/_/g, ' ')} ({count})
            </button>
          );
        })}
      </div>

      {/* Table — desktop (md+) */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-zinc-950/50">
              <tr>
                <th className="p-4">Client</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Service</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    No appointments match this filter.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-zinc-800/40 align-top">
                    <td className="p-4 font-bold text-white">{app.name}</td>
                    <td className="p-4">
                      <span className="block">{app.phone}</span>
                      <span className="text-zinc-500 text-[10px]">{app.email}</span>
                    </td>
                    <td className="p-4 font-mono text-gold-400 font-bold whitespace-nowrap">
                      {app.preferredDate}
                      <span className="block text-zinc-400 font-sans font-normal">{app.preferredTime}</span>
                    </td>
                    <td className="p-4 text-zinc-300 max-w-[160px]">{app.serviceType}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ${STATUS_STYLES[app.status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                        {app.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1.5">
                        {(NEXT_ACTIONS[app.status] ?? []).map((nextStatus) => (
                          <button
                            key={nextStatus}
                            disabled={loadingId === app.id}
                            onClick={() => handleStatusChange(app.id, nextStatus)}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors disabled:opacity-50 ${STATUS_STYLES[nextStatus]}`}
                          >
                            {loadingId === app.id ? '...' : nextStatus.replace(/_/g, ' ')}
                          </button>
                        ))}
                        {(NEXT_ACTIONS[app.status] ?? []).length === 0 && (
                          <span className="text-zinc-600 text-[10px] italic">No actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards (below md) */}
        <div className="md:hidden divide-y divide-zinc-800">
          {filtered.length === 0 ? (
            <p className="p-8 text-center text-zinc-500 text-xs">No appointments match this filter.</p>
          ) : (
            filtered.map((app) => (
              <div key={app.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <strong className="text-white text-xs">{app.name}</strong>
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider ${STATUS_STYLES[app.status] ?? 'bg-zinc-800 text-zinc-400 border-zinc-700'}`}>
                    {app.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <div className="text-[11px] text-zinc-400 space-y-0.5">
                  <span className="block">{app.phone} · {app.email}</span>
                  <span className="block font-mono text-gold-400 font-bold">{app.preferredDate} — {app.preferredTime}</span>
                  <span className="block text-zinc-300">{app.serviceType}</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(NEXT_ACTIONS[app.status] ?? []).map((nextStatus) => (
                    <button
                      key={nextStatus}
                      disabled={loadingId === app.id}
                      onClick={() => handleStatusChange(app.id, nextStatus)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors disabled:opacity-50 ${STATUS_STYLES[nextStatus]}`}
                    >
                      {loadingId === app.id ? '...' : nextStatus.replace(/_/g, ' ')}
                    </button>
                  ))}
                  {(NEXT_ACTIONS[app.status] ?? []).length === 0 && (
                    <span className="text-zinc-600 text-[10px] italic">No actions</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
