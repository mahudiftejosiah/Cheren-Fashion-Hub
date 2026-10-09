'use client';

import React, { useState } from 'react';
import {
  Search,
  Plus,
  X,
  CheckCircle2,
  Copy,
  Check,
  Save,
  Loader2,
} from 'lucide-react';
import { createAdminOrder, updateOrderStatusAction } from '@/app/actions/admin';

const WORKFLOW_STAGES = [
  'ORDER_RECEIVED',
  'CONSULTATION',
  'MEASUREMENTS_CONFIRMED',
  'IN_PRODUCTION',
  'QUALITY_CHECK',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CUSTOMER_CONFIRMED',
];

interface OrderItem {
  id: string;
  trackingNumber: string;
  trackingId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  outfitTitle: string;
  description: string;
  measurements: string | null;
  status: string;
  expectedCompletionDate: string | null;
  deliveryAddress: string | null;
  confirmedAt: Date | null;
  internalNotes: string | null;
  createdAt: Date;
  feedback?: any;
}

interface AdminOrdersClientProps {
  initialOrders: OrderItem[];
}

// After creating a new order, show this confirmation modal with both IDs
interface NewOrderResult {
  trackingNumber: string;
  trackingId: string;
}

export function AdminOrdersClient({ initialOrders }: AdminOrdersClientProps) {
  const [orders, setOrders] = useState<OrderItem[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [newOrderResult, setNewOrderResult] = useState<NewOrderResult | null>(null);

  // Per-row copy state: stores the id of the order currently showing "Copied!"
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Two-step status save:
  // pendingStatuses — local draft changes not yet saved to DB
  // savingId        — which order is currently being saved (shows spinner)
  // savedId         — which order just saved successfully (shows flash)
  const [pendingStatuses, setPendingStatuses] = useState<Record<string, string>>({});
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedId, setSavedId] = useState<string | null>(null);

  // Return the displayed status for an order (pending draft takes priority)
  const getDisplayStatus = (ord: OrderItem) =>
    pendingStatuses[ord.id] ?? ord.status;

  const hasPendingChange = (ord: OrderItem) =>
    pendingStatuses[ord.id] !== undefined && pendingStatuses[ord.id] !== ord.status;

  // Just update local draft — does NOT touch the DB
  const handleStatusDraft = (orderId: string, newStatus: string) => {
    setPendingStatuses((prev) => ({ ...prev, [orderId]: newStatus }));
  };

  // Actually save to DB
  const handleSaveStatus = async (ord: OrderItem) => {
    const newStatus = pendingStatuses[ord.id];
    if (!newStatus || newStatus === ord.status) return;

    setSavingId(ord.id);
    const res = await updateOrderStatusAction(ord.id, newStatus);
    setSavingId(null);

    if (res.success) {
      // Commit to orders array
      setOrders((prev) =>
        prev.map((o) => (o.id === ord.id ? { ...o, status: newStatus } : o))
      );
      // Clear the pending draft for this row
      setPendingStatuses((prev) => {
        const next = { ...prev };
        delete next[ord.id];
        return next;
      });
      // Flash saved indicator
      setSavedId(ord.id);
      setTimeout(() => setSavedId(null), 2500);
    }
  };

  const filteredOrders = orders.filter((ord) => {
    const matchesStatus = statusFilter === 'ALL' || ord.status === statusFilter;
    const matchesSearch =
      ord.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.outfitTitle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCopyTrackingId = async (orderId: string, trackingId: string) => {
    try {
      await navigator.clipboard.writeText(trackingId);
      setCopiedId(orderId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // Fallback for browsers that block clipboard
      const el = document.createElement('textarea');
      el.value = trackingId;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopiedId(orderId);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleCreateSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createAdminOrder(formData);
    setCreateLoading(false);

    if (res.success && res.trackingNumber && res.trackingId) {
      setCreateModalOpen(false);
      // Show the new-order result modal with both IDs
      setNewOrderResult({ trackingNumber: res.trackingNumber, trackingId: res.trackingId });
    } else {
      setCreateError(res.error || 'Failed to create order.');
    }
  };

  return (
    <div className="space-y-6">

      {/* Top Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="relative w-full md:w-64">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tracking # or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 focus:outline-none focus:border-gold-500"
          >
            <option value="ALL">All Statuses</option>
            {WORKFLOW_STAGES.map((st) => (
              <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setCreateModalOpen(true)}
          className="px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Order</span>
        </button>
      </div>

      {/* Orders — desktop table / mobile cards */}
      <div className="rounded-3xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-xl">

        {/* Desktop table (md+) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800 text-zinc-400 uppercase text-[10px] tracking-wider bg-zinc-950/50">
              <tr>
                <th className="p-4">Tracking Code</th>
                <th className="p-4">Customer Details</th>
                <th className="p-4">Outfit & Specs</th>
                <th className="p-4">Workflow Status</th>
                <th className="p-4">Confirmation</th>
                <th className="p-4">Share ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-zinc-500">
                    No orders match the filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-zinc-800/40">
                    <td className="p-4 font-mono font-bold text-gold-400 whitespace-nowrap">
                      {ord.trackingNumber}
                      <span className="block text-[9px] text-zinc-500 font-sans font-normal mt-0.5">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </td>
                    <td className="p-4">
                      <strong className="text-white block font-medium">{ord.customerName}</strong>
                      <span className="text-zinc-400 block">{ord.customerPhone}</span>
                      <span className="text-zinc-500 text-[10px]">{ord.customerEmail}</span>
                    </td>
                    <td className="p-4 max-w-[200px]">
                      <strong className="text-zinc-200 block truncate">{ord.outfitTitle}</strong>
                      <span className="text-zinc-400 text-[10px] block truncate">
                        {ord.measurements || 'No measurements listed'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <select
                          value={getDisplayStatus(ord)}
                          onChange={(e) => handleStatusDraft(ord.id, e.target.value)}
                          className={`px-2.5 py-1.5 rounded-lg bg-zinc-950 border text-[10px] font-bold tracking-wider uppercase focus:outline-none transition-colors ${
                            hasPendingChange(ord)
                              ? 'border-amber-500/60 text-amber-400'
                              : 'border-gold-500/40 text-gold-400'
                          }`}
                        >
                          {WORKFLOW_STAGES.map((st) => (
                            <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                          ))}
                        </select>

                        {/* Save button — only visible when there's an unsaved change */}
                        {hasPendingChange(ord) && (
                          <button
                            onClick={() => handleSaveStatus(ord)}
                            disabled={savingId === ord.id}
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-60"
                          >
                            {savingId === ord.id ? (
                              <><Loader2 className="w-3 h-3 animate-spin" /> Saving...</>
                            ) : (
                              <><Save className="w-3 h-3" /> Save Status</>
                            )}
                          </button>
                        )}

                        {/* Saved flash */}
                        {savedId === ord.id && !hasPendingChange(ord) && (
                          <span className="inline-flex items-center gap-1 text-emerald-400 text-[10px] font-bold">
                            <Check className="w-3 h-3" /> Saved!
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      {ord.status === 'CUSTOMER_CONFIRMED' || ord.confirmedAt ? (
                        <span className="inline-flex items-center text-emerald-400 font-bold text-[10px] uppercase">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Confirmed
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-[10px]">Pending</span>
                      )}
                    </td>
                    {/* ── Copy Tracking Number ── */}
                    <td className="p-4">
                      <button
                        onClick={() => handleCopyTrackingId(ord.id, ord.trackingNumber)}
                        title="Copy tracking number to share with customer"
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all ${
                          copiedId === ord.id
                            ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                            : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                        }`}
                      >
                        {copiedId === ord.id ? (
                          <><Check className="w-3 h-3" /> Copied!</>
                        ) : (
                          <><Copy className="w-3 h-3" /> Copy No.</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile stacked cards */}
        <div className="md:hidden divide-y divide-zinc-800">
          {filteredOrders.length === 0 ? (
            <p className="p-8 text-center text-zinc-500 text-xs">No orders match the filter.</p>
          ) : (
            filteredOrders.map((ord) => (
              <div key={ord.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <span className="font-mono font-bold text-gold-400 text-xs">{ord.trackingNumber}</span>
                  <span className="text-[10px] text-zinc-500">{new Date(ord.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <strong className="text-white text-xs block">{ord.customerName}</strong>
                  <span className="text-zinc-400 text-[11px] block">{ord.customerPhone}</span>
                  <span className="text-zinc-500 text-[10px]">{ord.customerEmail}</span>
                </div>
                <div>
                  <strong className="text-zinc-200 text-xs block">{ord.outfitTitle}</strong>
                  <span className="text-zinc-400 text-[10px]">{ord.measurements || 'No measurements listed'}</span>
                </div>
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <select
                    value={getDisplayStatus(ord)}
                    onChange={(e) => handleStatusDraft(ord.id, e.target.value)}
                    className={`flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-zinc-950 border text-[10px] font-bold tracking-wider uppercase focus:outline-none transition-colors ${
                      hasPendingChange(ord)
                        ? 'border-amber-500/60 text-amber-400'
                        : 'border-gold-500/40 text-gold-400'
                    }`}
                  >
                    {WORKFLOW_STAGES.map((st) => (
                      <option key={st} value={st}>{st.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                  {ord.status === 'CUSTOMER_CONFIRMED' || ord.confirmedAt ? (
                    <span className="inline-flex items-center text-emerald-400 font-bold text-[10px] uppercase shrink-0">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Confirmed
                    </span>
                  ) : (
                    <span className="text-zinc-500 text-[10px] shrink-0">Pending Receipt</span>
                  )}
                </div>

                {/* Save button — mobile */}
                {hasPendingChange(ord) && (
                  <button
                    onClick={() => handleSaveStatus(ord)}
                    disabled={savingId === ord.id}
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-[10px] uppercase tracking-wider transition-all disabled:opacity-60"
                  >
                    {savingId === ord.id ? (
                      <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Saving Status...</>
                    ) : (
                      <><Save className="w-3.5 h-3.5" /> Save Status Update</>
                    )}
                  </button>
                )}

                {savedId === ord.id && !hasPendingChange(ord) && (
                  <span className="flex items-center justify-center gap-1.5 text-emerald-400 text-[10px] font-bold py-1">
                    <Check className="w-3.5 h-3.5" /> Status saved successfully!
                  </span>
                )}
                {/* Copy Tracking Number — mobile */}
                <button
                  onClick={() => handleCopyTrackingId(ord.id, ord.trackingNumber)}
                  className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                    copiedId === ord.id
                      ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                      : 'bg-blue-500/10 border-blue-500/30 text-blue-400 hover:bg-blue-500/20'
                  }`}
                >
                  {copiedId === ord.id ? (
                    <><Check className="w-3.5 h-3.5" /> Tracking No. Copied!</>
                  ) : (
                    <><Copy className="w-3.5 h-3.5" /> Copy Tracking Number</>
                  )}
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── New Order Created Modal — shows both IDs ── */}
      {newOrderResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-8 text-white shadow-2xl space-y-6">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-emerald-400" />
              </div>
              <h2 className="font-fashion-serif text-2xl font-bold text-white">Order Created!</h2>
              <p className="text-zinc-400 text-xs">Share the Tracking ID below with the customer so they can track their order online.</p>
            </div>

            {/* Admin reference number */}
            <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                Admin Reference (Human-readable)
              </span>
              <span className="font-mono text-lg font-bold text-gold-400">{newOrderResult.trackingNumber}</span>
            </div>

            {/* Customer tracking number */}
            <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/30 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 block">
                Customer Tracking Number (Share this)
              </span>
              <span className="font-mono text-lg font-bold text-white block">{newOrderResult.trackingNumber}</span>
              <button
                onClick={() => handleCopyTrackingId('new', newOrderResult.trackingNumber)}
                className={`mt-1 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border text-[10px] font-bold uppercase tracking-wider transition-all ${
                  copiedId === 'new'
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400'
                    : 'bg-blue-500/15 border-blue-500/40 text-blue-400 hover:bg-blue-500/25'
                }`}
              >
                {copiedId === 'new' ? (
                  <><Check className="w-3.5 h-3.5" /> Copied to Clipboard!</>
                ) : (
                  <><Copy className="w-3.5 h-3.5" /> Copy Tracking Number</>
                )}
              </button>
            </div>

            <button
              onClick={() => { setNewOrderResult(null); window.location.reload(); }}
              className="w-full py-3 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider transition-colors"
            >
              Done — View Orders
            </button>
          </div>
        </div>
      )}

      {/* ── Create Order Modal ── */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setCreateModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-fashion-serif text-2xl font-bold text-white mb-6 border-l-2 border-gold-500 pl-3">
              Generate New Tailoring Order
            </h2>

            {createError && (
              <div className="p-3.5 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {createError}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Customer Name *</label>
                  <input type="text" name="customerName" required placeholder="Chief Kemi Adeleke"
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Customer Phone *</label>
                  <input type="tel" name="customerPhone" required placeholder="+234 800 123 4567"
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Customer Email *</label>
                  <input type="email" name="customerEmail" required placeholder="kemi@example.com"
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Outfit Title *</label>
                  <input type="text" name="outfitTitle" required placeholder="3-Piece Silk Agbada Set"
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Outfit Description *</label>
                <textarea name="description" required rows={3} placeholder="Embroidery patterns, color notes..."
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Measurements Specs (Chest, Waist, Inseam, Height...)
                </label>
                <input type="text" name="measurements" placeholder="Chest: 44in, Waist: 36in, Sleeve: 26in"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Expected Completion Date</label>
                  <input type="date" name="expectedCompletionDate"
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Delivery Address</label>
                  <input type="text" name="deliveryAddress" placeholder="Lekki Phase 1, Lagos"
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">Internal Studio Notes</label>
                <input type="text" name="internalNotes" placeholder="Fitting appointment set for Thursday"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white" />
              </div>

              <button
                type="submit"
                disabled={createLoading}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-colors"
              >
                {createLoading ? 'Generating Tracking Code...' : 'Create Order & Issue Tracking Code'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
