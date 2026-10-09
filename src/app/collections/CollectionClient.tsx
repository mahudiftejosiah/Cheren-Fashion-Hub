'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, X, Tag, ArrowRight, ChevronLeft, ChevronRight, Eye, Crown, Sparkles } from 'lucide-react';

interface MediaItem {
  id: string;
  url: string;
  mediaType: string;
  altText: string | null;
}

interface FashionItemData {
  id: string;
  collectionId: string | null;
  title: string;
  description: string;
  category: string;
  tags: string | null;
  isFeatured: boolean;
  media: MediaItem[];
}

interface CollectionData {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  coverImage: string;
}

interface CollectionClientProps {
  collections: CollectionData[];
  fashionItems: FashionItemData[];
}

export function CollectionClient({ collections, fashionItems }: CollectionClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeItem, setActiveItem] = useState<FashionItemData | null>(null);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);

  const categories = [
    'ALL',
    "Women's Wear",
    "Men's Wear",
    'Traditional/African Wear',
    'Occasion Wear',
    'Custom Designs',
    'Ready-to-Wear',
  ];

  // Filter items
  const filteredItems = fashionItems.filter((item) => {
    const matchesCategory =
      selectedCategory === 'ALL' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tags && item.tags.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const openLightbox = (item: FashionItemData) => {
    setActiveItem(item);
    setActiveMediaIndex(0);
  };

  const closeLightbox = () => {
    setActiveItem(null);
  };

  return (
    <div className="space-y-10">
      
      {/* Category Pills & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-4 rounded-3xl luxury-border bg-zinc-900 shadow-xl">
        {/* Category Pills */}
        <div className="flex items-center space-x-2.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white shadow-pink-glow scale-105 border border-pink-300/40'
                  : 'bg-zinc-950 text-zinc-300 hover:text-pink-400 border border-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4 h-4 text-pink-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search designs or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-full bg-zinc-950 border border-pink-500/30 text-xs text-white focus:outline-none focus:border-pink-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Grid of Fashion Items */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/40 rounded-3xl luxury-border">
          <Crown className="w-12 h-12 text-pink-400 mx-auto mb-3 opacity-60" />
          <p className="text-zinc-400 text-sm font-light">
            No fashion items match your filter criteria. Try adjusting your search query.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => {
            const coverUrl =
              item.media[0]?.url ||
              'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop';
            return (
              <div
                key={item.id}
                onClick={() => openLightbox(item)}
                className="group relative rounded-3xl overflow-hidden luxury-border bg-zinc-950 p-4 shadow-xl cursor-pointer transition-all flex flex-col justify-between"
              >
                <div className="relative h-96 rounded-2xl overflow-hidden bg-zinc-900 mb-5">
                  <img
                    src={coverUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60 group-hover:opacity-85 transition-opacity" />

                  {/* Category Badge */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md border border-pink-500/30 text-pink-400 text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </div>

                  {/* Inspect Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-5 py-2.5 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest flex items-center space-x-2 shadow-pink-glow border border-pink-300/40">
                      <Eye className="w-4 h-4 stroke-[2.5]" />
                      <span>Inspect Piece</span>
                    </span>
                  </div>
                </div>

                <div className="px-2 pb-2 space-y-3">
                  <h3 className="font-fashion-serif text-2xl font-bold text-white group-hover:text-pink-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-zinc-400 text-xs font-light line-clamp-2">
                    {item.description}
                  </p>

                  {item.tags && (
                    <div className="flex items-center space-x-1.5 text-pink-400 text-[11px] font-medium pt-1">
                      <Tag className="w-3.5 h-3.5" />
                      <span className="truncate">{item.tags}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox Modal */}
      {activeItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-zinc-950/95 backdrop-blur-xl animate-fade-in">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl luxury-border bg-zinc-900 text-white shadow-2xl p-6 sm:p-10">
            
            <button
              onClick={closeLightbox}
              className="absolute top-5 right-5 p-2.5 rounded-full bg-zinc-950 border border-pink-500/30 text-pink-400 hover:text-white hover:border-pink-400 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Media Preview Carousel */}
              <div className="space-y-4">
                <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-zinc-950 border border-pink-500/20">
                  {activeItem.media[activeMediaIndex] && (
                    <img
                      src={activeItem.media[activeMediaIndex].url}
                      alt={activeItem.title}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {activeItem.media.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMediaIndex((prev) =>
                            prev === 0 ? activeItem.media.length - 1 : prev - 1
                          );
                        }}
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/80 text-pink-400 border border-pink-500/30 hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMediaIndex((prev) =>
                            prev === activeItem.media.length - 1 ? 0 : prev + 1
                          );
                        }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-zinc-950/80 text-pink-400 border border-pink-500/30 hover:bg-pink-500 hover:text-white transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {activeItem.media.length > 1 && (
                  <div className="flex space-x-3 overflow-x-auto">
                    {activeItem.media.map((med, idx) => (
                      <button
                        key={med.id}
                        onClick={() => setActiveMediaIndex(idx)}
                        className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                          activeMediaIndex === idx
                            ? 'border-pink-400 scale-105 shadow-pink-glow'
                            : 'border-zinc-800 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={med.url}
                          alt="Thumbnail"
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Item Info */}
              <div className="flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="px-3.5 py-1 rounded-full bg-pink-500/15 border border-pink-400/40 text-pink-300 text-xs font-bold uppercase tracking-wider inline-block">
                    {activeItem.category}
                  </span>
                  <h3 className="font-fashion-serif text-3xl font-bold text-white">
                    {activeItem.title}
                  </h3>
                  <p className="text-zinc-300 text-sm font-light leading-relaxed">
                    {activeItem.description}
                  </p>

                  {activeItem.tags && (
                    <div className="pt-2">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                        Tags & Features:
                      </span>
                      <p className="text-xs text-pink-400 font-mono">{activeItem.tags}</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-zinc-800">
                  <Link
                    href={`/quote?outfit=${encodeURIComponent(activeItem.title)}`}
                    onClick={closeLightbox}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-red-500 via-pink-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-2 shadow-pink-glow hover:scale-105 transition-all border border-pink-300/40"
                  >
                    <span>Request Custom Order Like This</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

