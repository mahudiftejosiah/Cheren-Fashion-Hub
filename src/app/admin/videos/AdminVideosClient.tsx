'use client';

import React, { useState, useRef } from 'react';
import {
  Plus, Trash2, Edit3, X, Loader2, CheckCircle2,
  Film, Upload, Link2, AlertCircle, RefreshCw, Star, StarOff,
} from 'lucide-react';
import {
  createVideoAction,
  updateVideoAction,
  deleteVideoAction,
  toggleVideoFeaturedAction,
} from '@/app/actions/admin';

// ─── Types ────────────────────────────────────────────────────────────────────
interface VideoItem {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: string;
  isFeatured: boolean;
  createdAt: Date;
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const IC = 'w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-blue-500 placeholder:text-zinc-600 transition-colors';
const LC = 'block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1';

// ─── Video URL / Upload picker ────────────────────────────────────────────────
function VideoPicker({
  label, fieldName, defaultUrl = '', required = false,
}: {
  label: string; fieldName: string; defaultUrl?: string; required?: boolean;
}) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState(defaultUrl);
  const [finalUrl, setFinalUrl] = useState(defaultUrl);
  const [preview, setPreview] = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyUrl = (v: string) => { setPreview(v); setFinalUrl(v); setErr(null); };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const ALLOWED = ['video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo'];
    if (!ALLOWED.includes(file.type)) { setErr('Only MP4, WebM, MOV, AVI allowed.'); return; }
    if (file.size > 200 * 1024 * 1024) { setErr('Max 200 MB.'); return; }
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

  const clear = () => { setPreview(''); setFinalUrl(''); setUrlInput(''); setErr(null); if (fileRef.current) fileRef.current.value = ''; };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className={LC}>{label}{required && ' *'}</label>
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
          onChange={e => { setUrlInput(e.target.value); if (!e.target.value.trim()) { setPreview(''); setFinalUrl(''); } }}
          onBlur={() => applyUrl(urlInput.trim())}
          placeholder="https://example.com/fashion-video.mp4"
          className={IC} />
      )}

      {mode === 'upload' && (
        <div onClick={() => !uploading && fileRef.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-6 gap-2 transition-colors ${uploading ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-700 hover:border-blue-500/60 bg-zinc-950'}`}>
          {uploading
            ? <><Loader2 className="w-6 h-6 text-blue-400 animate-spin" /><span className="text-xs text-blue-400">Uploading video…</span><span className="text-[10px] text-zinc-500">This may take a minute for large files</span></>
            : <><Film className="w-6 h-6 text-zinc-500" /><span className="text-xs text-zinc-400">Click to select a video file</span><span className="text-[10px] text-zinc-600">MP4, WebM, MOV, AVI · max 200 MB</span></>}
          <input ref={fileRef} type="file" accept="video/mp4,video/webm,video/quicktime,video/x-msvideo"
            className="hidden" onChange={handleFile} disabled={uploading} />
        </div>
      )}

      {err && <div className="flex items-center gap-2 text-rose-400 text-[11px]"><AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{err}</span></div>}

      {preview && !err && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950">
          <video src={preview} controls className="w-full max-h-44 object-cover" preload="metadata" />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button type="button" onClick={() => fileRef.current?.click()} className="p-1.5 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white"><RefreshCw className="w-3 h-3" /></button>
            <button type="button" onClick={clear} className="p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-500"><X className="w-3 h-3" /></button>
          </div>
          {uploading && <div className="absolute inset-0 bg-zinc-950/60 flex items-center justify-center"><Loader2 className="w-5 h-5 text-blue-400 animate-spin" /></div>}
        </div>
      )}

      <input type="hidden" name={fieldName} value={finalUrl} required={required} />
    </div>
  );
}

// ─── Thumbnail picker (image) ─────────────────────────────────────────────────
function ThumbnailPicker({ defaultUrl = '' }: { defaultUrl?: string }) {
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [urlInput, setUrlInput] = useState(defaultUrl);
  const [finalUrl, setFinalUrl] = useState(defaultUrl);
  const [preview, setPreview] = useState(defaultUrl);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const applyUrl = (v: string) => { setPreview(v); setFinalUrl(v); setErr(null); };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) { setErr('Only JPG, PNG, WebP allowed.'); return; }
    if (file.size > 10 * 1024 * 1024) { setErr('Max 10 MB.'); return; }
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

  const clear = () => { setPreview(''); setFinalUrl(''); setUrlInput(''); setErr(null); if (fileRef.current) fileRef.current.value = ''; };

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <label className={LC}>Thumbnail Image (optional)</label>
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
          onChange={e => { setUrlInput(e.target.value); if (!e.target.value.trim()) { setPreview(''); setFinalUrl(''); } }}
          onBlur={() => applyUrl(urlInput.trim())}
          placeholder="https://example.com/thumbnail.jpg (optional)"
          className={IC} />
      )}

      {mode === 'upload' && (
        <div onClick={() => !uploading && fileRef.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-5 gap-2 transition-colors ${uploading ? 'border-blue-500/50 bg-blue-500/5' : 'border-zinc-700 hover:border-blue-500/60 bg-zinc-950'}`}>
          {uploading
            ? <><Loader2 className="w-5 h-5 text-blue-400 animate-spin" /><span className="text-xs text-blue-400">Uploading...</span></>
            : <><Upload className="w-5 h-5 text-zinc-500" /><span className="text-xs text-zinc-400">Click to select a thumbnail</span><span className="text-[10px] text-zinc-600">JPG, PNG, WebP · max 10 MB</span></>}
          <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden" onChange={handleFile} disabled={uploading} />
        </div>
      )}

      {err && <div className="flex items-center gap-2 text-rose-400 text-[11px]"><AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{err}</span></div>}

      {preview && !err && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-700 h-32 bg-zinc-950">
          <img src={preview} alt="Thumbnail preview" className="w-full h-full object-cover"
            onError={() => { setErr('Could not load image.'); setPreview(''); setFinalUrl(''); }} />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button type="button" onClick={clear} className="p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-500"><X className="w-3 h-3" /></button>
          </div>
          {uploading && <div className="absolute inset-0 bg-zinc-950/60 flex items-center justify-center"><Loader2 className="w-5 h-5 text-blue-400 animate-spin" /></div>}
        </div>
      )}

      <input type="hidden" name="thumbnailUrl" value={finalUrl} />
    </div>
  );
}

// ─── Category selector ────────────────────────────────────────────────────────
function CategorySelect({ defaultValue }: { defaultValue?: string }) {
  return (
    <select name="category" defaultValue={defaultValue || 'Fashion'} className={IC}>
      <option value="Fashion">Fashion</option>
      <option value="Behind the Scenes">Behind the Scenes</option>
      <option value="Runway">Runway</option>
      <option value="Tutorials">Tutorials</option>
      <option value="Client Stories">Client Stories</option>
      <option value="Process & Craft">Process &amp; Craft</option>
    </select>
  );
}

// ─── Video card ───────────────────────────────────────────────────────────────
function VideoCard({
  video, onEdit, onDelete, onToggleFeatured, busy,
}: {
  video: VideoItem;
  onEdit: (v: VideoItem) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string, val: boolean) => void;
  busy: boolean;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 shadow-xl flex flex-col">
      {/* Video preview */}
      <div className="relative aspect-video bg-zinc-950">
        <video
          src={video.videoUrl}
          poster={video.thumbnailUrl || undefined}
          className="w-full h-full object-cover"
          preload="none"
          controls
        />
        {video.isFeatured && (
          <div className="absolute top-2 left-2 flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow">
            <Star className="w-3 h-3 fill-current" /> Featured
          </div>
        )}
        <div className="absolute top-2 right-2 px-2 py-1 rounded-full bg-zinc-950/80 backdrop-blur text-pink-400 text-[10px] font-bold uppercase tracking-wider border border-pink-500/30">
          {video.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        <div className="space-y-1">
          <h3 className="font-fashion-serif text-base font-bold text-white line-clamp-1">{video.title}</h3>
          <p className="text-zinc-400 text-xs line-clamp-2 font-light leading-relaxed">{video.description}</p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-auto pt-2 border-t border-zinc-800">
          <button
            onClick={() => onToggleFeatured(video.id, !video.isFeatured)}
            disabled={busy}
            title={video.isFeatured ? 'Remove from homepage' : 'Feature on homepage'}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${
              video.isFeatured
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-white'
            }`}
          >
            {video.isFeatured ? <StarOff className="w-3 h-3" /> : <Star className="w-3 h-3" />}
            {video.isFeatured ? 'Unfeature' : 'Feature'}
          </button>

          <button
            onClick={() => onEdit(video)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30 text-[10px] font-bold uppercase tracking-wider transition-all"
          >
            <Edit3 className="w-3 h-3" /> Edit
          </button>

          <button
            onClick={() => onDelete(video.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/40 hover:bg-rose-600/30 text-[10px] font-bold uppercase tracking-wider transition-all ml-auto"
          >
            <Trash2 className="w-3 h-3" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-xl bg-zinc-900 rounded-3xl border border-zinc-800 shadow-2xl overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="font-fashion-serif text-lg font-bold text-white">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function AdminVideosClient({ initialVideos }: { initialVideos: VideoItem[] }) {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);
  const [showAdd, setShowAdd] = useState(false);
  const [editVideo, setEditVideo] = useState<VideoItem | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const flash = (msg: string) => { setOk(msg); setTimeout(() => setOk(null), 3500); };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const r = await createVideoAction(new FormData(e.currentTarget));
    setBusy(false);
    if (r.success) { setShowAdd(false); flash('Video added successfully!'); window.location.reload(); }
    else setErr(r.error || 'Failed to add video.');
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const r = await updateVideoAction(new FormData(e.currentTarget));
    setBusy(false);
    if (r.success) { setEditVideo(null); flash('Video updated!'); window.location.reload(); }
    else setErr(r.error || 'Failed to update video.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this video? This cannot be undone.')) return;
    const r = await deleteVideoAction(id);
    if (r.success) { setVideos(v => v.filter(x => x.id !== id)); flash('Video deleted.'); }
    else setErr(r.error || 'Delete failed.');
  };

  const handleToggle = async (id: string, val: boolean) => {
    setBusy(true);
    const r = await toggleVideoFeaturedAction(id, val);
    setBusy(false);
    if (r.success) {
      setVideos(v => v.map(x => x.id === id ? { ...x, isFeatured: val } : x));
      flash(val ? 'Video is now featured on the homepage!' : 'Video removed from homepage.');
    } else setErr(r.error || 'Toggle failed.');
  };

  const featuredCount = videos.filter(v => v.isFeatured).length;

  const SubmitBtn = ({ label }: { label: string }) => (
    <button type="submit" disabled={busy}
      className="w-full py-3.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
      {busy ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : label}
    </button>
  );

  return (
    <div className="space-y-6">

      {/* Toast notifications */}
      {ok && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />{ok}
        </div>
      )}
      {err && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />{err}
          <button onClick={() => setErr(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <Film className="w-5 h-5 text-blue-400" />
          <span><span className="text-white font-bold">{videos.length}</span> video{videos.length !== 1 ? 's' : ''} total</span>
          <span className="text-zinc-700">·</span>
          <span><span className="text-amber-400 font-bold">{featuredCount}</span> featured on homepage</span>
        </div>
        <button
          onClick={() => { setErr(null); setShowAdd(true); }}
          className="px-4 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add New Video
        </button>
      </div>

      {/* Info banner */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-[11px]">
        <Star className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
        <p>Toggle <span className="text-amber-400 font-bold">Featured</span> on any video to show it in the <span className="text-white font-semibold">Video Showcase</span> section on the public homepage. All videos can be browsed in the Gallery page.</p>
      </div>

      {/* Grid */}
      {videos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Film className="w-7 h-7 text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-sm">No videos yet.</p>
          <p className="text-zinc-600 text-xs">Click "Add New Video" to upload your first showcase video.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {videos.map(v => (
            <VideoCard
              key={v.id}
              video={v}
              onEdit={setEditVideo}
              onDelete={handleDelete}
              onToggleFeatured={handleToggle}
              busy={busy}
            />
          ))}
        </div>
      )}

      {/* ── ADD MODAL ── */}
      {showAdd && (
        <Modal title="Add New Showcase Video" onClose={() => { setShowAdd(false); setErr(null); }}>
          <form onSubmit={handleAdd} className="space-y-5">
            {err && <div className="flex items-center gap-2 text-rose-400 text-xs"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{err}</div>}

            <div>
              <label className={LC}>Video Title *</label>
              <input name="title" required placeholder="Behind the Seams: Evening Gown" className={IC} />
            </div>

            <div>
              <label className={LC}>Description *</label>
              <textarea name="description" required rows={3} placeholder="A short description that appears under the video on the homepage…" className={`${IC} resize-none`} />
            </div>

            <VideoPicker label="Video File *" fieldName="videoUrl" required />

            <ThumbnailPicker />

            <div>
              <label className={LC}>Category</label>
              <CategorySelect />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <input type="checkbox" name="isFeatured" value="true" id="add-featured"
                className="w-4 h-4 rounded accent-amber-500" />
              <label htmlFor="add-featured" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                Feature on homepage (show in Video Showcase section)
              </label>
            </div>

            <SubmitBtn label="Add Video" />
          </form>
        </Modal>
      )}

      {/* ── EDIT MODAL ── */}
      {editVideo && (
        <Modal title="Edit Video" onClose={() => { setEditVideo(null); setErr(null); }}>
          <form onSubmit={handleEdit} className="space-y-5">
            <input type="hidden" name="id" value={editVideo.id} />
            {err && <div className="flex items-center gap-2 text-rose-400 text-xs"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{err}</div>}

            <div>
              <label className={LC}>Video Title *</label>
              <input name="title" required defaultValue={editVideo.title} className={IC} />
            </div>

            <div>
              <label className={LC}>Description *</label>
              <textarea name="description" required rows={3} defaultValue={editVideo.description} className={`${IC} resize-none`} />
            </div>

            <VideoPicker label="Video File *" fieldName="videoUrl" defaultUrl={editVideo.videoUrl} required />

            <ThumbnailPicker defaultUrl={editVideo.thumbnailUrl} />

            <div>
              <label className={LC}>Category</label>
              <CategorySelect defaultValue={editVideo.category} />
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
              <input type="checkbox" name="isFeatured" value="true" id="edit-featured"
                defaultChecked={editVideo.isFeatured}
                className="w-4 h-4 rounded accent-amber-500" />
              <label htmlFor="edit-featured" className="text-xs text-zinc-300 font-semibold cursor-pointer">
                Feature on homepage (show in Video Showcase section)
              </label>
            </div>

            <SubmitBtn label="Save Changes" />
          </form>
        </Modal>
      )}
    </div>
  );
}
