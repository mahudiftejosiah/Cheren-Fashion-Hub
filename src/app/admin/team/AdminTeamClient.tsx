'use client';

import React, { useState, useRef } from 'react';
import {
  Plus, Trash2, Edit3, X, Loader2, CheckCircle2, AlertCircle,
  Upload, Link2, RefreshCw, Users, Eye, EyeOff,
} from 'lucide-react';
import {
  createTeamMemberAction,
  updateTeamMemberAction,
  deleteTeamMemberAction,
  toggleTeamMemberPublishAction,
} from '@/app/actions/admin';

// ─── Types ────────────────────────────────────────────────────────────────────
interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  imageUrl: string;
  displayOrder: number;
  isPublished: boolean;
  createdAt: Date;
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const IC = 'w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-pink-500 placeholder:text-zinc-600 transition-colors';
const LC = 'block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1';

// ─── Image picker ─────────────────────────────────────────────────────────────
function PhotoPicker({ label, fieldName, defaultUrl = '', required = false }: {
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
    if (!['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)) {
      setErr('Only JPG, PNG, WebP allowed.'); return;
    }
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
        <label className={LC}>{label}{required && ' *'}</label>
        <div className="flex rounded-lg overflow-hidden border border-zinc-700 text-[10px] font-bold">
          {(['url', 'upload'] as const).map(m => (
            <button key={m} type="button" onClick={() => { setMode(m); setErr(null); }}
              className={`px-3 py-1.5 flex items-center gap-1.5 uppercase transition-colors ${mode === m ? 'bg-pink-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'}`}>
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
          placeholder="https://example.com/photo.jpg"
          className={IC} />
      )}

      {mode === 'upload' && (
        <div onClick={() => !uploading && fileRef.current?.click()}
          className={`w-full rounded-xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center py-5 gap-2 transition-colors ${uploading ? 'border-pink-500/50 bg-pink-500/5' : 'border-zinc-700 hover:border-pink-500/60 bg-zinc-950'}`}>
          {uploading
            ? <><Loader2 className="w-5 h-5 text-pink-400 animate-spin" /><span className="text-xs text-pink-400">Uploading...</span></>
            : <><Upload className="w-5 h-5 text-zinc-500" /><span className="text-xs text-zinc-400">Click to upload photo</span><span className="text-[10px] text-zinc-600">JPG, PNG, WebP · max 10 MB</span></>}
          <input ref={fileRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden" onChange={handleFile} disabled={uploading} />
        </div>
      )}

      {err && <div className="flex items-center gap-2 text-rose-400 text-[11px]"><AlertCircle className="w-3.5 h-3.5 shrink-0" /><span>{err}</span></div>}

      {preview && !err && (
        <div className="relative rounded-xl overflow-hidden border border-zinc-700 bg-zinc-950 h-40">
          <img src={preview} alt="Preview" className="w-full h-full object-cover object-top"
            onError={() => { setErr('Could not load image.'); setPreview(''); setFinalUrl(''); }} />
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button type="button" onClick={() => fileRef.current?.click()} className="p-1.5 rounded-full bg-zinc-900/90 text-zinc-300 hover:text-white"><RefreshCw className="w-3 h-3" /></button>
            <button type="button" onClick={clear} className="p-1.5 rounded-full bg-rose-600/90 text-white hover:bg-rose-500"><X className="w-3 h-3" /></button>
          </div>
          {uploading && <div className="absolute inset-0 bg-zinc-950/60 flex items-center justify-center"><Loader2 className="w-5 h-5 text-pink-400 animate-spin" /></div>}
        </div>
      )}

      <input type="hidden" name={fieldName} value={finalUrl} required={required} />
    </div>
  );
}

// ─── Member card ──────────────────────────────────────────────────────────────
function MemberCard({ member, onEdit, onDelete, onTogglePublish, busy }: {
  member: TeamMember;
  onEdit: (m: TeamMember) => void;
  onDelete: (id: string) => void;
  onTogglePublish: (id: string, val: boolean) => void;
  busy: boolean;
}) {
  return (
    <div className={`rounded-2xl overflow-hidden border bg-zinc-900 shadow-xl flex flex-col transition-all ${member.isPublished ? 'border-zinc-700' : 'border-zinc-800 opacity-60'}`}>
      {/* Photo */}
      <div className="relative h-56 bg-zinc-950">
        <img src={member.imageUrl} alt={member.name} className="w-full h-full object-cover object-top" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />
        {!member.isPublished && (
          <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-zinc-800/90 text-zinc-400 text-[10px] font-bold uppercase tracking-wider border border-zinc-700">
            Hidden
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="font-fashion-serif text-lg font-bold text-white leading-tight">{member.name}</p>
          <p className="text-pink-300 text-[11px] font-semibold uppercase tracking-wider mt-0.5">{member.role}</p>
        </div>
      </div>

      {/* Bio */}
      {member.bio && (
        <div className="px-4 pt-3">
          <p className="text-zinc-400 text-xs leading-relaxed line-clamp-2">{member.bio}</p>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2 p-4 mt-auto border-t border-zinc-800">
        <button onClick={() => onTogglePublish(member.id, !member.isPublished)} disabled={busy}
          title={member.isPublished ? 'Hide from About page' : 'Show on About page'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 ${
            member.isPublished
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 hover:bg-emerald-500/30'
              : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-700 hover:text-white'
          }`}>
          {member.isPublished ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
          {member.isPublished ? 'Visible' : 'Hidden'}
        </button>

        <button onClick={() => onEdit(member)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-600/20 text-blue-400 border border-blue-500/40 hover:bg-blue-600/30 text-[10px] font-bold uppercase tracking-wider transition-all">
          <Edit3 className="w-3 h-3" /> Edit
        </button>

        <button onClick={() => onDelete(member.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-600/20 text-rose-400 border border-rose-500/40 hover:bg-rose-600/30 text-[10px] font-bold uppercase tracking-wider transition-all ml-auto">
          <Trash2 className="w-3 h-3" /> Delete
        </button>
      </div>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
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
export function AdminTeamClient({ initialMembers }: { initialMembers: TeamMember[] }) {
  const [members, setMembers] = useState<TeamMember[]>(initialMembers);
  const [showAdd, setShowAdd] = useState(false);
  const [editMember, setEditMember] = useState<TeamMember | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const flash = (msg: string) => { setOk(msg); setTimeout(() => setOk(null), 3500); };

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const r = await createTeamMemberAction(new FormData(e.currentTarget));
    setBusy(false);
    if (r.success) { setShowAdd(false); flash('Team member added!'); window.location.reload(); }
    else setErr(r.error || 'Failed to add member.');
  };

  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true); setErr(null);
    const r = await updateTeamMemberAction(new FormData(e.currentTarget));
    setBusy(false);
    if (r.success) { setEditMember(null); flash('Team member updated!'); window.location.reload(); }
    else setErr(r.error || 'Failed to update member.');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this team member? This cannot be undone.')) return;
    const r = await deleteTeamMemberAction(id);
    if (r.success) { setMembers(m => m.filter(x => x.id !== id)); flash('Team member removed.'); }
    else setErr(r.error || 'Delete failed.');
  };

  const handleToggle = async (id: string, val: boolean) => {
    setBusy(true);
    const r = await toggleTeamMemberPublishAction(id, val);
    setBusy(false);
    if (r.success) {
      setMembers(m => m.map(x => x.id === id ? { ...x, isPublished: val } : x));
      flash(val ? 'Member is now visible on the About page.' : 'Member hidden from About page.');
    } else setErr(r.error || 'Toggle failed.');
  };

  const SubmitBtn = ({ label }: { label: string }) => (
    <button type="submit" disabled={busy}
      className="w-full py-3.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-60 flex items-center justify-center gap-2">
      {busy ? <><Loader2 className="w-4 h-4 animate-spin" />Saving…</> : label}
    </button>
  );

  const MemberForm = ({ member }: { member?: TeamMember }) => (
    <form onSubmit={member ? handleEdit : handleAdd} className="space-y-5">
      {member && <input type="hidden" name="id" value={member.id} />}
      {err && <div className="flex items-center gap-2 text-rose-400 text-xs"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{err}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={LC}>Full Name *</label>
          <input name="name" required defaultValue={member?.name} placeholder="e.g. Amara Johnson" className={IC} />
        </div>
        <div>
          <label className={LC}>Title / Role *</label>
          <input name="role" required defaultValue={member?.role} placeholder="e.g. Co-Founder & Creative Director" className={IC} />
        </div>
      </div>

      <div>
        <label className={LC}>Short Bio (optional)</label>
        <textarea name="bio" rows={3} defaultValue={member?.bio || ''} placeholder="A short biography about this person…" className={`${IC} resize-none`} />
      </div>

      <PhotoPicker label="Profile Photo *" fieldName="imageUrl" defaultUrl={member?.imageUrl} required />

      <div>
        <label className={LC}>Display Order</label>
        <input type="number" name="displayOrder" min="0" defaultValue={member?.displayOrder ?? 0}
          className={IC} placeholder="0 = first" />
        <p className="text-zinc-600 text-[10px] mt-1">Lower numbers appear first on the page.</p>
      </div>

      <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-950 border border-zinc-800">
        <input type="checkbox" name="isPublished" value="true" id={`pub-${member?.id ?? 'new'}`}
          defaultChecked={member?.isPublished ?? true}
          className="w-4 h-4 rounded accent-pink-500" />
        <label htmlFor={`pub-${member?.id ?? 'new'}`} className="text-xs text-zinc-300 font-semibold cursor-pointer">
          Visible on About page
        </label>
      </div>

      <SubmitBtn label={member ? 'Save Changes' : 'Add Team Member'} />
    </form>
  );

  return (
    <div className="space-y-6">

      {/* Toasts */}
      {ok && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
          <CheckCircle2 className="w-4 h-4 shrink-0" />{ok}
        </div>
      )}
      {err && !showAdd && !editMember && (
        <div className="flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
          <AlertCircle className="w-4 h-4 shrink-0" />{err}
          <button onClick={() => setErr(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center gap-3 text-xs text-zinc-400">
          <Users className="w-5 h-5 text-pink-400" />
          <span><span className="text-white font-bold">{members.length}</span> team member{members.length !== 1 ? 's' : ''}</span>
          <span className="text-zinc-700">·</span>
          <span><span className="text-emerald-400 font-bold">{members.filter(m => m.isPublished).length}</span> visible on About page</span>
        </div>
        <button onClick={() => { setErr(null); setShowAdd(true); }}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg self-start sm:self-auto">
          <Plus className="w-4 h-4" /> Add Team Member
        </button>
      </div>

      {/* Hint */}
      <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-zinc-900/50 border border-zinc-800 text-zinc-400 text-[11px]">
        <Users className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
        <p>Add co-founders or team members here. Use <span className="text-emerald-400 font-bold">Visible</span> toggle to show/hide them on the public <span className="text-white font-semibold">About</span> page. Use <span className="text-white font-semibold">Display Order</span> to control who appears first.</p>
      </div>

      {/* Grid */}
      {members.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <Users className="w-7 h-7 text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-sm">No team members yet.</p>
          <p className="text-zinc-600 text-xs">Click "Add Team Member" to add the first co-founder.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map(m => (
            <MemberCard key={m.id} member={m} onEdit={setEditMember}
              onDelete={handleDelete} onTogglePublish={handleToggle} busy={busy} />
          ))}
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <Modal title="Add New Team Member" onClose={() => { setShowAdd(false); setErr(null); }}>
          <MemberForm />
        </Modal>
      )}

      {/* EDIT MODAL */}
      {editMember && (
        <Modal title="Edit Team Member" onClose={() => { setEditMember(null); setErr(null); }}>
          <MemberForm member={editMember} />
        </Modal>
      )}
    </div>
  );
}
