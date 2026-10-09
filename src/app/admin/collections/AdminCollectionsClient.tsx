'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  X, 
  Layers, 
  Image as ImageIcon, 
  Sparkles,
  Tag,
  CheckCircle2
} from 'lucide-react';
import { 
  createCollectionAction, 
  updateCollectionAction, 
  deleteCollectionAction,
  createFashionItemAction,
  updateFashionItemAction,
  deleteFashionItemAction
} from '@/app/actions/admin';

interface MediaItem {
  id: string;
  url: string;
}

interface FashionItemData {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string;
  isFeatured: boolean;
  media: MediaItem[];
}

interface CollectionItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
  isFeatured: boolean;
  fashionItems: FashionItemData[];
}

interface AdminCollectionsClientProps {
  initialCollections: CollectionItem[];
}

export function AdminCollectionsClient({ initialCollections }: AdminCollectionsClientProps) {
  const [collections, setCollections] = useState<CollectionItem[]>(initialCollections);
  const [activeTab, setActiveTab] = useState<'collections' | 'gallery'>('collections');

  // Collection Modals
  const [createColModalOpen, setCreateColModalOpen] = useState(false);
  const [editColModalOpen, setEditColModalOpen] = useState<CollectionItem | null>(null);

  // Gallery Item Modals
  const [createItemModalOpen, setCreateItemModalOpen] = useState<string | null>(null); // collectionId
  const [editItemModalOpen, setEditItemModalOpen] = useState<FashionItemData | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // --- COLLECTION HANDLERS ---
  const handleCreateCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createCollectionAction(formData);
    setLoading(false);
    if (res.success) {
      setCreateColModalOpen(false);
      window.location.reload();
    } else {
      setError(res.error || 'Failed to create collection.');
    }
  };

  const handleEditCollection = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateCollectionAction(formData);
    setLoading(false);
    if (res.success) {
      setEditColModalOpen(null);
      window.location.reload();
    } else {
      setError(res.error || 'Failed to update collection.');
    }
  };

  const handleDeleteCollection = async (id: string) => {
    if (!confirm('Are you sure you want to delete this collection and all its fashion items?')) return;
    const res = await deleteCollectionAction(id);
    if (res.success) {
      setCollections(collections.filter((c) => c.id !== id));
      setSuccessMsg('Collection deleted.');
      setTimeout(() => setSuccessMsg(null), 3000);
    }
  };

  // --- GALLERY ITEM HANDLERS ---
  const handleCreateItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await createFashionItemAction(formData);
    setLoading(false);
    if (res.success) {
      setCreateItemModalOpen(null);
      window.location.reload();
    } else {
      setError(res.error || 'Failed to add gallery item.');
    }
  };

  const handleEditItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const res = await updateFashionItemAction(formData);
    setLoading(false);
    if (res.success) {
      setEditItemModalOpen(null);
      window.location.reload();
    } else {
      setError(res.error || 'Failed to update item.');
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('Are you sure you want to delete this gallery photo?')) return;
    const res = await deleteFashionItemAction(itemId);
    if (res.success) {
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Control Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('collections')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'collections'
                ? 'bg-gold-500 text-zinc-950 shadow-glow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Collections ({collections.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center space-x-2 ${
              activeTab === 'gallery'
                ? 'bg-gold-500 text-zinc-950 shadow-glow'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>All Gallery Photos</span>
          </button>
        </div>

        {activeTab === 'collections' ? (
          <button
            onClick={() => setCreateColModalOpen(true)}
            className="px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow flex items-center space-x-1.5 transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Collection</span>
          </button>
        ) : (
          <button
            onClick={() => setCreateItemModalOpen(collections[0]?.id || '')}
            disabled={collections.length === 0}
            className="px-4 py-2.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow flex items-center space-x-1.5 transition-all self-start sm:self-auto disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Gallery Photo</span>
          </button>
        )}
      </div>

      {successMsg && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 1. COLLECTIONS TAB VIEW */}
      {activeTab === 'collections' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {collections.map((col) => (
            <div
              key={col.id}
              className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-lg flex flex-col justify-between group"
            >
              <div className="relative h-52 bg-zinc-950">
                <img
                  src={col.coverImage}
                  alt={col.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 right-3 flex items-center space-x-2">
                  {col.isFeatured && (
                    <span className="px-2 py-0.5 rounded-full bg-gold-500 text-zinc-950 text-[9px] font-bold uppercase">
                      Featured
                    </span>
                  )}
                  <button
                    onClick={() => setEditColModalOpen(col)}
                    className="p-1.5 rounded-full bg-zinc-900/80 text-gold-400 hover:bg-gold-500 hover:text-zinc-950 transition-colors"
                    title="Edit Collection"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCollection(col.id)}
                    className="p-1.5 rounded-full bg-rose-500/80 text-white hover:bg-rose-600 transition-colors"
                    title="Delete Collection"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="p-5 flex-grow space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-400 block">
                  {col.category}
                </span>
                <h3 className="font-fashion-serif text-lg font-bold text-white">
                  {col.title}
                </h3>
                <p className="text-zinc-400 text-xs line-clamp-2">
                  {col.description}
                </p>
              </div>

              <div className="p-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] text-zinc-400">
                  {col.fashionItems.length} Gallery Photos
                </span>
                <button
                  onClick={() => setCreateItemModalOpen(col.id)}
                  className="text-xs font-bold text-gold-400 hover:text-gold-300 flex items-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Photo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. ALL GALLERY PHOTOS TAB VIEW */}
      {activeTab === 'gallery' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {collections.flatMap(c => c.fashionItems).map((item) => {
            const imgUrl = item.media[0]?.url || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
            return (
              <div
                key={item.id}
                className="rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden shadow-md space-y-3 p-4 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-48 rounded-xl overflow-hidden bg-zinc-950 mb-3">
                    <img
                      src={imgUrl}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 flex space-x-1.5">
                      <button
                        onClick={() => setEditItemModalOpen(item)}
                        className="p-1 rounded-full bg-zinc-950/80 text-gold-400 hover:bg-gold-500 hover:text-zinc-950 transition-colors"
                        title="Edit Photo Info"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-1 rounded-full bg-rose-500/80 text-white hover:bg-rose-600 transition-colors"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-fashion-serif text-sm font-bold text-white line-clamp-1">
                    {item.title}
                  </h4>
                  <p className="text-zinc-400 text-[11px] line-clamp-2 mt-1">
                    {item.description}
                  </p>
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

      {/* --- MODAL: CREATE COLLECTION --- */}
      {createColModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setCreateColModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">
              Add New Collection
            </h2>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Collection Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Royal Agbada Collection 2026"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  defaultValue="Traditional/African Wear"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                >
                  <option value="Traditional/African Wear">Traditional/African Wear</option>
                  <option value="Men's Wear">Men's Wear</option>
                  <option value="Women's Wear">Women's Wear</option>
                  <option value="Occasion Wear">Occasion Wear</option>
                  <option value="Custom Designs">Custom Designs</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  placeholder="Summary of fabrics, motifs, and silhouettes..."
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  name="coverImage"
                  required
                  placeholder="https://images.unsplash.com/sample.jpg"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  name="isFeatured"
                  value="true"
                  className="w-4 h-4 accent-gold-500 rounded"
                />
                <label htmlFor="isFeatured" className="text-xs text-zinc-300 font-bold">
                  Feature on Homepage
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-colors"
              >
                {loading ? 'Creating...' : 'Create Collection'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT COLLECTION --- */}
      {editColModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setEditColModalOpen(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">
              Edit Collection: {editColModalOpen.title}
            </h2>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleEditCollection} className="space-y-4">
              <input type="hidden" name="id" value={editColModalOpen.id} />

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Collection Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editColModalOpen.title}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  defaultValue={editColModalOpen.category}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                >
                  <option value="Traditional/African Wear">Traditional/African Wear</option>
                  <option value="Men's Wear">Men's Wear</option>
                  <option value="Women's Wear">Women's Wear</option>
                  <option value="Occasion Wear">Occasion Wear</option>
                  <option value="Custom Designs">Custom Designs</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={3}
                  defaultValue={editColModalOpen.description}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Cover Image URL *
                </label>
                <input
                  type="url"
                  name="coverImage"
                  required
                  defaultValue={editColModalOpen.coverImage}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="editIsFeatured"
                  name="isFeatured"
                  value="true"
                  defaultChecked={editColModalOpen.isFeatured}
                  className="w-4 h-4 accent-gold-500 rounded"
                />
                <label htmlFor="editIsFeatured" className="text-xs text-zinc-300 font-bold">
                  Feature on Homepage
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-colors"
              >
                {loading ? 'Saving Changes...' : 'Save Collection Updates'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: CREATE GALLERY PHOTO --- */}
      {createItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setCreateItemModalOpen(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">
              Add New Gallery Photo
            </h2>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateItem} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Assign to Collection *
                </label>
                <select
                  name="collectionId"
                  defaultValue={createItemModalOpen}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                >
                  {collections.map(c => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Navy Velvet Blazer Front View"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  placeholder="https://images.unsplash.com/sample.jpg"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  placeholder="Details about stitching, fabric, embellishment..."
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  name="category"
                  placeholder="e.g. Velvet, Agbada, Tuxedo"
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-colors"
              >
                {loading ? 'Uploading...' : 'Save Gallery Photo'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL: EDIT GALLERY PHOTO --- */}
      {editItemModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-zinc-900 border border-zinc-800 p-6 sm:p-8 text-white shadow-2xl">
            <button
              onClick={() => setEditItemModalOpen(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-zinc-800 text-zinc-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="font-fashion-serif text-2xl font-bold mb-6 border-l-2 border-gold-500 pl-3">
              Edit Gallery Photo
            </h2>

            {error && (
              <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleEditItem} className="space-y-4">
              <input type="hidden" name="id" value={editItemModalOpen.id} />

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Photo Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editItemModalOpen.title}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Image URL *
                </label>
                <input
                  type="url"
                  name="imageUrl"
                  required
                  defaultValue={editItemModalOpen.media[0]?.url || ''}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={2}
                  defaultValue={editItemModalOpen.description}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-zinc-400 mb-1">
                  Category Tag
                </label>
                <input
                  type="text"
                  name="category"
                  defaultValue={editItemModalOpen.category}
                  className="w-full p-3 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-gold-500 hover:bg-gold-400 text-zinc-950 font-bold text-xs uppercase tracking-wider shadow-glow transition-colors"
              >
                {loading ? 'Saving Changes...' : 'Save Photo Updates'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
