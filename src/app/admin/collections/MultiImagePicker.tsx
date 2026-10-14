'use client';

import React, { useState, useRef } from 'react';
import { Link2, Upload, AlertCircle, Loader2, X, Plus, Film } from 'lucide-react';

interface MediaEntry {
  id:        string;
  url:       string;
  preview:   string;          // object-URL for local preview or the final CDN URL
  mediaType: 'IMAGE' | 'VIDEO';
  uploading: boolean;
  err:       string | null;
}

interface MultiImagePickerProps {
  fieldPrefix?:       string;   // hidden inputs: fieldPrefix_0, fieldPrefix_1 …
  defaultUrls?:       string[];
  defaultMediaTypes?: string[]; // parallel array — 'IMAGE' | 'VIDEO' per url
  maxItems?:          number;
}

let _id = 0;
const uid = () => String(++_id);

const IMAGE_ACCEPT = 'image/jpeg,image/jpg,image/png,image/webp';
const VIDEO_ACCEPT = 'video/mp4,video/webm,video/quicktime,video/x-msvideo';
const ALL_ACCEPT   = `${IMAGE_ACCEPT},${VIDEO_ACCEPT}`;

function guessTypeFromUrl(url: string): 'IMAGE' | 'VIDEO' {
  return /\.(mp4|webm|mov|avi)(\?|$)/i.test(url) ? 'VIDEO' : 'IMAGE';
}

export function MultiImagePicker({
  fieldPrefix       = 'imageUrl',
  defaultUrls       = [],
  defaultMediaTypes = [],
  maxItems          = 10,
}: MultiImagePickerProps) {
  const [entries, setEntries] = useState<MediaEntry[]>(() =>
    defaultUrls.filter(Boolean).map((u, i) => ({
      id:        uid(),
      url:       u,
      preview:   u,
      mediaType: (defaultMediaTypes[i] as 'IMAGE' | 'VIDEO') ?? guessTypeFromUrl(u),
      uploading: false,
      err:       null,
    }))
  );

  const [addMode,  setAddMode]  = useState<'url' | 'upload'>('url');
  const [urlDraft, setUrlDraft] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const update = (id: string, patch: Partial<MediaEntry>) =>
    setEntries(prev => prev.map(e => e.id === id ? { ...e, ...patch } : e));

  const remove = (id: string) => setEntries(prev => prev.filter(e => e.id !== id));

  /* ── Add by URL ── */
  const addUrl = () => {
    const v = urlDraft.trim();
    if (!v) return;
    setEntries(prev => [
      ...prev,
      { id: uid(), url: v, preview: v, mediaType: guessTypeFromUrl(v), uploading: false, err: null },
    ]);
    setUrlDraft('');
  };

  /* ── Upload a single file ── */
  const uploadFile = async (file: File) => {
    const isVideo = file.type.startsWith('video/');

    // client-side size guard (server also validates)
    const maxMB    = isVideo ? 200 : 10;
    const maxBytes = maxMB * 1024 * 1024;
    if (file.size > maxBytes) {
      setEntries(prev => [
        ...prev,
        {
          id: uid(), url: '', preview: '', uploading: false,
          mediaType: isVideo ? 'VIDEO' : 'IMAGE',
          err: `File too large. Max ${maxMB} MB for ${isVideo ? 'videos' : 'images'}.`,
        },
      ]);
      return;
    }

    const newEntry: MediaEntry = {
      id:        uid(),
      url:       '',
      preview:   URL.createObjectURL(file),
      mediaType: isVideo ? 'VIDEO' : 'IMAGE',
      uploading: true,
      err:       null,
    };
    setEntries(prev => [...prev, newEntry]);

    try {
      const fd = new FormData();
      fd.append('file', file);
      const data = await fetch('/api/upload', { method: 'POST', body: fd }).then(r => r.json());
      if (data.success && data.url) {
        update(newEntry.id, {
          url:       data.url,
          preview:   data.url,
          mediaType: data.mediaType ?? (isVideo ? 'VIDEO' : 'IMAGE'),
          uploading: false,
        });
      } else {
        update(newEntry.id, { err: data.error || 'Upload failed.', uploading: false, preview: '' });
      }
    } catch {
      update(newEntry.id, { err: 'Network error.', uploading: false, preview: '' });
    }
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files     = Array.from(e.target.files || []);
    const remaining = maxItems - entries.length;
    files.slice(0, remaining).forEach(uploadFile);
    e.target.value = '';
  };

  const canAdd       = entries.length < maxItems;
  const validEntries = entries.filter(e => e.url && !e.err);

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          Media ({entries.length}/{maxItems})
        </span>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700 text-[10px] font-bold">
          {(['url', 'upload'] as const).map(m => (
            <button
              key={m} type="button" onClick={() => setAddMode(m)}
              className={`px-3 py-1.5 flex items-center gap-1.5 uppercase transition-colors ${
                addMode === m
                  ? 'bg-blue-600 text-white'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white'
              }`}
            >
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
                placeholder="https://… (image or video URL)"
                className="flex-1 p-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-blue-500"
              />
              <button
                type="button" onClick={addUrl} disabled={!urlDraft.trim()}
                className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-xl border-2 border-dashed border-zinc-700 hover:border-blue-500/60 bg-zinc-950 cursor-pointer flex flex-col items-center justify-center gap-1.5 py-4 transition-colors"
            >
              <Upload className="w-4 h-4 text-zinc-500" />
              <span className="text-xs text-zinc-400">
                Click to select photos or videos (up to {maxItems - entries.length} more)
              </span>
              <span className="text-[10px] text-zinc-600">
                JPG, PNG, WebP · max 10 MB &nbsp;|&nbsp; MP4, WebM, MOV · max 200 MB
              </span>
              <input
                ref={fileRef} type="file" multiple accept={ALL_ACCEPT}
                className="hidden" onChange={handleFiles}
              />
            </div>
          )}
        </div>
      )}

      {/* Preview grid */}
      {entries.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {entries.map((entry, idx) => (
            <div
              key={entry.id}
              className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 aspect-square"
            >
              {/* Media preview */}
              {entry.preview && !entry.err && (
                entry.mediaType === 'VIDEO' ? (
                  <video
                    src={entry.preview}
                    className="w-full h-full object-cover"
                    muted playsInline
                    onError={() => update(entry.id, { err: 'Could not load video.', preview: '' })}
                  />
                ) : (
                  <img
                    src={entry.preview}
                    alt={`Media ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onError={() => update(entry.id, { err: 'Could not load image.', preview: '' })}
                  />
                )
              )}

              {/* Video badge */}
              {entry.mediaType === 'VIDEO' && entry.preview && !entry.err && !entry.uploading && (
                <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-zinc-950/80">
                  <Film className="w-3 h-3 text-blue-400" />
                  <span className="text-[9px] text-blue-400 font-bold">VIDEO</span>
                </div>
              )}

              {/* Uploading overlay */}
              {entry.uploading && (
                <div className="absolute inset-0 bg-zinc-950/70 flex flex-col items-center justify-center gap-1">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="text-[10px] text-blue-400">Uploading…</span>
                </div>
              )}

              {/* Error state */}
              {entry.err && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 p-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span className="text-[9px] text-rose-400 text-center">{entry.err}</span>
                </div>
              )}

              {/* Remove button */}
              {!entry.uploading && (
                <button
                  type="button" onClick={() => remove(entry.id)}
                  className="absolute top-1.5 right-1.5 p-1 rounded-full bg-rose-600/90 text-white hover:bg-rose-500 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}

              {/* Index badge */}
              <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-zinc-950/80 text-[9px] text-zinc-400 font-mono">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {entries.length === 0 && (
        <p className="text-[11px] text-zinc-600 text-center py-2">No media added yet.</p>
      )}

      {/* Hidden inputs — one URL + mediaType pair per valid entry */}
      {validEntries.map((entry, idx) => (
        <React.Fragment key={entry.id}>
          <input type="hidden" name={`${fieldPrefix}_${idx}`}      value={entry.url} />
          <input type="hidden" name={`${fieldPrefix}_type_${idx}`} value={entry.mediaType} />
        </React.Fragment>
      ))}
      <input type="hidden" name={`${fieldPrefix}_count`} value={validEntries.length} />
    </div>
  );
}
