'use client';

import React, { useState } from 'react';
import { Plus, Trash2, Edit3, X, Layers, Image as ImageIcon, CheckCircle2, Loader2 } from 'lucide-react';
import { createCollectionAction, updateCollectionAction, deleteCollectionAction, createFashionItemAction, updateFashionItemAction, deleteFashionItemAction } from '@/app/actions/admin';
import { ImagePicker } from './ImagePicker';

interface MediaItem { id: string; url: string; }
interface FashionItemData { id: string; title: string; description: string; category: string; tags: string | null; isFeatured: boolean; media: MediaItem[]; }
interface CollectionItem { id: string; title: string; slug: string; category: string; description: string; coverImage: string; isFeatured: boolean; fashionItems: FashionItemData[]; }

const IC = 'w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white focus:outline-none focus:border-gold-500';
const LC = 'block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1';

function CatSelect({ dv }: { dv?: string }) {
  return (
    <select name="category" defaultValue={dv || 'Traditional/African Wear'} className={IC}>
      <option value="Traditional/African Wear">Traditional/African Wear</option>
      <option value="Men's Wear">Men&apos;s Wear</option>
      <option value="Women's Wear">Women&apos;s Wear</option>
      <option value="Occasion Wear">Occasion Wear</option>
      <option value="Custom Designs">Custom Designs</option>
    </select>
  );
}

export function AdminCollectionsClient({ initialCollections }: { initialCollections: CollectionItem[] }) {
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections);
  const [tab,   setTab]   = useState<'collections'|'gallery'>('collections');
  const [ccm,   setCcm]   = useState(false);
  const [ecm,   setEcm]   = useState<CollectionItem|null>(null);
  const [cim,   setCim]   = useState<string|null>(null);
  const [eim,   setEim]   = useState<FashionItemData|null>(null);
  const [busy,  setBusy]  = useState(false);
  const [err,   setErr]   = useState<string|null>(null);
  const [ok,    setOk]    = useState<string|null>(null);

  const run = async (action: (fd: FormData) => Promise<{success:boolean;error?:string}>, e: React.FormEvent<HTMLFormElement>, onOk: ()=>void, fb: string) => {
    e.preventDefault(); setBusy(true); setErr(null);
    const r = await action(new FormData(e.currentTarget));
    setBusy(false);
    if (r.success) onOk(); else setErr(r.error || fb);
  };

  const delCol = async (id: string) => {
    if (!confirm('Delete this collection and all its photos?')) return;
    const r = await deleteCollectionAction(id);
    if (r.success) { setCollections(c=>c.filter(x=>x.id!==id)); setOk('Collection deleted.'); setTimeout(()=>setOk(null),3000); }
  };

  const delItem = async (id: string) => {
    if (!confirm('Delete this gallery photo?')) return;
    const r = await deleteFashionItemAction(id);
    if (r.success) window.location.reload();
  };

  const Btn = ({label}:{label:string}) => (
    <button type="submit" disabled={busy} className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
      {busy ? <><Loader2 className="w-4 h-4 animate-spin"/>Saving...</> : label}
    </button>
  );

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center space-x-2">
          {(['collections','gallery'] as const).map(t=>(
            <button key={t} onClick={()=>setTab(t)} className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${tab===t?'bg-gold-500 text-zinc-950 shadow-glow':'text-zinc-400 hover:text-white hover:bg-zinc-800'}`}>
              {t==='collections'?<Layers className="w-4 h-4"/>:<ImageIcon className="w-4 h-4"/>}
              <span>{t==='collections'?`Collections (${collections.length})`:'All Gallery Photos'}</span>
            </button>
          ))}
        </div>
        {tab==='collections'
          ? <button onClick={()=>{setErr(null);setCcm(true);}} className="px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow flex items-center space-x-1.5 transition-all self-start sm:self-auto"><Plus className="w-4 h-4"/><span>Add New Collection</span></button>
          : <button onClick={()=>{setErr(null);setCim(collections[0]?.id||'');}} disabled={!collections.length} className="px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow flex items-center space-x-1.5 transition-all self-start sm:self-auto disabled:opacity-50"><Plus className="w-4 h-4"/><span>Add New Gallery Photo</span></button>
        }
      </div>

      {ok && <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2"><CheckCircle2 className="w-4 h-4"/><span>{ok}</span></div>}

      {/* Collections */}
      {tab==='collections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map(col=>(
            <div key={col.id} className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg flex flex-col justify-between group">
              <div className="relative h-52 bg-zinc-950">
                <img src={col.coverImage} alt={col.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  {col.isFeatured && <span className="px-2 py-0.5 rounded-full bg-gold-500 text-zinc-950 text-[9px] font-bold uppercase">Featured</span>}
                  <button onClick={()=>{setErr(null);setEcm(col);}} className="p-1.5 rounded-full bg-zinc-900/80 text-gold-400 hover:bg-gold-500 hover:text-zinc-950 transition-colors"><Edit3 className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>delCol(col.id)} className="p-1.5 rounded-full bg-rose-500/80 text-white hover:bg-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
              <div className="p-5 flex-grow space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">{col.category}</span>
                <h3 className="font-fashion-serif text-lg font-bold text-white">{col.title}</h3>
                <p className="text-zinc-400 text-xs line-clamp-2">{col.description}</p>
              </div>
              <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">{col.fashionItems.length} Gallery Photos</span>
                <button onClick={()=>{setErr(null);setCim(col.id);}} className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center space-x-1"><Plus className="w-3.5 h-3.5"/><span>Add Photo</span></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Gallery */}
      {tab==='gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.flatMap(c=>c.fashionItems).map(item=>{
            const img = item.media[0]?.url||'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
            return (
              <div key={item.id} className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-md p-4 flex flex-col justify-between group">
                <div>
                  <div className="relative h-48 rounded-xl overflow-hidden bg-zinc-950 mb-3">
                    <img src={img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"/>
                    <div className="absolute top-2 right-2 flex space-x-1.5">
                      <button onClick={()=>{setErr(null);setEim(item);}} className="p-1 rounded-full bg-zinc-950/80 text-gold-400 hover:bg-gold-500 hover:text-zinc-950 transition-colors"><Edit3 className="w-3.5 h-3.5"/></button>
                      <button onClick={()=>delItem(item.id)} className="p-1 rounded-full bg-rose-500/80 text-white hover:bg-rose-600 transition-colors"><Trash2 className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                  <h4 className="font-fashion-serif text-sm font-bold text-white line-clamp-1">{item.title}</h4>
                  <p className="text-zinc-400 text-[11px] line-clamp-2 mt-1">{item.description}</p>
                </div>
                <div className="pt-2 border-t border-zinc-800 text-[10px] text-zinc-500 flex justify-between items-center">
                  <span className="text-gold-400 font-semibold">{item.category}</span>
                  {item.tags && <span>#{item.tags.split(',')[0]}</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE COLLECTION */}
      {ccm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button onClick={()=>setCcm(false)} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">Add New Collection</h2>
            {err && <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{err}</div>}
            <form onSubmit={e=>run(createCollectionAction,e,()=>{setCcm(false);window.location.reload();},'Failed to create collection.')} className="space-y-4">
              <div><label className={LC}>Title *</label><input type="text" name="title" required placeholder="e.g. Royal Agbada Collection 2026" className={IC}/></div>
              <div><label className={LC}>Category *</label><CatSelect/></div>
              <div><label className={LC}>Description *</label><textarea name="description" required rows={3} placeholder="Summary of fabrics, motifs..." className={IC}/></div>
              <ImagePicker label="Cover Image" fieldName="coverImage" required/>
              <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" id="cf" name="isFeatured" value="true" className="w-4 h-4 accent-gold-500 rounded"/>
                <label htmlFor="cf" className="text-xs text-zinc-300 font-bold">Feature on Homepage</label>
              </div>
              <Btn label="Create Collection"/>
            </form>
          </div>
        </div>
      )}

      {/* EDIT COLLECTION */}
      {ecm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button onClick={()=>setEcm(null)} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">Edit: {ecm.title}</h2>
            {err && <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{err}</div>}
            <form onSubmit={e=>run(updateCollectionAction,e,()=>{setEcm(null);window.location.reload();},'Failed to update collection.')} className="space-y-4">
              <input type="hidden" name="id" value={ecm.id}/>
              <div><label className={LC}>Title *</label><input type="text" name="title" required defaultValue={ecm.title} className={IC}/></div>
              <div><label className={LC}>Category *</label><CatSelect dv={ecm.category}/></div>
              <div><label className={LC}>Description *</label><textarea name="description" required rows={3} defaultValue={ecm.description} className={IC}/></div>
              <ImagePicker label="Cover Image" fieldName="coverImage" defaultUrl={ecm.coverImage} required/>
              <div className="flex items-center space-x-2 pt-1">
                <input type="checkbox" id="ef" name="isFeatured" value="true" defaultChecked={ecm.isFeatured} className="w-4 h-4 accent-gold-500 rounded"/>
                <label htmlFor="ef" className="text-xs text-zinc-300 font-bold">Feature on Homepage</label>
              </div>
              <Btn label="Save Collection Updates"/>
            </form>
          </div>
        </div>
      )}

      {/* CREATE GALLERY PHOTO */}
      {cim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button onClick={()=>setCim(null)} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">Add New Gallery Photo</h2>
            {err && <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{err}</div>}
            <form onSubmit={e=>run(createFashionItemAction,e,()=>{setCim(null);window.location.reload();},'Failed to add gallery photo.')} className="space-y-4">
              <div>
                <label className={LC}>Assign to Collection *</label>
                <select name="collectionId" defaultValue={cim} className={IC}>
                  {collections.map(c=><option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
              </div>
              <div><label className={LC}>Photo Title *</label><input type="text" name="title" required placeholder="e.g. Navy Velvet Blazer Front View" className={IC}/></div>
              <ImagePicker label="Photo Image" fieldName="imageUrl" required/>
              <div><label className={LC}>Description *</label><textarea name="description" required rows={2} placeholder="Stitching, fabric, embellishment details..." className={IC}/></div>
              <div><label className={LC}>Category Tag</label><input type="text" name="category" placeholder="e.g. Velvet, Agbada, Tuxedo" className={IC}/></div>
              <Btn label="Save Gallery Photo"/>
            </form>
          </div>
        </div>
      )}

      {/* EDIT GALLERY PHOTO */}
      {eim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button onClick={()=>setEim(null)} className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"><X className="w-5 h-5"/></button>
            <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">Edit Gallery Photo</h2>
            {err && <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">{err}</div>}
            <form onSubmit={e=>run(updateFashionItemAction,e,()=>{setEim(null);window.location.reload();},'Failed to update photo.')} className="space-y-4">
              <input type="hidden" name="id" value={eim.id}/>
              <div><label className={LC}>Photo Title *</label><input type="text" name="title" required defaultValue={eim.title} className={IC}/></div>
              <ImagePicker label="Photo Image" fieldName="imageUrl" defaultUrl={eim.media[0]?.url||''}/>
              <div><label className={LC}>Description *</label><textarea name="description" required rows={2} defaultValue={eim.description} className={IC}/></div>
              <div><label className={LC}>Category Tag</label><input type="text" name="category" defaultValue={eim.category} className={IC}/></div>
              <Btn label="Save Photo Updates"/>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
