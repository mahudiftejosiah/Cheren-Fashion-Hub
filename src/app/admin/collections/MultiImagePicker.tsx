'use client';

import React, { useState, useRef } from 'react';
import { Link2, Upload, AlertCircle, Loader2, X, Plus, GripVertical } from 'lucide-react';

interface ImageEntry {
  id: string;
  url: string;
  preview: string;
  uploading: boolean;
  err: string | null;
}

interface MultiImagePickerProps {
  fieldPrefix?: string;   // hidden input names will be fieldPrefix_0, fieldPrefix_1 …
  defaultUrls?: string[]; // pre-populated when editing
  maxImages?: number;
}

let _id = 0;
const uid = () => String(++_id);

export function MultiImagePicker({
  fieldPrefix = 'imageUrl',
  defaultUrls = [],
  maxImages = 10,
}: MultiImagePickerProps) {
  const [entries, setEntries] = useState<ImageEntry[]>(() =>
    defaultUrls.filter(Boolean).map(u => ({ id: uid(), url: u, preview: u, uploading: false, err: null }))
  );
  const [addMode, setAddMode] = useState<'url' | 'upload'>('url');
  const [urlDraft, setUrlDraft] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (id: string, patch: Partial<ImageEntry>) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));

  const remove = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  const addUrl = () => {
    const v = urlDraft.trim();
    if (!v) return;
    setEntries(prev => [...prev, { id: uid(), url: v, preview: v, uploading: false, err: null }]);
    setUrlDraft('');
  };

  const uploadFile = async (file: File) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) return;
    if (file.size > 5 * 1024 * 1024) return;
    const newEntry: ImageEntry = { id: uid(), url: '', preview: URL.createObjectURL(file), uploading: true, err: null };
    setEntries(prev => [...prev, newEntry]);
    try {
      const fd = new FormData(); fd.append('file', file);
      const data = await fetch('/api/upload', { method: 'POST', body: fd }).then(r => r.json());
      if (data.success && data.url) {
        update(newEntry.id, { url: data.url, preview: data.url, uploading: false });
      } else {
        update(newEntry.id, { err: data.error || 'Upload failed.', uploading: false, preview: '' });
      }
    } catch {
      update(newEntry.id, { err: 'Network error.', uploading: false, preview: '' });
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const remaining = maxImages - entries.length;
    files.slice(0, remaining).forEach(uploadFile);
    e.target.value = '';
  };

  const canAdd = entries.length < maxImages;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Photos ({entries.length}/{maxImages})
        </span>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700 text-[10px] font-bold">
          {(['url', 'upload'] as const).map(m => (
            <button key={m} type="button" onClick={() => setAddMode(m)}
              className={`px-3 py-1.5 flex items-center gap-1.5 uppercase transition-colors ${addMode === m ? 'bg-blue-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>
              {m === 'url' ? <Link2 className="w-3 h-3" /> : <Upload className="w-3 h-3" />}
              {m === 'url' ? 'URL' : 'Upload'}
            </button>
          ))}
        </div>
      </div>

      {/* Add row */}
      {canAdd && (
        <div className="flex gap-2">
          {addMode === 'url' ? (
            <>
              <input
                type="url" value={urlDraft}
                onChange={e => setUrlDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addUrl())}
                placeholder="https://images.unsplash.com/photo.jpg"
                className="flex-1 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button type="button" onClick={addUrl} disabled={!urlDraft.trim()}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-zinc-700 hover:border-blue-500/60 bg-zinc-950 cursor-pointer flex items-center justify-center gap-2 py-3 transition-colors">
              <Upload className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-400">Click to select photos (up to {maxImages - entries.length} more)</span>
              <input ref={fileRef} type="file" multiple accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden" onChange={handleFiles} />
            </div>
          )}
        </div>
      )}

      {/* Preview grid */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map((entry, idx) => (
            <div key={entry.id} className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 aspect-square">
              {entry.preview && !entry.err && (
                <img src={entry.preview} alt={`Photo ${idx + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => update(entry.id, { err: 'Could not load.', preview: '' })} />
              )}

              {entry.uploading && (
                <div className="absolute inset-0 bg-zinc-950/70 flex flex-col items-center justify-center gap-1">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="text-[10px] text-blue-400">Uploading...</span>
                </div>
              )}

              {entry.err && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-[9px] text-rose-400 text-center">{entry.err}</span>
                </div>
              )}

              {!entry.uploading && (
                <button type="button" onClick={() => remove(entry.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-500 transition-colors">
                  <X className="w-3 h-3" />
                </button>
              )}

              <div className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded-md bg-zinc-950/80 text-[9px] text-zinc-400 font-mono">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && (
        <p className="text-[11px] text-zinc-600 text-center py-2">No photos added yet.</p>
      )}

      {/* Hidden inputs — one per image URL */}
      {entries.filter(e => e.url && !e.err).map((entry, idx) => (
        <input key={entry.id} type="hidden" name={`${fieldPrefix}_${idx}`} value={entry.url} />
      ))}
      {/* Total count so the action knows how many to read */}
      <input type="hidden" name={`${fieldPrefix}_count`} value={entries.filter(e => e.url && !e.err).length} />
    </div>
  );
}
