'use client';

import React, { useState } from 'react';
import { Plus, Pencil, Trash2, X, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { createFaqAction, updateFaqAction, deleteFaqAction } from '@/app/actions/admin';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  displayOrder: number;
  isPublished: boolean;
}

const FAQ_CATEGORIES = ['General', 'Orders', 'Production', 'Design', 'Measurements', 'Delivery', 'Apprenticeship', 'Payments'];

const emptyForm = { question: '', answer: '', category: 'General', displayOrder: 0, isPublished: true };

export function AdminFaqsClient({ initialFaqs }: { initialFaqs: FaqItem[] }) {
  const [faqs, setFaqs] = useState<FaqItem[]>(initialFaqs);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FaqItem | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openCreate = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setError(null);
    setModalOpen(true);
  };

  const openEdit = (faq: FaqItem) => {
    setEditTarget(faq);
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      displayOrder: faq.displayOrder,
      isPublished: faq.isPublished,
    });
    setError(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const fd = new FormData(e.currentTarget);
    if (editTarget) fd.append('id', editTarget.id);
    fd.set('isPublished', form.isPublished ? 'true' : 'false');

    const res = editTarget ? await updateFaqAction(fd) : await createFaqAction(fd);
    setLoading(false);

    if (res.success) {
      setModalOpen(false);
      showToast(editTarget ? 'FAQ updated successfully!' : 'FAQ created successfully!');
      // Refresh list from server via reload
      window.location.reload();
    } else {
      setError(res.error || 'Something went wrong.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this FAQ?')) return;
    const res = await deleteFaqAction(id);
    if (res.success) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      showToast('FAQ deleted.');
    }
  };

  return (
    <div className="space-y-6">

      {/* Toast */}
      {toast && (
        <div className="fixed top-[73px] lg:top-6 right-4 lg:right-6 z-50 px-5 py-3 rounded-2xl bg-emerald-500 text-white text-xs font-bold shadow-2xl flex items-center space-x-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-zinc-400 text-xs">{faqs.length} FAQ{faqs.length !== 1 ? 's' : ''} in database</p>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow flex items-center space-x-1.5 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* FAQ List */}
      <div className="space-y-3">
        {faqs.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 rounded-3xl bg-zinc-900 border border-zinc-800">
            No FAQs yet. Click "Add New FAQ" to create the first one.
          </div>
        ) : (
          faqs.map((faq) => (
            <div
              key={faq.id}
              className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-start justify-between gap-4 group hover:border-zinc-700 transition-colors"
            >
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 bg-gold-500/10 border border-gold-500/20 px-2 py-0.5 rounded-full">
                    {faq.category}
                  </span>
                  <span className="text-[10px] text-zinc-500">Order #{faq.displayOrder}</span>
                  {faq.isPublished ? (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                      <Eye className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-zinc-500 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Hidden
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-sm text-white">{faq.question}</h3>
                <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{faq.answer}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(faq)}
                  className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white transition-colors"
                  title="Edit"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-fashion-serif text-2xl font-bold text-white mb-6 border-l-2 border-gold-500 pl-3">
              {editTarget ? 'Edit FAQ' : 'Add New FAQ'}
            </h2>

            {error && (
              <div className="mb-4 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Question *
                </label>
                <input
                  type="text"
                  name="question"
                  required
                  value={form.question}
                  onChange={(e) => setForm({ ...form, question: e.target.value })}
                  placeholder="e.g. How long does tailoring take?"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Answer *
                </label>
                <textarea
                  name="answer"
                  required
                  rows={4}
                  value={form.answer}
                  onChange={(e) => setForm({ ...form, answer: e.target.value })}
                  placeholder="Write a clear, helpful answer..."
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
                  >
                    {FAQ_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    name="displayOrder"
                    min={0}
                    value={form.displayOrder}
                    onChange={(e) => setForm({ ...form, displayOrder: parseInt(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500"
                  />
                </div>
              </div>

              {/* Published toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-950 border border-zinc-800">
                <span className="text-xs font-bold text-zinc-300">Publish on public FAQ page</span>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, isPublished: !form.isPublished })}
                  className={`relative w-11 h-6 rounded-full transition-colors ${form.isPublished ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${form.isPublished ? 'left-6' : 'left-1'}`}
                  />
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-colors"
              >
                {loading ? 'Saving...' : editTarget ? 'Update FAQ' : 'Create FAQ'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
