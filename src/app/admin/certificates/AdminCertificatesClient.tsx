'use client';

import React, { useState, useRef } from 'react';
import {
  Plus, X, Edit3, Trash2, Eye, EyeOff, CheckCircle2,
  Upload, Link2, Loader2, AlertCircle, Award, ExternalLink, Download,
} from 'lucide-react';
import {
  createCertificateAction, updateCertificateAction,
  deleteCertificateAction, toggleCertificatePublishAction,
} from '@/app/actions/admin';

interface CertItem {
  id: string;
  title: string;
  institution: string;
  dateObtained: string;
  description: string | null;
  fileUrl: string;
  fileType: string;
  isPublished: boolean;
  displayOrder: number;
  createdAt: Date;
}

const IC = 'w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500';
const LC = 'block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1';

// ── File/URL picker that supports both images and PDFs ──────────────────────
function FilePicker({ fieldName, defaultUrl = '' }: { fieldName: string; defaultUrl?: string }) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState(defaultUrl);
  const [finalUrl, setFinalUrl] = useState(defaultUrl);
  const [preview, setPreview] = useState(defaultUrl);
  const [fileType, setFileType] = useState<'IMAGE' | 'PDF'>(
    defaultUrl.toLowerCase().endsWith('.pdf') ? 'PDF' : 'IMAGE'
  );
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyUrl = (v: string) => {
    const isPdf = v.toLowerCase().includes('.pdf') || v.toLowerCase().includes('/pdf');
    setFinalUrl(v); setPreview(v); setErr(null);
    setFileType(isPdf ? 'PDF' : 'IMAGE');
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowed.includes(file.type)) { setErr('Only JPG, PNG, WebP, or PDF allowed.'); return; }
    if (file.size > 10 * 1024 * 1024) { setErr('Max file size is 10 MB.'); return; }
    setErr(null); setUploading(true);
    const isPdf = file.type === 'application/pdf';
    setFileType(isPdf ? 'PDF' : 'IMAGE');
    if (!isPdf) setPreview(URL.createObjectURL(file));
    try {
      const fd = new FormData(); fd.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success && data.url) { setFinalUrl(data.url); if (!isPdf) setPreview(data.url); }
      else { setErr(data.error || 'Upload failed.'); setPreview(''); setFinalUrl(''); }
    } catch { setErr('Network error.'); setPreview(''); setFinalUrl(''); }
    finally { setUploading(false); }
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className={LC}>Certificate File *</label>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700 text-[10px] font-bold">
          {(['url', 'upload'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setMode(m); setErr(null); }}
              className={`px-3 py-1.5 flex items-center gap-1.5 uppercase transition-colors ${mode === m ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>
              {m === 'url' ? <Link2 className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
              {m === 'url' ? 'URL' : 'Upload'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'url' && (
        <input type="url" value={urlInput}
          onChange={e => { setUrlInput(e.target.value); if (!e.target.value.trim()) { setFinalUrl(''); setPreview(''); } }}
          onBlur={() => applyUrl(urlInput.trim())}
          placeholder="https://... (image or PDF URL)"
          className={IC} />
      )}

      {mode === 'upload' && (
        <div onClick={() => !uploading && fileRef.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-5 gap-2 transition-colors ${uploading ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-700 hover:border-blue-500/60 bg-zinc-950'}`}>
          {uploading
            ? <><Loader2 className="w-5 h-5 text-blue-400 animate-spin" /><span className="text-xs text-blue-400">Uploading...</span></>
            : <><Upload className="w-5 h-5 text-zinc-500" /><span className="text-xs text-zinc-400">Click to select file</span><span className="text-[10px] text-zinc-600">JPG, PNG, WebP, PDF · max 10 MB</span></>}
          <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp,application/pdf"
            className="hidden" onChange={handleFile} disabled={uploading} />
        </div>
      )}

      {err && <div className="flex items-center gap-2 text-rose-400 text-[11px]"><AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{err}</span></div>}

      {preview && !err && fileType === 'IMAGE' && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-700 h-32 bg-zinc-950">
          <img src={preview} alt="Preview" className="w-full h-full object-contain"
            onError={() => { setErr('Could not load image.'); setPreview(''); setFinalUrl(''); }} />
        </div>
      )}

      {finalUrl && !err && fileType === 'PDF' && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-950 border border-zinc-700 text-xs text-zinc-300">
          <Award className="w-4 h-4 text-gold-400 shrink-0" />
          <span className="truncate">PDF ready: {finalUrl.split('/').pop()}</span>
        </div>
      )}

      <input type="hidden" name={fieldName} value={finalUrl} required />
      <input type="hidden" name="fileType" value={fileType} />
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export function AdminCertificatesClient({ initialCerts }: { initialCerts: CertItem[] }) {
  const [certs, setCerts] = useState<CertItem[]>(initialCerts);
  const [createOpen, setCreateOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<CertItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [toastErr, setToastErr] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const showToast = (msg: string, isErr = false) => {
    setToast(msg); setToastErr(isErr);
    setTimeout(() => setToast(null), 3500);
  };

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const res = await createCertificateAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) { setCreateOpen(false); showToast('Certificate saved.'); window.location.reload(); }
    else setErr(res.error || 'Failed to save.');
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const res = await updateCertificateAction(new FormData(e.currentTarget));
    setBusy(false);
    if (res.success) { setEditTarget(null); showToast('Certificate updated.'); window.location.reload(); }
    else setErr(res.error || 'Failed to update.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certificate? This cannot be undone.')) return;
    setDeletingId(id);
    const res = await deleteCertificateAction(id);
    setDeletingId(null);
    if (res.success) { setCerts(prev => prev.filter(c => c.id !== id)); showToast('Certificate deleted.'); }
    else showToast(res.error || 'Failed to delete.', true);
  };

  const handleTogglePublish = async (cert: CertItem) => {
    setTogglingId(cert.id);
    const res = await toggleCertificatePublishAction(cert.id, !cert.isPublished);
    setTogglingId(null);
    if (res.success) {
      setCerts(prev => prev.map(c => c.id === cert.id ? { ...c, isPublished: !c.isPublished } : c));
      showToast(cert.isPublished ? 'Certificate unpublished.' : 'Certificate published.');
    } else showToast(res.error || 'Failed.', true);
  };

  const ModalForm = ({ cert, onSubmit, title }: { cert?: CertItem; onSubmit: (e: React.FormEvent<HTMLFormElement>) => void; title: string }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
        <button onClick={() => { setCreateOpen(false); setEditTarget(null); setErr(null); }}
          className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
        <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">{title}</h2>
        {err && <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{err}</div>}
        <form onSubmit={onSubmit} className="space-y-4">
          {cert && <input type="hidden" name="id" value={cert.id} />}
          <div>
            <label className={LC}>Certificate Title *</label>
            <input type="text" name="title" required defaultValue={cert?.title} placeholder="e.g. Advanced Fashion Design Diploma" className={IC} />
          </div>
          <div>
            <label className={LC}>Issuing Institution *</label>
            <input type="text" name="institution" required defaultValue={cert?.institution} placeholder="e.g. Lagos Fashion Academy" className={IC} />
          </div>
          <div>
            <label className={LC}>Date Obtained *</label>
            <input type="text" name="dateObtained" required defaultValue={cert?.dateObtained} placeholder="e.g. March 2022" className={IC} />
          </div>
          <div>
            <label className={LC}>Description (optional)</label>
            <textarea name="description" rows={2} defaultValue={cert?.description || ''} placeholder="Brief description of what was achieved..." className={IC} />
          </div>
          <FilePicker fieldName="fileUrl" defaultUrl={cert?.fileUrl || ''} />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={LC}>Display Order</label>
              <input type="number" name="displayOrder" defaultValue={cert?.displayOrder ?? 0} min={0} className={IC} />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" name="isPublished" value="true" defaultChecked={cert?.isPublished ?? false}
                  className="w-4 h-4 accent-gold-500 rounded" />
                <span className="text-xs text-zinc-300 font-bold">Publish to About page</span>
              </label>
            </div>
          </div>
          <button type="submit" disabled={busy}
            className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
            {busy ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : cert ? 'Save Changes' : 'Add Certificate'}
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-[73px] lg:top-6 right-4 lg:right-6 z-50 px-5 py-3 rounded-2xl text-white text-xs font-bold shadow-2xl flex items-center gap-2 ${toastErr ? 'bg-rose-500' : 'bg-emerald-500'}`}>
          {toastErr ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          <span>{toast}</span>
        </div>
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-zinc-400 text-xs">{certs.length} certificate{certs.length !== 1 ? 's' : ''} · {certs.filter(c => c.isPublished).length} published</p>
        <button onClick={() => { setErr(null); setCreateOpen(true); }}
          className="px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow flex items-center gap-1.5 transition-all">
          <Plus className="w-4 h-4" /><span>Add Certificate</span>
        </button>
      </div>

      {/* Grid */}
      {certs.length === 0 ? (
        <div className="p-16 text-center rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
          <Award className="w-10 h-10 text-zinc-600 mx-auto" />
          <p className="text-zinc-500 text-sm">No certificates added yet.</p>
          <p className="text-zinc-600 text-xs">Click &quot;Add Certificate&quot; to upload your first credential.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map(cert => (
            <div key={cert.id} className={`rounded-2xl bg-zinc-900 border overflow-hidden shadow-lg flex flex-col transition-all ${cert.isPublished ? 'border-zinc-700' : 'border-zinc-800 opacity-70'}`}>
              {/* Preview */}
              <div className="relative h-44 bg-zinc-950 flex items-center justify-center">
                {cert.fileType === 'PDF' ? (
                  <div className="flex flex-col items-center gap-2">
                    <Award className="w-12 h-12 text-gold-400" />
                    <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">PDF Document</span>
                  </div>
                ) : (
                  <img src={cert.fileUrl} alt={cert.title} className="w-full h-full object-contain p-2" />
                )}
                {!cert.isPublished && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-zinc-800 border border-zinc-700 text-[9px] font-bold text-zinc-400 uppercase">
                    Draft
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="p-4 flex-grow space-y-1">
                <h3 className="font-fashion-serif text-sm font-bold text-white line-clamp-2">{cert.title}</h3>
                <p className="text-zinc-400 text-[11px]">{cert.institution}</p>
                <p className="text-gold-400 text-[10px] font-bold">{cert.dateObtained}</p>
                {cert.description && <p className="text-zinc-500 text-[10px] line-clamp-2 mt-1">{cert.description}</p>}
              </div>

              {/* Actions */}
              <div className="p-3 border-t border-zinc-800 flex flex-wrap gap-1.5">
                <a href={cert.fileUrl} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-[10px] font-bold uppercase transition-colors">
                  <ExternalLink className="w-3 h-3" /> View
                </a>
                <a href={cert.fileUrl} download
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 text-zinc-300 hover:text-white text-[10px] font-bold uppercase transition-colors">
                  <Download className="w-3 h-3" /> Download
                </a>
                <button onClick={() => { setErr(null); setEditTarget(cert); }}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-zinc-800 text-gold-400 hover:bg-gold-500/20 text-[10px] font-bold uppercase transition-colors">
                  <Edit3 className="w-3 h-3" /> Edit
                </button>
                <button onClick={() => handleTogglePublish(cert)} disabled={togglingId === cert.id}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors disabled:opacity-50 ${cert.isPublished ? 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25' : 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'}`}>
                  {cert.isPublished ? <><EyeOff className="w-3 h-3" /> Unpublish</> : <><Eye className="w-3 h-3" /> Publish</>}
                </button>
                <button onClick={() => handleDelete(cert.id)} disabled={deletingId === cert.id}
                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 text-[10px] font-bold uppercase transition-colors disabled:opacity-50">
                  <Trash2 className="w-3 h-3" /> {deletingId === cert.id ? '...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      {createOpen && <ModalForm title="Add Certificate" onSubmit={handleCreate} />}
      {editTarget && <ModalForm cert={editTarget} title={`Edit: ${editTarget.title}`} onSubmit={handleEdit} />}
    </div>
  );
}
