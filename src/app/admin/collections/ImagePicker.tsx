'use client';

import React, { useState, useRef } from 'react';
import { Link2, Upload, AlertCircle, Loader2, RefreshCw, X } from 'lucide-react';

interface ImagePickerProps {
  label: string;
  fieldName: string;
  defaultUrl?: string;
  required?: boolean;
}

export function ImagePicker({ label, fieldName, defaultUrl = '', required = false }: ImagePickerProps) {
  const [mode,      setMode]      = useState<'url' | 'upload'>('url');
  const [urlInput,  setUrlInput]  = useState(defaultUrl);
  const [preview,   setPreview]   = useState(defaultUrl);
  const [finalUrl,  setFinalUrl]  = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);
  const [err,       setErr]       = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyUrl = (v: string) => { setPreview(v); setFinalUrl(v); setErr(null); };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg','image/jpg','image/png','image/webp'].includes(file.type)) {
      setErr('Only JPG, PNG, WebP allowed.'); return;
    }
    if (file.size > 5 * 1024 * 1024) { setErr('Max 5 MB.'); return; }
    setErr(null); setUploading(true);
    setPreview(URL.createObjectURL(file));
    try {
      const fd = new FormData(); fd.append('file', file);
      const data = await fetch('/api/upload', { method: 'POST', body: fd }).then(r => r.json());
      if (data.success && data.url) { setFinalUrl(data.url); setPreview(data.url); }
      else { setErr(data.error || 'Upload failed.'); setPreview(''); setFinalUrl(''); }
    } catch { setErr('Network error.'); setPreview(''); setFinalUrl(''); }
    finally { setUploading(false); }
  };

  const clear = () => {
    setPreview(''); setFinalUrl(''); setUrlInput(''); setErr(null);
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
          {label}{required && ' *'}
        </label>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700 text-[10px] font-bold">
          {(['url','upload'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setMode(m); setErr(null); }}
              className={`px-3 py-1.5 flex items-center gap-1.5 uppercase transition-colors ${mode===m?'bg-blue-600 text-white':'bg-zinc-900 text-zinc-400 hover:text-white'}`}>
              {m==='url' ? <Link2 className="w-3 h-3"/> : <Upload className="w-3 h-3"/>}
              {m==='url' ? 'URL' : 'Upload'}
            </button>
          ))}
        </div>
      </div>

      {mode==='url' && (
        <input type="url" value={urlInput}
          onChange={e => { setUrlInput(e.target.value); if (!e.target.value.trim()) { setPreview(''); setFinalUrl(''); } }}
          onBlur={() => applyUrl(urlInput.trim())}
          placeholder="https://images.unsplash.com/photo-example.jpg"
          className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-blue-500"/>
      )}

      {mode==='upload' && (
        <div onClick={() => !uploading && fileRef.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-5 gap-2 transition-colors ${uploading?'border-blue-500/50 bg-blue-500/5':'border-zinc-700 hover:border-blue-500/60 bg-zinc-950'}`}>
          {uploading
            ? <><Loader2 className="w-5 h-5 text-blue-400 animate-spin"/><span className="text-xs text-blue-400">Uploading...</span></>
            : <><Upload className="w-5 h-5 text-zinc-500"/><span className="text-xs text-zinc-400">Click to select a photo</span><span className="text-[10px] text-zinc-600">JPG, PNG, WebP · max 5 MB</span></>}
          <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden" onChange={handleFile} disabled={uploading}/>
        </div>
      )}

      {err && <div className="flex items-center gap-2 text-rose-400 text-[11px]"><AlertCircle className="w-3.5 h-3.5 shrink-0"/><span>{err}</span></div>}

      {preview && !err && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-700 h-36 bg-zinc-950">
          <img src={preview} alt="Preview" className="w-full h-full object-cover"
            onError={() => { setErr('Could not load image.'); setPreview(''); setFinalUrl(''); }}/>
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button type="button" onClick={() => fileRef.current?.click()} className="p-1.5 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white"><RefreshCw className="w-3 h-3"/></button>
            <button type="button" onClick={clear} className="p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-500"><X className="w-3 h-3"/></button>
          </div>
          {uploading && <div className="absolute inset-0 bg-zinc-950/60 flex items-center justify-center"><Loader2 className="w-5 h-5 text-blue-400 animate-spin"/></div>}
        </div>
      )}

      <input type="hidden" name={fieldName} value={finalUrl} required={required}/>
    </div>
  );
}
